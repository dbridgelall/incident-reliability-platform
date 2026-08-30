import pool from "@/lib/db";
import type { IncidentRow } from "@/types/database";
import type {
  CreateIncidentInput,
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "@/types/incident";

import { createIncidentEvent } from "@/lib/incidentEventRepository";

// Converts a PostgreSQL incident row into the application's Incident type.
function mapIncidentRow(row: IncidentRow): Incident {
  return {
    id: `INC-${String(row.id).padStart(3, "0")}`,
    title: row.title,
    service: row.service,
    severity: row.severity as IncidentSeverity,
    status: row.status as IncidentStatus,
    createdAt: row.created_at.toISOString(),
  };
}

// Retrieves all incidents from PostgreSQL.
export async function getAllIncidents(): Promise<Incident[]> {
  const result = await pool.query<IncidentRow>(
    `
      SELECT
        id,
        title,
        service,
        severity,
        status,
        created_at
      FROM incidents
      ORDER BY id ASC
    `,
  );

  return result.rows.map(mapIncidentRow);
}

// Retrieves a single incident from PostgreSQL by its numeric ID.
export async function getIncidentById(
  id: number,
): Promise<Incident | null> {
  const result = await pool.query<IncidentRow>(
    `
      SELECT
        id,
        title,
        service,
        severity,
        status,
        created_at
      FROM incidents
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapIncidentRow(result.rows[0]);
}

// Creates an incident and its initial lifecycle event atomically.
export async function createIncident(
  input: CreateIncidentInput,
): Promise<Incident> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<IncidentRow>(
      `
        INSERT INTO incidents (
          title,
          service,
          severity
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          title,
          service,
          severity,
          status,
          created_at
      `,
      [
        input.title,
        input.service,
        input.severity,
      ],
    );

    const incidentRow = result.rows[0];

    await createIncidentEvent(
      incidentRow.id,
      "CREATED",
      client,
    );

    await client.query("COMMIT");

    return mapIncidentRow(incidentRow);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Updates an incident's status and records its lifecycle event atomically.
export async function updateIncidentStatus(
  id: number,
  status: IncidentStatus,
): Promise<Incident | null> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<IncidentRow>(
      `
        UPDATE incidents
        SET status = $1
        WHERE id = $2
        RETURNING
          id,
          title,
          service,
          severity,
          status,
          created_at
      `,
      [status, id],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const incidentRow = result.rows[0];

    if (status === "INVESTIGATING") {
      await createIncidentEvent(
        incidentRow.id,
        "INVESTIGATION_STARTED",
        client,
      );
    }

    if (status === "RESOLVED") {
      await createIncidentEvent(
        incidentRow.id,
        "RESOLVED",
        client,
      );
    }

    await client.query("COMMIT");

    return mapIncidentRow(incidentRow);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}