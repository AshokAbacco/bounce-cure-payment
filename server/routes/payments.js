const express = require("express");
const router = express.Router();
const db = require("../db");

// =========================
// AUTH MIDDLEWARE
// =========================
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized - missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (token !== "admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
});

// =========================
// GET ALL PAYMENTS
// =========================
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        "id","userId","email","name",
        "transactionId","customInvoiceId",
        "planName","planType","provider",
        "amount","currency",
        "planPrice","discount",
        "paymentMethod","cardLast4",
        "billingAddress",
        "paymentDate","nextPaymentDate",
        "status","notified",
        "emailSendCredits",
        "emailVerificationCredits",
        "smsCredits",
        "whatsappCredits",
        "createdAt","updatedAt"
      FROM "Payment"
      ORDER BY "id" DESC;
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/payments error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// =========================
// UPDATE PAYMENT
// =========================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // 1. Get old payment
    const old = await db.query(
      `SELECT "userId", "emailSendCredits", "emailVerificationCredits",
              "smsCredits", "whatsappCredits"
       FROM "Payment" WHERE "id" = $1`,
      [id]
    );

    if (old.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const oldPayment = old.rows[0];

    // 2. Update current payment
    const sql = `
      UPDATE "Payment" SET
        "name" = $1, "email" = $2, "transactionId" = $3,
        "customInvoiceId" = $4, "planName" = $5, "planType" = $6,
        "provider" = $7, "amount" = $8, "currency" = $9, "planPrice" = $10,
        "discount" = $11, "paymentMethod" = $12, "cardLast4" = $13,
        "billingAddress" = $14, "paymentDate" = $15,
        "nextPaymentDate" = $16, "status" = $17, "notified" = $18,
        "emailSendCredits" = $19, "emailVerificationCredits" = $20,
        "smsCredits" = $21, "whatsappCredits" = $22,
        "updatedAt" = NOW()
      WHERE "id" = $23
      RETURNING *;
    `;

    const newValues = [
      data.name, data.email, data.transactionId, data.customInvoiceId,
      data.planName, data.planType, data.provider, data.amount,
      data.currency, data.planPrice, data.discount, data.paymentMethod,
      data.cardLast4, data.billingAddress, data.paymentDate,
      data.nextPaymentDate, data.status, data.notified,
      data.emailSendCredits, data.emailVerificationCredits,
      data.smsCredits, data.whatsappCredits, id
    ];

    const result = await db.query(sql, newValues);
    const newPayment = result.rows[0];

    // 3. Recalculate user credits (subtract old + add new)
    await db.query(
      `UPDATE "User" SET
          "contactLimit"    = COALESCE("contactLimit", 0) 
                              - $1 + $2,
          "emailLimit"      = COALESCE("emailLimit", 0) 
                              - $3 + $4,
          "smsCredits"      = COALESCE("smsCredits", 0)
                              - $5 + $6,
          "whatsappCredits" = COALESCE("whatsappCredits", 0)
                              - $7 + $8,
          "updatedAt"       = NOW()
        WHERE "id" = $9`,
      [
        oldPayment.emailVerificationCredits || 0,
        newPayment.emailVerificationCredits || 0,

        oldPayment.emailSendCredits || 0,
        newPayment.emailSendCredits || 0,

        oldPayment.smsCredits || 0,
        newPayment.smsCredits || 0,

        oldPayment.whatsappCredits || 0,
        newPayment.whatsappCredits || 0,

        newPayment.userId
      ]
    );

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: newPayment
    });

  } catch (err) {
    console.error(`PUT /api/payments/${id} error:`, err);
    res.status(500).json({ message: "Database Error" });
  }
});

// =========================
// DELETE PAYMENT
// =========================
router.delete("/:id", async (req, res) => {
  try {
    // 1. Fetch old payment before deleting
    const old = await db.query(
      `SELECT "userId", "emailSendCredits", "emailVerificationCredits",
              "smsCredits", "whatsappCredits"
       FROM "Payment"
       WHERE "id" = $1`,
      [req.params.id]
    );

    if (old.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const p = old.rows[0];

    // 2. Reverse user credits
    await db.query(
      `UPDATE "User" SET
          "contactLimit"    = COALESCE("contactLimit", 0) - $1,
          "emailLimit"      = COALESCE("emailLimit", 0) - $2,
          "smsCredits"      = COALESCE("smsCredits", 0) - $3,
          "whatsappCredits" = COALESCE("whatsappCredits", 0) - $4,
          "updatedAt"       = NOW()
        WHERE "id" = $5`,
      [
        p.emailVerificationCredits || 0,
        p.emailSendCredits || 0,
        p.smsCredits || 0,
        p.whatsappCredits || 0,
        p.userId
      ]
    );

    // 3. Delete payment
    await db.query(
      `DELETE FROM "Payment" WHERE "id" = $1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Payment deleted successfully"
    });

  } catch (err) {
    console.error("DELETE /api/payments error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// =========================
// ADD NEW PAYMENT
// =========================
router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const sql = `
      INSERT INTO "Payment" (
        "userId","email","name","transactionId","customInvoiceId",
        "planName","planType","provider",
        "amount","currency","planPrice","discount",
        "paymentMethod","cardLast4","billingAddress",
        "paymentDate","nextPaymentDate",
        "status","notified",
        "emailSendCredits","emailVerificationCredits",
        "smsCredits","whatsappCredits",
        "createdAt","updatedAt"
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,
        $9,$10,$11,$12,
        $13,$14,$15,
        $16,$17,
        $18,$19,
        $20,$21,$22,$23,
        NOW(),NOW()
      )
      RETURNING *;
    `;

    const values = [
      data.userId, data.email, data.name, data.transactionId,
      data.customInvoiceId, data.planName, data.planType,
      data.provider, data.amount, data.currency, data.planPrice,
      data.discount, data.paymentMethod, data.cardLast4,
      data.billingAddress, data.paymentDate, data.nextPaymentDate,
      data.status, data.notified, data.emailSendCredits,
      data.emailVerificationCredits, data.smsCredits, data.whatsappCredits
    ];

    const result = await db.query(sql, values);
    const payment = result.rows[0];

    // Update user credits
    await db.query(
      `UPDATE "User" SET
          "contactLimit"    = COALESCE("contactLimit", 0) + $1,
          "emailLimit"      = COALESCE("emailLimit", 0) + $2,
          "smsCredits"      = COALESCE("smsCredits", 0) + $3,
          "whatsappCredits" = COALESCE("whatsappCredits", 0) + $4,
          "updatedAt"       = NOW()
        WHERE "id" = $5`,
      [
        payment.emailVerificationCredits || 0,
        payment.emailSendCredits || 0,
        payment.smsCredits || 0,
        payment.whatsappCredits || 0,
        payment.userId
      ]
    );

    res.json({
      success: true,
      message: "Payment created successfully",
      data: payment
    });

  } catch (err) {
    console.error("POST /api/payments error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

module.exports = router;
