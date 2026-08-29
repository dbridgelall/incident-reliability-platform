import IncidentCard from "@/components/IncidentCard";
import MetricCard from "@/components/MetricCard";
import { incidents } from "@/data/incidents";

// Main dashboard page.
export default function Home() {
  const applicationStatus: string = "Operational";

  // Calculate dashboard metrics from the incident data.
  const totalIncidents = incidents.length;

  const activeIncidents = incidents.filter(
    (incident) => incident.status !== "RESOLVED",
  ).length;

  const criticalIncidents = incidents.filter(
    (incident) => incident.severity === "CRITICAL",
  ).length;

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "RESOLVED",
  ).length;

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

        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            System Status
          </p>

          <p className="mt-2 text-xl font-semibold text-gray-900">
            {applicationStatus}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Incident Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Incidents"
              value={totalIncidents}
            />

            <MetricCard
              label="Active Incidents"
              value={activeIncidents}
            />

            <MetricCard
              label="Critical Incidents"
              value={criticalIncidents}
            />

            <MetricCard
              label="Resolved Incidents"
              value={resolvedIncidents}
            />
          </div>
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