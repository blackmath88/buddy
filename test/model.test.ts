import { describe, it, expect } from "vitest";
import {
  buddies,
  byStudy,
  months,
  states,
  studies,
  weatherKinds,
} from "../src/catalogue";
import {
  clearFavourites,
  compatible,
  deriveScene,
  parseRecipe,
  poseSample,
  preset,
  readFavourites,
  route,
  seeded,
  shouldRun,
  storageKey,
  writeFavourites,
  type StorageLike,
} from "../src/model";

describe("manifest integrity", () => {
  it("has unique references and valid compatible presets", () => {
    expect(new Set(studies.map((s) => s.id)).size).toBe(12);
    expect(new Set(buddies.map((b) => b.id)).size).toBe(6);
    for (const s of studies) {
      expect(buddies.some((b) => b.id === s.buddy)).toBe(true);
      expect(parseRecipe(JSON.stringify(preset(s.id)))).toEqual(preset(s.id));
      expect(compatible(preset(s.id))).toBeNull();
    }
    for (const b of buddies) expect(b.states).toEqual(states);
  });
  it("authors twelve distinct structural month configurations", () => {
    expect(months).toHaveLength(12);
    expect(
      new Set(
        months.map((m) =>
          JSON.stringify([m.canopy, m.flowers, m.litter, m.grass, m.buds]),
        ),
      ).size,
    ).toBe(12);
  });
});
describe("96 month/weather domain combinations, not visual approval", () => {
  for (let month = 1; month <= 12; month++)
    for (const weather of weatherKinds)
      it(`${month} / ${weather}`, () => {
        const c = deriveScene(month, weather, 123);
        expect(c.month).toBe(month);
        expect(c.weather).toBe(weather);
        expect(c.season).toEqual(months[month - 1]);
        expect(c.particles).toBeLessThanOrEqual(64);
        expect(c.wind).toBeLessThanOrEqual(38);
        expect(c).toEqual(deriveScene(month, weather, 123));
      });
});
describe("determinism, bounds, acting and lifecycle", () => {
  it("clamps malformed inputs and never guesses unknown weather", () => {
    for (const v of [0, 13, 1.5, NaN, Infinity, "April", undefined])
      expect(deriveScene(v, "alien").month).toBe(10);
    expect(deriveScene(4, "alien", NaN).weather).toBe("unknown");
    expect(deriveScene(4, "snow", -1).seed).toBe(0);
    expect(deriveScene(4, "snow", Infinity).seed).toBe(2187);
  });
  it("reproduces seeded sequences independently", () => {
    const a = seeded(123),
      b = seeded(123),
      c = seeded(124);
    const x = Array.from({ length: 20 }, a);
    expect(x).toEqual(Array.from({ length: 20 }, b));
    expect(x).not.toEqual(Array.from({ length: 20 }, c));
    expect(x.every((n) => n >= 0 && n < 1)).toBe(true);
  });
  it("gives each action a distinct stable pose and recovers after acting", () => {
    const poses = states.map((s) => poseSample(s, 1, false, "rich"));
    expect(new Set(poses.map((p) => JSON.stringify(p))).size).toBe(5);
    expect(poseSample("delighted", 3, false, "rich").lift).toBe(0);
    expect(poseSample("curious", 0, false, "rich")).toEqual(
      poseSample("curious", 4, false, "rich"),
    );
  });
  it("requires every lifecycle gate to allow motion", () => {
    expect(shouldRun(false, false, false, true)).toBe(true);
    for (const args of [
      [true, false, false, true, false],
      [false, true, false, true, false],
      [false, false, true, true, false],
      [false, false, false, false, false],
      [false, false, false, true, true],
    ])
      expect(
        shouldRun(...(args as [boolean, boolean, boolean, boolean, boolean])),
      ).toBe(false);
  });
});
describe("recipes and compatibility", () => {
  const valid = preset();
  it("round trips exact known fields", () =>
    expect(parseRecipe(JSON.stringify(valid))).toEqual(valid));
  for (const patch of [
    { version: 2 },
    { seed: -1 },
    { seed: 1.1 },
    { seed: 4294967296 },
    { month: 0 },
    { month: 13 },
    { weather: "hurricane" },
    { buddy: "unknown" },
    { night: "yes" },
    { motion: 1 },
    { smooth: null },
    { html: "<script>" },
    { study: "unknown" },
    { technique: "webgl" },
    { action: "jump" },
    { fidelity: "huge" },
    { palette: "random" },
  ])
    it(`rejects ${JSON.stringify(patch)}`, () =>
      expect(() =>
        parseRecipe(JSON.stringify({ ...valid, ...patch })),
      ).toThrow());
  it("rejects oversize, missing, non-objects and malformed JSON", () => {
    for (const bad of ["", "[]", "null", "{", "{}", " ".repeat(8200)])
      expect(() => parseRecipe(bad)).toThrow();
  });
  it("rejects unsupported mixes and fixed art without mutating the original", () => {
    const before = structuredClone(valid);
    expect(() =>
      parseRecipe(
        JSON.stringify({ ...preset("winter-window"), buddy: "lumen" }),
      ),
    ).toThrow(/grounded/);
    expect(() =>
      parseRecipe(
        JSON.stringify({ ...preset("moonlit-dock"), palette: "hearth" }),
      ),
    ).toThrow(/Orbital/);
    expect(() =>
      parseRecipe(
        JSON.stringify({ ...preset("cloud-platform"), weather: "rain" }),
      ),
    ).toThrow(/weather/);
    expect(() =>
      parseRecipe(JSON.stringify({ ...preset("blossom-path"), month: 1 })),
    ).toThrow(/fixed/);
    expect(valid).toEqual(before);
  });
  it("validates deep links and safely falls back", () => {
    expect(route("#/studies/solar-terrace")).toEqual({
      page: "studies",
      id: "solar-terrace",
    });
    expect(route("#/studies/no-such")).toEqual({ page: "studies" });
    expect(route("#/../../script")).toEqual({ page: "studies" });
    expect(byStudy("autumn-bridge")).toBeDefined();
  });
});
describe("storage failure and recovery", () => {
  const mem = () => {
    const map = new Map<string, string>();
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
    };
  };
  const denied: StorageLike = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
    removeItem() {
      throw Error();
    },
  };
  it("saves, loads and explicitly clears a validated collection", () => {
    const s = mem();
    expect(writeFavourites(s, [preset()])).toBeNull();
    expect(readFavourites(s).items).toEqual([preset()]);
    expect(clearFavourites(s)).toBeNull();
    expect(readFavourites(s).items).toEqual([]);
  });
  it("survives null, denied, corrupt and huge storage", () => {
    for (const s of [null, denied]) {
      expect(readFavourites(s).items).toEqual([]);
      expect(writeFavourites(s, [preset()])).toMatch(/could not/);
      expect(clearFavourites(s)).toMatch(/could not/);
    }
    for (const raw of [
      "{",
      "null",
      '{"version":7,"items":[]}',
      JSON.stringify({ version: 1, items: [{}] }),
      "x".repeat(100001),
    ]) {
      const s = mem();
      s.setItem(storageKey, raw);
      expect(readFavourites(s).error).toBeTruthy();
    }
  });
  it("bounds the collection and rejects invalid nested recipes", () => {
    expect(
      writeFavourites(
        mem(),
        Array.from({ length: 51 }, () => preset()),
      ),
    ).toMatch(/full/);
  });
});
