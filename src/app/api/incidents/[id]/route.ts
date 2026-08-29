import { getIncidentById } from "@/lib/incidentRepository";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// Handles GET requests for a single incident.
export async function GET(
  request: Request,
  context: RouteContext,
) {
  void request;

  const { id } = await context.params;

  // Application IDs use the format INC-001.
  const match = /^INC-(\d+)$/.exec(id);

  if (!match) {
    return Response.json(
      {
        error: "Invalid incident ID.",
      },
      {
        status: 400,
      },
    );
  }

  const numericId = Number(match[1]);

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

    return Response.json({
      data: incident,
    });
  } catch (error) {
    console.error("Failed to retrieve incident:", error);

    return Response.json(
      {
        error: "Failed to retrieve incident.",
      },
      {
        status: 500,
      },
    );
  }
}