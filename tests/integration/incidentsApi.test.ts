import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  GET as getIncidents,
  POST as createIncident,
} from "../../src/app/api/incidents/route";
import {
  GET as getIncident,
  PATCH as updateIncident,
} from "../../src/app/api/incidents/[id]/route";
import {
  resetTestDatabase,
} from "../helpers/database";

// Creates the route context expected by Next.js dynamic API routes.
function createRouteContext(id: string) {
  return {
    params: Promise.resolve({
      id,
    }),
  };
}

describe("incidents API", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe("POST /api/incidents", () => {
    it("creates a valid incident", async () => {
      const request = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Checkout service unavailable",
            service: "Checkout API",
            severity: "CRITICAL",
          }),
        },
      );

      const response = await createIncident(request);
      const body = await response.json();

      expect(response.status).toBe(201);

      expect(body.data).toMatchObject({
        id: "INC-001",
        title: "Checkout service unavailable",
        service: "Checkout API",
        severity: "CRITICAL",
        status: "OPEN",
      });
    });

    it("rejects an invalid severity", async () => {
      const request = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Checkout service unavailable",
            service: "Checkout API",
            severity: "BANANA",
          }),
        },
      );

      const response = await createIncident(request);

      expect(response.status).toBe(400);
    });

    it("rejects malformed JSON", async () => {
      const request = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "{invalid-json",
        },
      );

      const response = await createIncident(request);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/incidents", () => {
    it("returns persisted incidents", async () => {
      const request = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Authentication failures",
            service: "Authentication Service",
            severity: "HIGH",
          }),
        },
      );

      await createIncident(request);

      const response = await getIncidents();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(1);
      expect(body.data).toHaveLength(1);

      expect(body.data[0]).toMatchObject({
        id: "INC-001",
        title: "Authentication failures",
        status: "OPEN",
      });
    });

    it("returns an empty collection when no incidents exist", async () => {
      const response = await getIncidents();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(0);
      expect(body.data).toEqual([]);
    });
  });

  describe("GET /api/incidents/[id]", () => {
    it("returns an existing incident", async () => {
      const request = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Database connection failures",
            service: "User API",
            severity: "HIGH",
          }),
        },
      );

      await createIncident(request);

      const response = await getIncident(
        new Request(
          "http://localhost/api/incidents/INC-001",
        ),
        createRouteContext("INC-001"),
      );

      const body = await response.json();

      expect(response.status).toBe(200);

      expect(body.data).toMatchObject({
        id: "INC-001",
        title: "Database connection failures",
        status: "OPEN",
      });
    });

    it("returns 404 for a missing incident", async () => {
      const response = await getIncident(
        new Request(
          "http://localhost/api/incidents/INC-999",
        ),
        createRouteContext("INC-999"),
      );

      expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid incident ID", async () => {
      const response = await getIncident(
        new Request(
          "http://localhost/api/incidents/BANANA",
        ),
        createRouteContext("BANANA"),
      );

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/incidents/[id]", () => {
    it("updates an incident to INVESTIGATING", async () => {
      const createRequest = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Elevated API errors",
            service: "User API",
            severity: "HIGH",
          }),
        },
      );

      await createIncident(createRequest);

      const updateRequest = new Request(
        "http://localhost/api/incidents/INC-001",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "INVESTIGATING",
          }),
        },
      );

      const response = await updateIncident(
        updateRequest,
        createRouteContext("INC-001"),
      );

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.status).toBe("INVESTIGATING");
    });

    it("persists a status update", async () => {
      const createRequest = new Request(
        "http://localhost/api/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Payment API latency",
            service: "Payment API",
            severity: "CRITICAL",
          }),
        },
      );

      await createIncident(createRequest);

      const updateRequest = new Request(
        "http://localhost/api/incidents/INC-001",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESOLVED",
          }),
        },
      );

      await updateIncident(
        updateRequest,
        createRouteContext("INC-001"),
      );

      const response = await getIncident(
        new Request(
          "http://localhost/api/incidents/INC-001",
        ),
        createRouteContext("INC-001"),
      );

      const body = await response.json();

      expect(body.data.status).toBe("RESOLVED");
    });

    it("rejects an invalid status", async () => {
      const request = new Request(
        "http://localhost/api/incidents/INC-001",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "BANANA",
          }),
        },
      );

      const response = await updateIncident(
        request,
        createRouteContext("INC-001"),
      );

      expect(response.status).toBe(400);
    });

    it("returns 404 when updating a missing incident", async () => {
      const request = new Request(
        "http://localhost/api/incidents/INC-999",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESOLVED",
          }),
        },
      );

      const response = await updateIncident(
        request,
        createRouteContext("INC-999"),
      );

      expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid incident ID", async () => {
      const request = new Request(
        "http://localhost/api/incidents/BANANA",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESOLVED",
          }),
        },
      );

      const response = await updateIncident(
        request,
        createRouteContext("BANANA"),
      );

      expect(response.status).toBe(400);
    });

    it("rejects malformed JSON", async () => {
      const request = new Request(
        "http://localhost/api/incidents/INC-001",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: "{invalid-json",
        },
      );

      const response = await updateIncident(
        request,
        createRouteContext("INC-001"),
      );

      expect(response.status).toBe(400);
    });
  });
});