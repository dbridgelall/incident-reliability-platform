"use client";

import { useEffect, useState } from "react";

import type { IncidentEvent } from "@/types/incident";

interface IncidentTimelineProps {
  incidentId: string;
  status: string;
}

interface IncidentEventsResponse {
  data: IncidentEvent[];
  count: number;
}

const eventLabels: Record<
  IncidentEvent["eventType"],
  string
> = {
  CREATED: "Incident created",
  INVESTIGATION_STARTED: "Investigation started",
  RESOLVED: "Incident resolved",
};

// Displays the chronological lifecycle history for an incident.
export default function IncidentTimeline({
  incidentId,
  status,
}: IncidentTimelineProps) {
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/incidents/${incidentId}/events`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load incident history.",
          );
        }

        const result: IncidentEventsResponse =
          await response.json();

        setEvents(result.data);
      } catch (error) {
        console.error(
          "Failed to load incident history:",
          error,
        );

        setError("Unable to load incident history.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [incidentId, status]);
  if (isLoading) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        Loading incident history...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-4 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        No incident history available.
      </p>
    );
  }

  return (
    <section className="mt-5 border-t border-gray-200 pt-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Incident History
      </h3>

      <ol className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="relative pl-6"
          >
            <span
              className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-gray-900"
              aria-hidden="true"
            />

            <p className="text-sm font-medium text-gray-900">
              {eventLabels[event.eventType]}
            </p>

            <time
              className="text-xs text-gray-500"
              dateTime={event.createdAt}
            >
              {new Date(
                event.createdAt,
              ).toLocaleString()}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}