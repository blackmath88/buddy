import { spawnSync } from "node:child_process";
const run = spawnSync("npx", ["playwright", "test", "e2e/evidence.spec.ts"], {
  stdio: "inherit",
  env: process.env,
});
process.exitCode = run.status ?? 1;
