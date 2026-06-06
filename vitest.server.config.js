import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["server/tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["server/**/*.js"],
      exclude: [
        "server/server.js",
        "server/tests/**",
        "server/routes/gemini.js",
        "server/data/**",
        "server/utils/**",
      ],
      thresholds: {
        lines: 80,
      },
    },
  },
});
