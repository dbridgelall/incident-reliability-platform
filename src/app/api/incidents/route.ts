import { incidents } from "@/data/incidents";
import { validateCreateIncident } from "@/lib/incidentValidation";
import type { Incident } from "@/types/incident";

// Handles GET requests for the incident collection.
export async function GET() {
  return Response.json({
    data: incidents,
    count: incidents.length,
  });
}

// Handles POST requests that create a new incident.
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Request body must contain valid JSON.",
      },
      {
        status: 400,
      },
    );
  }

  const input = validateCreateIncident(body);

  if (!input) {
    return Response.json(
      {
        error:
          "title, service, and a valid severity are required.",
      },
      {
        status: 400,
      },
    );
  }

  const incident: Incident = {
    id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
    title: input.title,
    service: input.service,
    severity: input.severity,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  incidents.push(incident);

  return Response.json(
    {
      data: incident,
    },
    {
      status: 201,
    },
  );
}