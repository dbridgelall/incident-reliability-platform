"use client";

import { useEffect, useState } from "react";

import CreateIncidentForm from "@/components/CreateIncidentForm";
import IncidentCard from "@/components/IncidentCard";
import MetricCard from "@/components/MetricCard";
import type {
  Incident,
  IncidentsResponse,
} from "@/types/incident";

export default function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await fetch("/api/incidents");

        if (!response.ok) {
          throw new Error("Failed to load incidents.");
        }

        const result: IncidentsResponse =
          await response.json();

        setIncidents(result.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadIncidents();
  }, []);

  function handleIncidentCreated(
    incident: Incident,
  ) {
    setIncidents((currentIncidents) => [
      ...currentIncidents,
      incident,
    ]);
  }

  if (isLoading) {
    return (
      <p className="text-gray-600">
        Loading incidents...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600">
        {error}
      </p>
    );
  }

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
    <>
      <CreateIncidentForm
        onIncidentCreated={handleIncidentCreated}
      />

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
    </>
  );
}