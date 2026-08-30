import pool from "../../src/lib/db";

// Removes all test data and resets generated IDs.
// CASCADE handles tables that reference incidents through foreign keys.
export async function resetTestDatabase() {
  await pool.query(`
    TRUNCATE TABLE
      incident_events,
      incidents
    RESTART IDENTITY CASCADE;
  `);
}

// Closes the PostgreSQL connection pool when explicitly needed.
export async function closeTestDatabase() {
  await pool.end();
}