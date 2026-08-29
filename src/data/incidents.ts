import type { Incident } from "@/types/incident";

// Temporary in-memory incident data.
// This will be replaced by PostgreSQL later.
export const incidents: Incident[] = [
  {
    id: "INC-001",
    title: "Database connection failures",
    service: "User API",
    severity: "HIGH",
    status: "RESOLVED",
    createdAt: "2026-08-28T09:15:00",
  },
  {
    id: "INC-002",
    title: "Authentication failures",
    service: "Authentication Service",
    severity: "HIGH",
    status: "INVESTIGATING",
    createdAt: "2026-08-28T10:30:00",
  },
  {
    id: "INC-003",
    title: "Payment API latency",
    service: "Payment API",
    severity: "CRITICAL",
    status: "OPEN",
    createdAt: "2026-08-28T11:45:00",
  },
];