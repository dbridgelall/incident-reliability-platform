import { NextResponse } from "next/server";

import pool from "@/lib/db";

/**
 * GET /api/health
 *
 * Reports whether the application is running and can communicate
 * with the PostgreSQL database.
 */
export async function GET() {
  try {
    await pool.query("SELECT 1");

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}