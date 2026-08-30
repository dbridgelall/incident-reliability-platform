import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { GET as getMetrics } from "@/app/api/metrics/route";
import {
  createIncident,
  updateIncidentStatus,
} from "@/lib/incidentRepository";
import { resetTestDatabase } from "../helpers/database";

describe("GET /api/metrics", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it("returns empty reliability metrics when no incidents exist", async () => {
    const response = await getMetrics();
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      resolvedIncidentCount: 0,
      meanTimeToResolutionMinutes: null,
    });
  });

  it("returns reliability metrics for resolved incidents", async () => {
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

    const response = await getMetrics();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.resolvedIncidentCount).toBe(1);

    expect(
      body.data.meanTimeToResolutionMinutes,
    ).not.toBeNull();

    expect(
      body.data.meanTimeToResolutionMinutes,
    ).toBeGreaterThanOrEqual(0);
  });
});