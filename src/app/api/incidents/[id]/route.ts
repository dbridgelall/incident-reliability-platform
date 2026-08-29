import {
  getIncidentById,
  updateIncidentStatus,
} from "@/lib/incidentRepository";
import { validateUpdateIncidentStatus } from "@/lib/incidentValidation";

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

// Handles PATCH requests that update an incident's status.
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

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

  const input = validateUpdateIncidentStatus(body);

  if (!input) {
    return Response.json(
      {
        error:
          "status must be OPEN, INVESTIGATING, or RESOLVED.",
      },
      {
        status: 400,
      },
    );
  }

  const numericId = Number(match[1]);

  try {
    const incident = await updateIncidentStatus(
      numericId,
      input.status,
    );

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
    console.error("Failed to update incident:", error);

    return Response.json(
      {
        error: "Failed to update incident.",
      },
      {
        status: 500,
      },
    );
  }
}