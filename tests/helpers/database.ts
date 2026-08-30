import pool from "../../src/lib/db";

// Removes test incidents and resets generated IDs.
export async function resetTestDatabase() {
  await pool.query(
    "TRUNCATE TABLE incidents RESTART IDENTITY;",
  );
}

// Closes the PostgreSQL connection pool after integration tests.
export async function closeTestDatabase() {
  await pool.end();
}