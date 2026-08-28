import IncidentCard from "@/components/IncidentCard";
import type { Incident } from "@/types/incident";

// Temporary incident data used while the application has no database.
const incidents: Incident[] = [
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

// Main dashboard page.
export default function Home() {
  const applicationStatus: string = "Operational";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Reliability Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Incident Reliability Platform
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor incidents, investigate failures, and track system
            reliability.
          </p>
        </header>

        <section className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            System Status
          </p>

          <p className="mt-2 text-xl font-semibold text-gray-900">
            {applicationStatus}
          </p>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Incidents
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Current and recently resolved service incidents.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}