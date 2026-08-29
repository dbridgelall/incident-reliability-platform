import type {
  CreateIncidentInput,
  IncidentSeverity,
  IncidentStatus,
  UpdateIncidentStatusInput,
} from "@/types/incident";

// Severity values accepted when creating an incident.
const validSeverities: IncidentSeverity[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

// Checks whether an unknown value is a valid incident severity.
function isIncidentSeverity(
  value: unknown,
): value is IncidentSeverity {
  return (
    typeof value === "string" &&
    validSeverities.includes(value as IncidentSeverity)
  );
}

// Validates and converts an unknown request body into incident input.
export function validateCreateIncident(
  body: unknown,
): CreateIncidentInput | null {
  if (
    typeof body !== "object" ||
    body === null
  ) {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  if (
    typeof candidate.title !== "string" ||
    candidate.title.trim() === ""
  ) {
    return null;
  }

  if (
    typeof candidate.service !== "string" ||
    candidate.service.trim() === ""
  ) {
    return null;
  }

  if (!isIncidentSeverity(candidate.severity)) {
    return null;
  }

  return {
    title: candidate.title.trim(),
    service: candidate.service.trim(),
    severity: candidate.severity,
  };
}

const VALID_INCIDENT_STATUSES: IncidentStatus[] = [
  "OPEN",
  "INVESTIGATING",
  "RESOLVED",
];

// Validates input used to update an incident's status.
export function validateUpdateIncidentStatus(
  body: unknown,
): UpdateIncidentStatusInput | null {
  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body)
  ) {
    return null;
  }

  const status = (body as { status: unknown }).status;

  if (
    typeof status !== "string" ||
    !VALID_INCIDENT_STATUSES.includes(
      status as IncidentStatus,
    )
  ) {
    return null;
  }

  return {
    status: status as IncidentStatus,
  };
}