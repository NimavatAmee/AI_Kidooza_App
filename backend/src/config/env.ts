import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kidooza_db',
  JWT_SECRET: process.env.JWT_SECRET || 'kidooza-dev-secret-key-2026',
  MAX_SESSION_MINUTES: parseInt(process.env.MAX_SESSION_MINUTES || '45', 10),
  DEFAULT_SESSION_MINUTES: parseInt(process.env.DEFAULT_SESSION_MINUTES || '20', 10),
};
