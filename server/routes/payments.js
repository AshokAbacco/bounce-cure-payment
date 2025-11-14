const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware: check token
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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
        "id",
        "userId",
        "email",
        "name",
        "emailVerificationCredits",
        "emailSendCredits",
        "smsCredits",
        "whatsappCredits",
        "transactionId",
        "customInvoiceId",
        "planName",
        "planType",
        "provider",
        "amount",
        "currency",
        "planPrice",
        "discount",
        "paymentMethod",
        "cardLast4",
        "billingAddress",
        "paymentDate",
        "nextPaymentDate",
        "status",
        "notified",
        "createdAt",
        "updatedAt"
      FROM "Payment"
      ORDER BY "id" DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});


// FULL UPDATE — supports all fields from frontend
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

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

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});


// DELETE payment
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM "Payment" WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
});

module.exports = router;
