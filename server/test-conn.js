// server/test-pg-explicit.js
require('dotenv').config();
const { Pool } = require('pg');
const url = require('url');

if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL in .env');
    process.exit(1);
}

const parsed = url.parse(process.env.DATABASE_URL);
const [user, password] = (parsed.auth || '').split(':');

const cfg = {
    host: parsed.hostname,
    port: parsed.port || 5432,
    user,
    password,
    database: (parsed.pathname || '').replace(/^\//, ''),
    max: 2,
    connectionTimeoutMillis: 5001,
    idleTimeoutMillis: 20000,
    ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
};

console.log('Connecting with config (masked):', {
    host: cfg.host, port: cfg.port, user: cfg.user, database: cfg.database, ssl: !!cfg.ssl
});

const pool = new Pool(cfg);

pool.on('error', (err) => {
    console.error('pool.on error ->', err && err.message);
});

(async () => {
    try {
        const client = await pool.connect();
        try {
            console.log('Acquired client, socket info if available:');
            if (client.connection && client.connection.stream) {
                const s = client.connection.stream;
                console.log('socket remote:', s.remoteAddress, s.remotePort, 'authorized?', s.authorized);
            }
            const r = await client.query('SELECT NOW()');
            console.log('Query result:', r.rows);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('EXPLICIT CONNECT ERROR:', err && err.message, '\nstack:', err && err.stack ? err.stack.split('\n').slice(0, 6).join('\n') : '');
    } finally {
        await pool.end();
        console.log('pool closed');
    }
})();
