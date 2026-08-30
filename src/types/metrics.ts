// Reliability metrics calculated from incident lifecycle data.
export type ReliabilityMetrics = {
  resolvedIncidentCount: number;
  meanTimeToResolutionMinutes: number | null;
};

export type ReliabilityMetricsResponse = {
  data: ReliabilityMetrics;
};