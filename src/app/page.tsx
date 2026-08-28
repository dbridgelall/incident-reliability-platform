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
    </main>
  );
}
