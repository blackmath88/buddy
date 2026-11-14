import { cp } from "node:fs/promises";
await cp("studies", "dist/studies", { recursive: true });
await cp("docs", "dist/docs", { recursive: true });
