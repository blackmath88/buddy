import { defineConfig } from "@playwright/test";
const built = process.env.LAB_PRODUCTION === "1";
const baseURL =
  process.env.LAB_URL ??
  (built ? "http://localhost:5173/buddy/" : "http://localhost:5173/");
export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/browser-results.json" }],
  ],
  webServer: process.env.LAB_URL
    ? undefined
    : {
        command: built
          ? "node scripts/serve-built.mjs"
          : "npm run dev -- --port 5173 --strictPort",
        url: baseURL,
        reuseExistingServer: false,
      },
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ["--no-sandbox"],
        }
      : undefined,
    screenshot: "only-on-failure",
  },
});
