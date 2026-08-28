import type { Incident } from "@/types/incident";

// Defines the data that must be provided to the IncidentCard component.
type IncidentCardProps = {
  incident: Incident;
};

// Displays the information for a single incident.
export default function IncidentCard({
  incident,
}: IncidentCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {incident.id}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {incident.title}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {incident.service}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {incident.severity}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span className="font-medium text-gray-900">
            {incident.status}
          </span>
        </p>
      </div>
    </article>
  );
}