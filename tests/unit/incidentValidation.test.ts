import { describe, expect, it } from "vitest";

import {
  validateCreateIncident,
  validateUpdateIncidentStatus,
} from "../../src/lib/incidentValidation";

describe("validateCreateIncident", () => {
  it("accepts a valid incident", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: "Payment API",
      severity: "CRITICAL",
    });

    expect(result).toEqual({
      title: "Payment service unavailable",
      service: "Payment API",
      severity: "CRITICAL",
    });
  });

  it("rejects an invalid severity", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: "Payment API",
      severity: "BANANA",
    });

    expect(result).toBeNull();
  });

  it("rejects a missing title", () => {
    const result = validateCreateIncident({
      service: "Payment API",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a missing service", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects an empty title", () => {
    const result = validateCreateIncident({
      title: "",
      service: "Payment API",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a whitespace-only title", () => {
    const result = validateCreateIncident({
      title: "   ",
      service: "Payment API",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects an empty service", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: "",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a whitespace-only service", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: "   ",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a non-string title", () => {
    const result = validateCreateIncident({
      title: 123,
      service: "Payment API",
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a non-string service", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: 123,
      severity: "HIGH",
    });

    expect(result).toBeNull();
  });

  it("rejects a non-string severity", () => {
    const result = validateCreateIncident({
      title: "Payment service unavailable",
      service: "Payment API",
      severity: 123,
    });

    expect(result).toBeNull();
  });

  it("rejects null input", () => {
    expect(validateCreateIncident(null)).toBeNull();
  });

  it("rejects an array", () => {
    expect(validateCreateIncident([])).toBeNull();
  });

  it("rejects a string instead of an object", () => {
    expect(
      validateCreateIncident("invalid"),
    ).toBeNull();
  });
});

describe("validateUpdateIncidentStatus", () => {
  it("accepts OPEN", () => {
    expect(
      validateUpdateIncidentStatus({
        status: "OPEN",
      }),
    ).toEqual({
      status: "OPEN",
    });
  });

  it("accepts INVESTIGATING", () => {
    expect(
      validateUpdateIncidentStatus({
        status: "INVESTIGATING",
      }),
    ).toEqual({
      status: "INVESTIGATING",
    });
  });

  it("accepts RESOLVED", () => {
    expect(
      validateUpdateIncidentStatus({
        status: "RESOLVED",
      }),
    ).toEqual({
      status: "RESOLVED",
    });
  });

  it("rejects an invalid status", () => {
    expect(
      validateUpdateIncidentStatus({
        status: "BANANA",
      }),
    ).toBeNull();
  });

  it("rejects a missing status", () => {
    expect(
      validateUpdateIncidentStatus({}),
    ).toBeNull();
  });

  it("rejects an empty status", () => {
    expect(
      validateUpdateIncidentStatus({
        status: "",
      }),
    ).toBeNull();
  });

  it("rejects a non-string status", () => {
    expect(
      validateUpdateIncidentStatus({
        status: 123,
      }),
    ).toBeNull();
  });

  it("rejects null input", () => {
    expect(
      validateUpdateIncidentStatus(null),
    ).toBeNull();
  });

  it("rejects an array", () => {
    expect(
      validateUpdateIncidentStatus([]),
    ).toBeNull();
  });
});