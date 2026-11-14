import { test, expect, type Page } from "@playwright/test";
const snapshot = (page: Page) =>
  page.evaluate(() =>
    (
      window as unknown as { __buddyLab: { snapshot: () => any } }
    ).__buddyLab.snapshot(),
  );
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
const errors: string[] = [];
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on("pageerror", (e) => errors.push(e.message));
});
test.afterEach(() => expect(errors).toEqual([]));
test("all studies open, gallery is static, all routes are local", async ({
  page,
  baseURL,
}) => {
  const thirdParty: string[] = [];
  page.on("request", (r) => {
    if (
      /^https?:/.test(r.url()) &&
      new URL(r.url()).origin !== new URL(baseURL!).origin
    )
      thirdParty.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(".cards").first().locator(".card")).toHaveCount(12);
  expect((await snapshot(page)).stats.active).toBe(1);
  await expect(page.locator("#study-cards canvas")).toHaveCount(0);
  for (const id of ids) {
    await page.goto("/#/studies/" + id);
    await expect(page.locator(".stage canvas,.stage svg")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect((await snapshot(page)).stats.active).toBe(1);
  }
  for (const route of ["buddies", "techniques", "mix", "compare"]) {
    await page.goto("/#/" + route);
    await expect(page.locator("h1")).toBeVisible();
    expect((await snapshot(page)).stats.active).toBeLessThanOrEqual(2);
  }
  expect(thirdParty).toEqual([]);
});
test("six buddies × five actions across all executable techniques", async ({
  page,
}) => {
  await page.goto("/#/mix");
  for (const buddy of ["sprig", "ember", "pip", "sola", "mote", "lumen"]) {
    await page.locator("[data-key=buddy]").selectOption(buddy);
    for (const action of [
      "idle",
      "curious",
      "delighted",
      "weather-react",
      "rest",
    ]) {
      await page.locator("[data-key=action]").selectOption(action);
      expect((await snapshot(page)).recipes[0].action).toBe(action);
      await expect(page.locator(".stage canvas,.stage svg")).toHaveCount(1);
    }
  }
  for (const technique of ["procedural", "atlas", "cutout", "hybrid"]) {
    await page.locator("[data-key=technique]").selectOption(technique);
    expect((await snapshot(page)).recipes[0].technique).toBe(technique);
    await expect(
      page.locator(technique === "cutout" ? ".stage svg" : ".stage canvas"),
    ).toHaveCount(1);
  }
  await page.goto("/#/techniques");
  await expect(page.locator("#atlas-host canvas")).toHaveAttribute(
    "width",
    "768",
  );
  await page.locator("[data-key=fidelity]").selectOption("sketch");
  await expect(page.locator("#atlas-host canvas")).toHaveAttribute(
    "width",
    "288",
  );
});
test("comparison shares inputs and clock, explains differences, resets", async ({
  page,
}) => {
  await page.goto("/#/compare");
  const a = page.locator("#controls-a"),
    b = page.locator("#controls-b");
  await a.locator("[data-key=weather]").selectOption("snow");
  await expect(b.locator("[data-key=weather]")).toHaveValue("snow");
  await a.locator("[data-key=action]").selectOption("delighted");
  await expect(b.locator("[data-key=action]")).toHaveValue("delighted");
  await a.locator("[data-key=seed]").fill("45");
  await a.locator("[data-key=seed]").press("Tab");
  await expect(b.locator("[data-key=seed]")).toHaveValue("45");
  expect((await snapshot(page)).stats.active).toBe(2);
  await page.locator("#sync").uncheck();
  await b.locator("[data-key=weather]").selectOption("rain");
  await expect(a.locator("[data-key=weather]")).toHaveValue("snow");
  await expect(page.locator("#compare-diff")).toContainText(
    "weather: snow / rain",
  );
  await page.getByRole("button", { name: "Reset comparison" }).click();
  await expect(page.locator("#sync")).toBeChecked();
  await expect(a.locator("[data-key=weather]")).toHaveValue("clear");
});
test("pause, visibility, reduced motion and route disposal stop scheduling", async ({
  page,
}) => {
  await page.goto("/#/compare");
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  const first = await snapshot(page);
  await page.waitForTimeout(150);
  expect((await snapshot(page)).stats.draws).toBe(first.stats.draws);
  expect(first.stats.scheduled).toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect((await snapshot(page)).stats.scheduled).toBe(false);
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(50);
  const reduced = await snapshot(page);
  expect(reduced.stats.scheduled).toBe(false);
  await page.waitForTimeout(150);
  expect((await snapshot(page)).stats.draws).toBe(reduced.stats.draws);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(async () => (await snapshot(page)).stats.scheduled)
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hidden = await snapshot(page);
  expect(hidden.stats.scheduled).toBe(false);
  await page.waitForTimeout(100);
  expect((await snapshot(page)).stats.draws).toBe(hidden.stats.draws);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    location.hash = "/studies";
  });
  await expect(page.locator("#featured")).toBeVisible();
  expect((await snapshot(page)).stats.active).toBe(1);
});
test("imports are atomic, favourites persist and reset does not erase", async ({
  page,
}) => {
  await page.goto("/#/mix");
  await page.getByRole("button", { name: "Save favourite" }).click();
  await expect(page.locator("#favourites button")).toHaveCount(1);
  const before = (await snapshot(page)).recipes[0];
  await page.getByLabel("Recipe JSON").fill('{"version":7}');
  await page.getByRole("button", { name: "Load recipe" }).click();
  await expect(page.locator("#notice")).toContainText("Current preview kept");
  expect((await snapshot(page)).recipes[0]).toEqual(before);
  await page
    .getByLabel("Recipe JSON")
    .fill(JSON.stringify({ ...before, action: "rest", seed: 333 }));
  await page.getByRole("button", { name: "Load recipe" }).click();
  await expect(page.locator("[data-key=action]")).toHaveValue("rest");
  await page.getByRole("button", { name: "Reset preview" }).click();
  await expect(page.locator("#favourites button")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("#favourites button")).toHaveCount(1);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  expect((await download).suggestedFilename()).toBe("buddy-autumn-bridge.json");
  await page.getByRole("button", { name: "Clear all favourites" }).click();
  await expect(page.locator("#favourites button")).toHaveCount(0);
});
test("denied and corrupt storage remain usable; incompatible choices explain why", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await page.goto("/#/mix/winter-window");
  await expect(page.locator("[data-key=month]")).toBeDisabled();
  await expect(
    page.locator("[data-key=buddy] option[value=lumen]"),
  ).toHaveAttribute("disabled", "");
  await expect(
    page.locator("[data-key=buddy] option[value=lumen]"),
  ).toContainText("grounded");
  await page.getByRole("button", { name: "Save favourite" }).click();
  await expect(page.locator("#notice")).toContainText("could not be saved");
  await page.locator("[data-key=action]").selectOption("curious");
  await expect(page.locator("[data-key=action]")).toHaveValue("curious");
});
test("portrait, zoom, keyboard, no-JS and canvas fallback", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#/compare");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const boxes = await page.locator(".stage").all();
  expect((await boxes[1].boundingBox())!.y).toBeGreaterThan(
    (await boxes[0].boundingBox())!.y,
  );
  await page.goto("/#/mix");
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const p = await nojs.newPage();
  await p.goto("/");
  await expect(p.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(p.locator("noscript")).toBeVisible();
  await nojs.close();
  const failed = await browser.newContext();
  await failed.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  const f = await failed.newPage();
  await f.goto("/#/studies/autumn-bridge");
  await expect(f.locator(".canvas-fallback")).toBeVisible();
  await expect(f.locator("h1")).toBeVisible();
  await failed.close();
});
