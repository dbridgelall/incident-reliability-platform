import {
  createIncident,
  getAllIncidents,
} from "@/lib/incidentRepository";
import { validateCreateIncident } from "@/lib/incidentValidation";

// Handles GET requests for the incident collection.
export async function GET() {
  try {
    const incidents = await getAllIncidents();

    return Response.json({
      data: incidents,
      count: incidents.length,
    });
  } catch (error) {
    console.error("Failed to retrieve incidents:", error);

    return Response.json(
      {
        error: "Failed to retrieve incidents.",
      },
      {
        status: 500,
      },
    );
  }
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

  try {
    const incident = await createIncident(input);

    return Response.json(
      {
        data: incident,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create incident:", error);

    return Response.json(
      {
        error: "Failed to create incident.",
      },
      {
        status: 500,
      },
    );
  }
}