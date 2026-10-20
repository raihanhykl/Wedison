import { defineConfig } from "vitest/config";

// Unit tests (test/*.unit.test.ts) need nothing. Integration tests (test/*.api.test.ts) hit the
// real Express app against DATABASE_URL from server/.env and clean up what they create.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
