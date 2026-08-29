import { incidents } from "@/data/incidents";

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

  const incident = incidents.find(
    (incident) => incident.id === id,
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
}