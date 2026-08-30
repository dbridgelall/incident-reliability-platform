import { config } from "dotenv";

config({
  path: ".env.test",
  override: true,
});

if (process.env.NODE_ENV !== "test") {
  throw new Error(
    "Integration tests must run with NODE_ENV=test.",
  );
}

if (
  process.env.DATABASE_NAME !==
  "incident_reliability_test"
) {
  throw new Error(
    "Integration tests must use the test database.",
  );
}