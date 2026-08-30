import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { createIncident, updateIncidentStatus } from "@/lib/incidentRepository";
import { getReliabilityMetrics } from "@/lib/metricsRepository";
import { resetTestDatabase } from "../helpers/database";

describe("metricsRepository", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it("returns no MTTR when no incidents are resolved", async () => {
    await createIncident({
      title: "Authentication failures",
      service: "Authentication Service",
      severity: "HIGH",
    });

    const metrics = await getReliabilityMetrics();

    expect(metrics).toEqual({
      resolvedIncidentCount: 0,
      meanTimeToResolutionMinutes: null,
    });
  });

  it("counts resolved incidents", async () => {
    const incident = await createIncident({
      title: "Checkout service unavailable",
      service: "Checkout API",
      severity: "CRITICAL",
    });

    const numericId = Number(
      incident.id.replace("INC-", ""),
    );

    await updateIncidentStatus(
      numericId,
      "RESOLVED",
    );

    const metrics = await getReliabilityMetrics();

    expect(metrics.resolvedIncidentCount).toBe(1);
  });

  it("calculates MTTR for resolved incidents", async () => {
    const incident = await createIncident({
      title: "Payment processor timeout",
      service: "Payment API",
      severity: "CRITICAL",
    });

    const numericId = Number(
      incident.id.replace("INC-", ""),
    );

    await updateIncidentStatus(
      numericId,
      "RESOLVED",
    );

    const metrics = await getReliabilityMetrics();

    expect(
      metrics.meanTimeToResolutionMinutes,
    ).not.toBeNull();

    expect(
      metrics.meanTimeToResolutionMinutes!,
    ).toBeGreaterThanOrEqual(0);
  });

  it("ignores unresolved incidents when calculating MTTR", async () => {
    const resolvedIncident = await createIncident({
      title: "Database connection failures",
      service: "User API",
      severity: "HIGH",
    });

    await createIncident({
      title: "Search latency",
      service: "Search API",
      severity: "MEDIUM",
    });

    const numericId = Number(
      resolvedIncident.id.replace("INC-", ""),
    );

    await updateIncidentStatus(
      numericId,
      "RESOLVED",
    );

    const metrics = await getReliabilityMetrics();

    expect(metrics.resolvedIncidentCount).toBe(1);
    expect(
      metrics.meanTimeToResolutionMinutes,
    ).not.toBeNull();
  });
});