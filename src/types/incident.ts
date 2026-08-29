// Defines the allowed severity levels for an incident.
export type IncidentSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

// Defines the lifecycle states an incident can have.
export type IncidentStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "RESOLVED";

// Defines the structure every incident must follow.
export type Incident = {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
};

// Defines the structure returned by the incidents API.
export type IncidentsResponse = {
  data: Incident[];
  count: number;
};