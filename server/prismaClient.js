// server/prismaClient.js
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = new PrismaClient({
        // log: ['query', 'error', 'warn', 'info'], // enable in dev if needed
    });
    // Optionally connect eagerly in startup (not strictly required)
    // globalForPrisma.__prisma.$connect().catch(e => console.error('Prisma connect error', e));
}

const prisma = globalForPrisma.__prisma;

module.exports = prisma;
