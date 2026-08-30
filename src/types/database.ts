export type IncidentRow = {
  id: number;
  title: string;
  service: string;
  severity: string;
  status: string;
  created_at: Date;
};

// Represents an incident event row returned by PostgreSQL.
export interface IncidentEventRow {
  id: number;
  incident_id: number;
  event_type: string;
  created_at: Date;
}