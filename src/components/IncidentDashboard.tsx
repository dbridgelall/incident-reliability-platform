"use client";

import { useEffect, useState } from "react";

import CreateIncidentForm from "@/components/CreateIncidentForm";
import IncidentCard from "@/components/IncidentCard";
import MetricCard from "@/components/MetricCard";
import type {
  Incident,
  IncidentStatus,
  IncidentsResponse,
} from "@/types/incident";

// Displays the incident dashboard and retrieves incident data from the API.
export default function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [updatingIncidentId, setUpdatingIncidentId] =
    useState<string | null>(null);

  // Loads all incidents when the dashboard first renders.
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
        console.error("Failed to load incidents:", error);
        setErrorMessage("Unable to load incidents.");
      } finally {
        setIsLoading(false);
      }
    }

    loadIncidents();
  }, []);

  // Adds a newly created incident to the current dashboard state.
  function handleIncidentCreated(
    incident: Incident,
  ) {
    setIncidents((currentIncidents) => [
      ...currentIncidents,
      incident,
    ]);
  }

  // Updates an incident's status through the API and refreshes local state.
  async function handleStatusChange(
    incidentId: string,
    status: IncidentStatus,
  ) {
    setUpdatingIncidentId(incidentId);

    try {
      const response = await fetch(
        `/api/incidents/${incidentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update incident status.",
        );
      }

      const result: {
        data: Incident;
      } = await response.json();

      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) =>
          incident.id === result.data.id
            ? result.data
            : incident,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update incident status:",
        error,
      );
    } finally {
      setUpdatingIncidentId(null);
    }
  }

  if (isLoading) {
    return (
      <p className="text-gray-600">
        Loading incidents...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="text-red-600">
        {errorMessage}
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
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Recent Incidents
        </h2>

        {incidents.length === 0 ? (
          <p className="text-gray-600">
            No incidents have been reported.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isUpdating={
                  updatingIncidentId === incident.id
                }
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}