import IncidentDashboard from "@/components/IncidentDashboard";

// Main application page.
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

        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            System Status
          </p>

          <p className="mt-2 text-xl font-semibold text-gray-900">
            {applicationStatus}
          </p>
        </section>

        <IncidentDashboard />
      </div>
    </main>
  );
}