const express = require("express");
const router = express.Router();
const db = require("../db");

// =========================
// ADMIN AUTH MIDDLEWARE (same as users.js)
// =========================
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1] || authHeader;

  if (token !== "admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
});

// =========================
// 1. GET ALL CHAT CONVERSATIONS (WhatsApp left panel)
// =========================
router.get("/conversations", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT ON (u.id)
        u.id as "userId",
        u."firstName",
        u."lastName",
        u.email,
        c.id as "conversationId",
        m.text as "lastMessage",
        m."createdAt" as "lastMessageAt"
      FROM "User" u
      JOIN "Conversation" c ON c."userId" = u.id
      LEFT JOIN "Message" m ON m."conversationId" = c.id
      ORDER BY u.id, m."createdAt" DESC NULLS LAST;
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("GET conversations error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});


// =========================
// 2. GET MESSAGES BY USER (open one chat)
// =========================
router.get("/messages/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = `
      SELECT 
        m.id,
        m.text,
        m.sender,
        m."createdAt"
      FROM "Message" m
      JOIN "Conversation" c ON c.id = m."conversationId"
      WHERE c."userId" = $1
      ORDER BY m."createdAt" ASC;
    `;

    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("GET messages error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// =========================
// 3. ADMIN SEND MESSAGE TO USER
// =========================

router.post("/send", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: "userId and message required" });
  }

  try {
    const conv = await db.query(
      `SELECT id FROM "Conversation" WHERE "userId" = $1`,
      [userId]
    );

    if (conv.rows.length === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const conversationId = conv.rows[0].id;

    // ✅ FIXED: no AT TIME ZONE
    const insert = await db.query(
      `
      INSERT INTO "Message" ("conversationId", sender, text, "createdAt")
      VALUES ($1, 'ADMIN', $2, NOW())
      RETURNING *;
      `,
      [conversationId, message]
    );

    // ✅ FIXED
    await db.query(
      `
      UPDATE "Conversation"
      SET "lastAdminSeenAt" = NOW()
      WHERE "userId" = $1
      `,
      [userId]
    );

    res.json({
      success: true,
      message: "Reply sent",
      data: insert.rows[0]
    });

  } catch (err) {
    console.error("POST send admin message error:", err);
    res.status(500).json({ message: "Database Error" });
  }
  
});

// CREATE CONVERSATION IF NOT EXISTS
router.post("/start", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId required" });
  }

  try {
    const existing = await db.query(
      `SELECT * FROM "Conversation" WHERE "userId" = $1`,
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const created = await db.query(
      `
      INSERT INTO "Conversation" ("userId", "createdAt")
      VALUES ($1, NOW())
      RETURNING *;
      `,
      [userId]
    );

    res.json(created.rows[0]);
  } catch (err) {
    console.error("Start chat error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});


module.exports = router;
