import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully.');
  } catch (error) {
    console.warn('⚠️ Could not connect to PostgreSQL database. Running in in-memory fallback mode for local development.');
  }
}
