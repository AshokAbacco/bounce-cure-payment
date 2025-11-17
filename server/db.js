// server/db.js
// WARNING: NODE_TLS_REJECT_UNAUTHORIZED = "0" disables cert validation (use only in dev)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Pool } = require('pg');
require('dotenv').config();

function normalizeConnectionString(cs) {
  if (!cs) return cs;
  return cs.replace(/\?sslmode=[^&]*(&)?/, (m, g1) => g1 ? '?' : '');
}

const connectionString = normalizeConnectionString(process.env.DATABASE_URL || '');

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  max: parseInt(process.env.PG_MAX_CLIENTS || '6', 10),
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: false,
});

// log unexpected pool errors
pool.on('error', (err) => {
  console.error('POOL ERROR:', err && err.stack ? err.stack : err);
});

async function query(text, params) {
  console.log('db.query ->', text, params ? params.length + ' params' : 'no params');
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('DB Query Error:', {
      message: err && err.message,
      code: err && err.code,
      stack: err && err.stack ? err.stack.split('\n').slice(0, 6).join('\n') : undefined,
    });
    throw err;
  }
}

async function getClient() {
  // grab a client and print socket info for debugging
  const client = await pool.connect();
  try {
    const sock = client.connection && client.connection.stream;
    if (sock) {
      console.log('Client socket info:', {
        remoteAddress: sock.remoteAddress,
        remotePort: sock.remotePort,
        localAddress: sock.localAddress,
        authorized: typeof sock.authorized === 'boolean' ? sock.authorized : undefined,
      });
    }
  } catch (e) {
    console.warn('Could not read socket info', e);
  }
  return client;
}

async function closePool() {
  try {
    await pool.end();
    console.log('PG pool closed');
  } catch (e) {
    console.error('Error closing pool', e);
  }
}

module.exports = { pool, query, getClient, closePool };
