import type { Incident } from "@/types/incident";

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

export default function Home() {
  const applicationName: string = "Incident Reliability Platform";
  const applicationStatus: string = "Operational";

  return (
    <main>
      <h1>{applicationName}</h1>
      <p>
        Monitor incidents, investigate failures, and track system reliability.
      </p>

      <section>
        <h2>System Status</h2>
        <p>{applicationStatus}</p>
      </section>

      <section>
        <h2>Recent Incidents</h2>

        {incidents.map((incident) => (
          <article key={incident.id}>
            <h3>{incident.title}</h3>
            <p>Incident: {incident.id}</p>
            <p>Service: {incident.service}</p>
            <p>Severity: {incident.severity}</p>
            <p>Status: {incident.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}