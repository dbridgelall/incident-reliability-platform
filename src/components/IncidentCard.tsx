"use client";

import { useState } from "react";

import IncidentTimeline from "@/components/IncidentTimeline";
import type {
  Incident,
  IncidentStatus,
} from "@/types/incident";

type IncidentCardProps = {
  incident: Incident;
  isUpdating: boolean;
  onStatusChange: (
    incidentId: string,
    status: IncidentStatus,
  ) => void;
};

export default function IncidentCard({
  incident,
  isUpdating,
  onStatusChange,
}: IncidentCardProps) {
  const [showHistory, setShowHistory] = useState(false);

  function handleStatusChange() {
    if (incident.status === "OPEN") {
      onStatusChange(
        incident.id,
        "INVESTIGATING",
      );
    }

    if (incident.status === "INVESTIGATING") {
      onStatusChange(
        incident.id,
        "RESOLVED",
      );
    }
  }

  const actionLabel =
    incident.status === "OPEN"
      ? "Start Investigation"
      : incident.status === "INVESTIGATING"
        ? "Resolve Incident"
        : null;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {incident.id}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {incident.title}
          </h3>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {incident.severity}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-800">
            Service:
          </span>{" "}
          {incident.service}
        </p>

        <p>
          <span className="font-medium text-gray-800">
            Status:
          </span>{" "}
          {incident.status}
        </p>

        <p>
          <span className="font-medium text-gray-800">
            Created:
          </span>{" "}
          {new Date(incident.createdAt).toLocaleString()}
        </p>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={handleStatusChange}
          disabled={isUpdating}
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : actionLabel}
        </button>
      )}

      <div className="mt-5 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() =>
            setShowHistory((current) => !current)
          }
          className="text-sm font-medium text-gray-700 hover:text-gray-950"
          aria-expanded={showHistory}
        >
          {showHistory
            ? "Hide history"
            : "View history"}
        </button>

        {showHistory && (
          <IncidentTimeline
            incidentId={incident.id}
            status={incident.status}
          />
        )}
      </div>
    </article>
  );
}