import { existsSync } from "node:fs";

import { config } from "dotenv";

// Local development uses .env.test.
// CI supplies the database environment variables directly.
if (existsSync(".env.test")) {
  config({
    path: ".env.test",
    override: true,
  });
}

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