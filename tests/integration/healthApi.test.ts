import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns healthy when PostgreSQL is available", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("healthy");
    expect(body.database).toBe("connected");
    expect(body.timestamp).toBeDefined();

    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});