require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error("DB Query Error:", {
      message: err.message,
      code: err.code,
      stack: err.stack?.split("\n").slice(0, 5).join("\n"),
    });
    throw err;
  }
}

module.exports = { pool, query };
