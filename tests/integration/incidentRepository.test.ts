import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
} from "../../src/lib/incidentRepository";
import {
  resetTestDatabase,
} from "../helpers/database";

import { getIncidentEvents } from "../../src/lib/incidentEventRepository";

// Converts an application incident ID such as INC-001 into its database ID.
function getNumericIncidentId(incidentId: string): number {
  return Number(incidentId.replace("INC-", ""));
}

describe("incidentRepository", () => {
  // Start every test with an empty incidents table and reset IDs.
  beforeEach(async () => {
    await resetTestDatabase();
  });


  describe("createIncident", () => {
    it("creates and returns a persisted incident", async () => {
      const incident = await createIncident({
        title: "Checkout service unavailable",
        service: "Checkout API",
        severity: "CRITICAL",
      });

      expect(incident).toMatchObject({
        id: "INC-001",
        title: "Checkout service unavailable",
        service: "Checkout API",
        severity: "CRITICAL",
        status: "OPEN",
      });

      expect(incident.createdAt).toBeTruthy();
    });
  });

  describe("getAllIncidents", () => {
    it("returns all persisted incidents", async () => {
      const firstIncident = await createIncident({
        title: "Authentication failures",
        service: "Authentication Service",
        severity: "HIGH",
      });

      const secondIncident = await createIncident({
        title: "Payment API latency",
        service: "Payment API",
        severity: "CRITICAL",
      });

      const incidents = await getAllIncidents();

      expect(incidents).toHaveLength(2);

      expect(incidents[0]).toMatchObject({
        id: firstIncident.id,
        title: "Authentication failures",
      });

      expect(incidents[1]).toMatchObject({
        id: secondIncident.id,
        title: "Payment API latency",
      });
    });

    it("returns an empty array when no incidents exist", async () => {
      const incidents = await getAllIncidents();

      expect(incidents).toEqual([]);
    });
  });

  describe("getIncidentById", () => {
    it("returns an existing incident", async () => {
      const createdIncident = await createIncident({
        title: "Database connection failures",
        service: "User API",
        severity: "HIGH",
      });

      const numericId = getNumericIncidentId(
        createdIncident.id,
      );

      const incident = await getIncidentById(numericId);

      expect(incident).toMatchObject({
        id: createdIncident.id,
        title: "Database connection failures",
        service: "User API",
        severity: "HIGH",
        status: "OPEN",
      });
    });

    it("returns null when the incident does not exist", async () => {
      const incident = await getIncidentById(999);

      expect(incident).toBeNull();
    });
  });

  describe("updateIncidentStatus", () => {
    it("changes an incident from OPEN to INVESTIGATING", async () => {
      const createdIncident = await createIncident({
        title: "Elevated API errors",
        service: "User API",
        severity: "HIGH",
      });

      const numericId = getNumericIncidentId(
        createdIncident.id,
      );

      const incident = await updateIncidentStatus(
        numericId,
        "INVESTIGATING",
      );

      expect(incident).toMatchObject({
        id: createdIncident.id,
        status: "INVESTIGATING",
      });
    });

    describe("incident event history", () => {
    it("records a CREATED event when an incident is created", async () => {
        const incident = await createIncident({
        title: "Checkout service unavailable",
        service: "Checkout API",
        severity: "CRITICAL",
        });

        const numericId = getNumericIncidentId(
        incident.id,
        );

        const events = await getIncidentEvents(
        numericId,
        );

        expect(events).toHaveLength(1);

        expect(events[0]).toMatchObject({
        incidentId: incident.id,
        eventType: "CREATED",
        });

        expect(events[0].createdAt).toBeTruthy();
    });

    it("keeps event histories separated by incident", async () => {
        const firstIncident = await createIncident({
        title: "Authentication failures",
        service: "Authentication Service",
        severity: "HIGH",
        });

        const secondIncident = await createIncident({
        title: "Payment API latency",
        service: "Payment API",
        severity: "CRITICAL",
        });

        const firstEvents = await getIncidentEvents(
        getNumericIncidentId(firstIncident.id),
        );

        const secondEvents = await getIncidentEvents(
        getNumericIncidentId(secondIncident.id),
        );

        expect(firstEvents).toHaveLength(1);
        expect(secondEvents).toHaveLength(1);

        expect(firstEvents[0].incidentId).toBe(
        firstIncident.id,
        );

        expect(secondEvents[0].incidentId).toBe(
        secondIncident.id,
        );
    });
    });
        it("changes an incident to RESOLVED", async () => {
        const createdIncident = await createIncident({
            title: "Elevated API errors",
            service: "User API",
            severity: "HIGH",
        });

        const numericId = getNumericIncidentId(
            createdIncident.id,
        );

        await updateIncidentStatus(
            numericId,
            "INVESTIGATING",
        );

        const incident = await updateIncidentStatus(
            numericId,
            "RESOLVED",
        );

        expect(incident).toMatchObject({
            id: createdIncident.id,
            status: "RESOLVED",
        });
        });
it("records an INVESTIGATION_STARTED event", async () => {
  const incident = await createIncident({
    title: "Authentication failures",
    service: "Authentication Service",
    severity: "HIGH",
  });

  const numericId = getNumericIncidentId(
    incident.id,
  );

  await updateIncidentStatus(
    numericId,
    "INVESTIGATING",
  );

  const events = await getIncidentEvents(
    numericId,
  );

  expect(events).toHaveLength(2);

  expect(events.map((event) => event.eventType)).toEqual([
    "CREATED",
    "INVESTIGATION_STARTED",
  ]);
});

it("records the complete incident lifecycle", async () => {
  const incident = await createIncident({
    title: "Payment API latency",
    service: "Payment API",
    severity: "CRITICAL",
  });

  const numericId = getNumericIncidentId(
    incident.id,
  );

  await updateIncidentStatus(
    numericId,
    "INVESTIGATING",
  );

  await updateIncidentStatus(
    numericId,
    "RESOLVED",
  );

  const events = await getIncidentEvents(
    numericId,
  );

  expect(events).toHaveLength(3);

  expect(events.map((event) => event.eventType)).toEqual([
    "CREATED",
    "INVESTIGATION_STARTED",
    "RESOLVED",
  ]);
});

    it("records a RESOLVED event when an incident is resolved directly", async () => {
    const incident = await createIncident({
        title: "Cache service degradation",
        service: "Cache Service",
        severity: "MEDIUM",
    });

    const numericId = getNumericIncidentId(
        incident.id,
    );

    await updateIncidentStatus(
        numericId,
        "RESOLVED",
    );

    const events = await getIncidentEvents(
        numericId,
    );

    expect(events.map((event) => event.eventType)).toEqual([
        "CREATED",
        "RESOLVED",
    ]);
    });
    
    it("persists status changes in PostgreSQL", async () => {
      const createdIncident = await createIncident({
        title: "Payment API latency",
        service: "Payment API",
        severity: "CRITICAL",
      });

      const numericId = getNumericIncidentId(
        createdIncident.id,
      );

      await updateIncidentStatus(
        numericId,
        "INVESTIGATING",
      );

      const incident =
        await getIncidentById(numericId);

      expect(incident?.status).toBe(
        "INVESTIGATING",
      );
    });

    it("returns null when updating a missing incident", async () => {
      const incident = await updateIncidentStatus(
        999,
        "RESOLVED",
      );

      expect(incident).toBeNull();
    });
  });
});