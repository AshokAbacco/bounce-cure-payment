require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // ✅ LOCAL postgres does NOT support SSL
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("Postgres error:", err);
});

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error("DB Query Error:", err.message, err.code);
    throw err;
  }
}

module.exports = { pool, query };
