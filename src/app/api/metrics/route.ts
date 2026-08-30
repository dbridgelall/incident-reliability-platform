import { getReliabilityMetrics } from "@/lib/metricsRepository";

// Returns reliability metrics derived from incident lifecycle data.
export async function GET() {
  try {
    const metrics = await getReliabilityMetrics();

    return Response.json({
      data: metrics,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve reliability metrics:",
      error,
    );

    return Response.json(
      {
        error: "Failed to retrieve reliability metrics.",
      },
      {
        status: 500,
      },
    );
  }
}