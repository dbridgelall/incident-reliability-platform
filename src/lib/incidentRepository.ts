import pool from "@/lib/db";
import type { IncidentRow } from "@/types/database";
import type {
  CreateIncidentInput,
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "@/types/incident";

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

// Creates a new incident in PostgreSQL.
export async function createIncident(
  input: CreateIncidentInput,
): Promise<Incident> {
  const result = await pool.query<IncidentRow>(
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

  return mapIncidentRow(result.rows[0]);
}

// Updates an incident's status and returns the updated incident.
export async function updateIncidentStatus(
  id: number,
  status: IncidentStatus,
): Promise<Incident | null> {
  const result = await pool.query<IncidentRow>(
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
    return null;
  }

  return mapIncidentRow(result.rows[0]);
}