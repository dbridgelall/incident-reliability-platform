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
import type {
  ReliabilityMetrics,
  ReliabilityMetricsResponse,
} from "@/types/metrics";

// Displays the incident dashboard and retrieves incident data from the API.
export default function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [updatingIncidentId, setUpdatingIncidentId] =
    useState<string | null>(null);
  const [reliabilityMetrics, setReliabilityMetrics] =
    useState<ReliabilityMetrics | null>(null);

  // Loads incidents and reliability metrics when the dashboard first renders.
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          incidentsResponse,
          metricsResponse,
        ] = await Promise.all([
          fetch("/api/incidents"),
          fetch("/api/metrics"),
        ]);

        if (!incidentsResponse.ok) {
          throw new Error("Failed to load incidents.");
        }

        if (!metricsResponse.ok) {
          throw new Error(
            "Failed to load reliability metrics.",
          );
        }

        const incidentsResult: IncidentsResponse =
          await incidentsResponse.json();

        const metricsResult: ReliabilityMetricsResponse =
          await metricsResponse.json();

        setIncidents(incidentsResult.data);
        setReliabilityMetrics(metricsResult.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error,
        );

        setErrorMessage(
          "Unable to load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  // Refreshes reliability metrics after incident lifecycle changes.
  async function refreshReliabilityMetrics() {
    try {
      const response = await fetch("/api/metrics");

      if (!response.ok) {
        throw new Error(
          "Failed to load reliability metrics.",
        );
      }

      const result: ReliabilityMetricsResponse =
        await response.json();

      setReliabilityMetrics(result.data);
    } catch (error) {
      console.error(
        "Failed to refresh reliability metrics:",
        error,
      );
    }
  }

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

      // Recalculate MTTR after a lifecycle status change.
      await refreshReliabilityMetrics();
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
        Loading dashboard...
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

  const meanTimeToResolution =
    reliabilityMetrics?.meanTimeToResolutionMinutes == null
      ? "N/A"
      : `${reliabilityMetrics.meanTimeToResolutionMinutes.toFixed(
          1,
        )} min`;

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
            label="Mean Time to Resolution"
            value={meanTimeToResolution}
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