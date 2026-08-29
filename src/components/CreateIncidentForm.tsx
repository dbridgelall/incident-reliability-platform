"use client";

import { FormEvent, useState } from "react";

import type {
  Incident,
  IncidentSeverity,
} from "@/types/incident";

type CreateIncidentFormProps = {
  onIncidentCreated: (incident: Incident) => void;
};

type CreateIncidentResponse = {
  data: Incident;
};

export default function CreateIncidentForm({
  onIncidentCreated,
}: CreateIncidentFormProps) {
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] =
    useState<IncidentSeverity>("MEDIUM");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          service,
          severity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident.");
      }

      const result: CreateIncidentResponse =
        await response.json();

      onIncidentCreated(result.data);

      setTitle("");
      setService("");
      setSeverity("MEDIUM");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Create Incident
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Report a new service incident for investigation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Incident Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            placeholder="Database connection failures"
          />
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Service
          </label>

          <input
            id="service"
            type="text"
            value={service}
            onChange={(event) => setService(event.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            placeholder="User API"
          />
        </div>

        <div>
          <label
            htmlFor="severity"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Severity
          </label>

          <select
            id="severity"
            value={severity}
            onChange={(event) =>
              setSeverity(
                event.target.value as IncidentSeverity,
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Incident"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}