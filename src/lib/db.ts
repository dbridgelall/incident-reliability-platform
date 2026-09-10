import { Pool } from "pg";

/**
 * Shared PostgreSQL connection pool.
 *
 * Production:
 * Uses DATABASE_URL for hosted PostgreSQL.
 *
 * Local development:
 * Falls back to the individual DATABASE_* environment variables.
 */

const isProduction = process.env.NODE_ENV === "production";

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    })
  : new Pool({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    });

export default pool;