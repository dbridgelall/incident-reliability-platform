import { incidents } from "@/data/incidents";

// Handles GET requests for the incident collection.
export async function GET() {
  return Response.json({
    data: incidents,
    count: incidents.length,
  });
}