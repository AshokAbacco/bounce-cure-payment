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
  const data = req.body || {};

  try {
    const sql = `
      UPDATE "Payment" SET
        "name"                      = $1,
        "email"                     = $2,
        "transactionId"             = $3,
        "customInvoiceId"           = $4,
        "planName"                  = $5,
        "planType"                  = $6,
        "provider"                  = $7,
        "amount"                    = $8,
        "currency"                  = $9,
        "planPrice"                 = $10,
        "discount"                  = $11,
        "paymentMethod"             = $12,
        "cardLast4"                 = $13,
        "billingAddress"            = $14,
        "paymentDate"               = $15,
        "nextPaymentDate"           = $16,
        "status"                    = $17,
        "notified"                  = $18,
        "emailSendCredits"          = $19,
        "emailVerificationCredits"  = $20,
        "smsCredits"                = $21,
        "whatsappCredits"           = $22,
        "updatedAt"                 = NOW()
      WHERE "id" = $23
      RETURNING *;
    `;

    const values = [
      data.name,
      data.email,
      data.transactionId,
      data.customInvoiceId,
      data.planName,
      data.planType,
      data.provider,
      data.amount,
      data.currency,
      data.planPrice,
      data.discount,
      data.paymentMethod,
      data.cardLast4,
      data.billingAddress,
      data.paymentDate,
      data.nextPaymentDate,
      data.status,
      data.notified,
      data.emailSendCredits,
      data.emailVerificationCredits,
      data.smsCredits,
      data.whatsappCredits,
      id
    ];

    const result = await db.query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(result.rows[0]);
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
    const sql = `
      DELETE FROM "Payment"
      WHERE "id" = $1
      RETURNING "id";
    `;

    const result = await db.query(sql, [req.params.id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, deletedId: result.rows[0].id });
  } catch (err) {
    console.error(`DELETE /api/payments/${req.params.id} error:`, err);
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
      data.userId,
      data.email,
      data.name,
      data.transactionId,
      data.customInvoiceId,
      data.planName,
      data.planType,
      data.provider,
      data.amount,
      data.currency,
      data.planPrice,
      data.discount,
      data.paymentMethod,
      data.cardLast4,
      data.billingAddress,
      data.paymentDate,
      data.nextPaymentDate,
      data.status,
      data.notified,
      data.emailSendCredits,
      data.emailVerificationCredits,
      data.smsCredits,
      data.whatsappCredits
    ];

    const result = await db.query(sql, values);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("POST /api/payments error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});


module.exports = router;
