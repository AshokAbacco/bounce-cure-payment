// server/routes/payments.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware: check token (tolerant of "Bearer <token>" or just "<token>")
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  // If header is "Bearer <token>" parts.length === 2, else could be just the token
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (token !== "admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

// GET all payments
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
        "id","userId","email","name","emailVerificationCredits","emailSendCredits",
        "smsCredits","whatsappCredits","transactionId","customInvoiceId","planName",
        "planType","provider","amount","currency","planPrice","discount","paymentMethod",
        "cardLast4","billingAddress","paymentDate","nextPaymentDate","status","notified",
        "createdAt","updatedAt"
      FROM "Payment"
      ORDER BY "id" DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error('GET /payments error:', {
      message: err?.message,
      code: err?.code,
      stack: err?.stack?.split("\n")?.slice(0, 3)?.join("\n")
    });
    res.status(500).json({ message: "DB Error" });
  }
});

// FULL UPDATE — supports all fields from frontend
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body || {};

  try {
    const values = [
      data.name,
      data.email,
      data.emailVerificationCredits,
      data.emailSendCredits,
      data.smsCredits,
      data.whatsappCredits,
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
      id
    ];

    const { rows } = await db.query(
      `UPDATE "Payment" SET
        "name" = $1,
        "email" = $2,
        "emailVerificationCredits" = $3,
        "emailSendCredits" = $4,
        "smsCredits" = $5,
        "whatsappCredits" = $6,
        "transactionId" = $7,
        "customInvoiceId" = $8,
        "planName" = $9,
        "planType" = $10,
        "provider" = $11,
        "amount" = $12,
        "currency" = $13,
        "planPrice" = $14,
        "discount" = $15,
        "paymentMethod" = $16,
        "cardLast4" = $17,
        "billingAddress" = $18,
        "paymentDate" = $19,
        "nextPaymentDate" = $20,
        "status" = $21,
        "notified" = $22,
        "updatedAt" = NOW()
      WHERE "id" = $23
      RETURNING *;`,
      values
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(`PUT /payments/${id} error:`, {
      message: err?.message,
      code: err?.code,
      stack: err?.stack?.split("\n")?.slice(0, 3)?.join("\n")
    });
    res.status(500).json({ message: "DB Error" });
  }
});

// DELETE payment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      `DELETE FROM "Payment" WHERE "id" = $1 RETURNING "id"`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, deletedId: rows[0].id });
  } catch (err) {
    console.error(`DELETE /payments/${id} error:`, {
      message: err?.message,
      code: err?.code,
      stack: err?.stack?.split("\n")?.slice(0, 3)?.join("\n")
    });
    res.status(500).json({ message: "DB Error" });
  }
});

// Lightweight DB health check
router.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    const time = result?.rows?.[0]?.now ? result.rows[0].now : result.rows[0];
    res.json({ connected: true, time });
  } catch (err) {
    console.error('GET /payments/test-db error:', {
      message: err?.message,
      code: err?.code,
      stack: err?.stack?.split("\n")?.slice(0, 3)?.join("\n")
    });
    res.status(500).json({ connected: false, error: err?.message || err });
  }
});

module.exports = router;
