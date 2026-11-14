import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const dir = "artifacts";
test("capture actual specimens, contact-sheet inputs and named-environment timing", async ({
  page,
  browser,
}) => {
  test.setTimeout(120000);
  await mkdir(dir + "/studies", { recursive: true });
  await mkdir(dir + "/buddies", { recursive: true });
  await mkdir(dir + "/techniques", { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#study-cards .card")).toHaveCount(12);
  await page.screenshot({ path: dir + "/gallery.png", fullPage: true });
  const ids = [
    "autumn-bridge",
    "rainy-shelter",
    "blossom-path",
    "winter-window",
    "solar-terrace",
    "cloud-platform",
    "night-archive",
    "rain-station",
    "hill-observatory",
    "orbital-cottage",
    "repair-garden",
    "moonlit-dock",
  ];
  for (const id of ids) {
    await page.goto("/#/studies/" + id);
    await expect(page.locator(".stage canvas,.stage svg")).toHaveCount(1);
    await page
      .locator(".stage")
      .screenshot({ path: `${dir}/studies/${id}.png` });
  }
  await page.goto("/#/buddies");
  for (let i = 0; i < 6; i++)
    await page
      .locator(".buddy-card")
      .nth(i)
      .screenshot({
        path: `${dir}/buddies/${["sprig", "ember", "pip", "sola", "mote", "lumen"][i]}.png`,
      });
  await page.goto("/#/techniques");
  for (let i = 0; i < 2; i++)
    await page
      .locator(".triptych")
      .nth(i)
      .screenshot({
        path: `${dir}/fidelity-${i === 0 ? "pastoral" : "scifi"}.png`,
      });
  for (const technique of ["procedural", "atlas", "cutout", "hybrid"]) {
    await page.locator("[data-key=technique]").selectOption(technique);
    await page.locator("[data-key=action]").selectOption("curious");
    await page.locator("#atlas-frame").fill("2");
    await page.locator("#atlas-frame").dispatchEvent("input");
    await page
      .locator(".stage")
      .screenshot({ path: `${dir}/techniques/${technique}.png` });
  }
  await page.goto("/#/mix/solar-terrace");
  await page.screenshot({ path: dir + "/mixer.png", fullPage: true });
  for (const [label, month, weather, night] of [
    ["spring-mixed", "4", "mixed", false],
    ["winter-snow", "1", "snow", false],
    ["autumn-rain-night", "10", "rain", true],
  ] as const) {
    await page.locator("[data-key=month]").selectOption(month);
    await page.locator("[data-key=weather]").selectOption(weather);
    await page.locator("[data-key=night]").setChecked(night);
    await page.locator(".stage").screenshot({ path: `${dir}/${label}.png` });
  }
  await page.goto("/#/compare");
  await page.screenshot({ path: dir + "/comparison.png", fullPage: true });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#/mix");
  await page.screenshot({ path: dir + "/portrait.png", fullPage: true });
  // Named environment, bounded sampling; no fabricated FPS or universal-device claims.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/compare");
  const measurements = await page.evaluate(async () => {
    const lab = (window as any).__buddyLab;
    const start = lab.snapshot();
    const deltas: number[] = [];
    let previous = performance.now();
    await new Promise<void>((resolve) => {
      let frames = 0;
      const sample = (now: number) => {
        deltas.push(now - previous);
        previous = now;
        if (++frames >= 120) resolve();
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    const sorted = deltas.slice(5).sort((a, b) => a - b);
    return {
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      devicePixelRatio,
      viewport: [innerWidth, innerHeight],
      samples: sorted.length,
      medianFrameIntervalMs: sorted[Math.floor(sorted.length * 0.5)],
      p95FrameIntervalMs: sorted[Math.floor(sorted.length * 0.95)],
      maxFrameIntervalMs: sorted.at(-1),
      start,
      end: lab.snapshot(),
      canvases: [...document.querySelectorAll("canvas")].map((c) => [
        c.width,
        c.height,
      ]),
      note: "Headless Chromium in managed Linux container; frame intervals include browser scheduling and shared renderer work. Not universal FPS or mobile performance.",
    };
  });
  await writeFile(
    dir + "/performance.json",
    JSON.stringify({ browser: browser.version(), ...measurements }, null, 2) +
      "\n",
  );
});
