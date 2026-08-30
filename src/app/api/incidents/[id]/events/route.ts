import { getIncidentEvents } from "@/lib/incidentEventRepository";
import { getIncidentById } from "@/lib/incidentRepository";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// Converts an application incident ID such as INC-001
// into the numeric PostgreSQL ID.
function parseIncidentId(id: string): number | null {
  const match = /^INC-(\d+)$/.exec(id);

  if (!match) {
    return null;
  }

  const numericId = Number(match[1]);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

// Returns the lifecycle history for a single incident.
export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const numericId = parseIncidentId(id);

  if (numericId === null) {
    return Response.json(
      {
        error: "Invalid incident ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const incident = await getIncidentById(numericId);

    if (!incident) {
      return Response.json(
        {
          error: "Incident not found.",
        },
        {
          status: 404,
        },
      );
    }

    const events = await getIncidentEvents(numericId);

    return Response.json({
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve incident events:",
      error,
    );

    return Response.json(
      {
        error: "Failed to retrieve incident events.",
      },
      {
        status: 500,
      },
    );
  }
}