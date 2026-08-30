import type { PoolClient } from "pg";

import pool from "@/lib/db";
import type { IncidentEventRow } from "@/types/database";
import type {
  IncidentEvent,
  IncidentEventType,
} from "@/types/incident";

// Converts a PostgreSQL event row into the application's event type.
function mapIncidentEventRow(
  row: IncidentEventRow,
): IncidentEvent {
  return {
    id: row.id,
    incidentId: `INC-${String(row.incident_id).padStart(3, "0")}`,
    eventType: row.event_type as IncidentEventType,
    createdAt: row.created_at.toISOString(),
  };
}

// Creates an incident lifecycle event.
// A transaction client can be supplied when the event must be written
// atomically with another database operation.
export async function createIncidentEvent(
  incidentId: number,
  eventType: IncidentEventType,
  client?: PoolClient,
): Promise<IncidentEvent> {
  const database = client ?? pool;

  const result = await database.query<IncidentEventRow>(
    `
      INSERT INTO incident_events (
        incident_id,
        event_type
      )
      VALUES ($1, $2)
      RETURNING
        id,
        incident_id,
        event_type,
        created_at
    `,
    [incidentId, eventType],
  );

  return mapIncidentEventRow(result.rows[0]);
}

// Retrieves an incident's event history in chronological order.
export async function getIncidentEvents(
  incidentId: number,
): Promise<IncidentEvent[]> {
  const result = await pool.query<IncidentEventRow>(
    `
      SELECT
        id,
        incident_id,
        event_type,
        created_at
      FROM incident_events
      WHERE incident_id = $1
      ORDER BY created_at ASC, id ASC
    `,
    [incidentId],
  );

  return result.rows.map(mapIncidentEventRow);
}