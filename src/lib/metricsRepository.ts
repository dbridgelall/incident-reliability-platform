import pool from "@/lib/db";
import type { ReliabilityMetrics } from "@/types/metrics";

type ReliabilityMetricsRow = {
  resolved_incident_count: number;
  mean_time_to_resolution_minutes: number | null;
};

// Calculates reliability metrics from persisted incident lifecycle events.
export async function getReliabilityMetrics(): Promise<ReliabilityMetrics> {
  const result = await pool.query<ReliabilityMetricsRow>(
    `
      SELECT
        COUNT(*)::int AS resolved_incident_count,
        AVG(
          EXTRACT(
            EPOCH FROM (
              resolved_event.created_at
              - created_event.created_at
            )
          ) / 60
        )::float AS mean_time_to_resolution_minutes
      FROM incidents AS i
      JOIN incident_events AS created_event
        ON created_event.incident_id = i.id
        AND created_event.event_type = 'CREATED'
      JOIN incident_events AS resolved_event
        ON resolved_event.incident_id = i.id
        AND resolved_event.event_type = 'RESOLVED'
      WHERE i.status = 'RESOLVED'
    `,
  );

  const row = result.rows[0];

  return {
    resolvedIncidentCount: row.resolved_incident_count,
    meanTimeToResolutionMinutes:
      row.mean_time_to_resolution_minutes,
  };
}