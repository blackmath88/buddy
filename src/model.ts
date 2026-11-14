import {
  byStudy,
  buddies,
  fidelities,
  months,
  states,
  techniques,
  weatherKinds,
  type BuddyId,
  type Fidelity,
  type PaletteId,
  type State,
  type Technique,
  type Weather,
} from "./catalogue";
export interface Recipe {
  version: 1;
  study: string;
  buddy: BuddyId;
  palette: PaletteId;
  fidelity: Fidelity;
  technique: Technique;
  month: number;
  weather: Weather;
  night: boolean;
  action: State;
  motion: boolean;
  smooth: boolean;
  seed: number;
}
export const preset = (id = "autumn-bridge"): Recipe => {
  const s = byStudy(id) ?? byStudy("autumn-bridge")!;
  return {
    version: 1,
    study: s.id,
    buddy: s.buddy,
    palette: s.palette,
    fidelity: s.fidelity,
    technique: s.technique,
    month: s.month,
    weather: s.weather,
    night: [
      "hill-observatory",
      "night-archive",
      "moonlit-dock",
      "orbital-cottage",
    ].includes(s.id),
    action: "idle",
    motion: true,
    smooth: false,
    seed: 2187,
  };
};
// Local xorshift32 generator. Zero input gets a nonzero internal state.
export const seeded = (seed: number) => {
  let state = Math.trunc(seed) >>> 0 || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
};
export function compatible(recipe: Recipe): string | null {
  const s = byStudy(recipe.study);
  if (!s) return "Unknown environment.";
  if (
    recipe.buddy === "lumen" &&
    ["window", "transit", "archive", "dock"].includes(s.world)
  )
    return "Lumen needs a grounded outdoor site with room for its dome.";
  if (recipe.palette === "hearth" && ["cottage", "dock"].includes(s.world))
    return "Orbital environments need the cool sky and material ramps of Quiet Orbit or Tomorrow Garden.";
  if (!s.supportedWeather.includes(recipe.weather))
    return "This environment does not illustrate that weather category.";
  if (!s.seasonal && recipe.month !== s.month)
    return "This study has fixed seasonal art; use its authored month.";
  return null;
}
const allowed = [
  "version",
  "study",
  "buddy",
  "palette",
  "fidelity",
  "technique",
  "month",
  "weather",
  "night",
  "action",
  "motion",
  "smooth",
  "seed",
];
export function parseRecipe(input: string): Recipe {
  if (new TextEncoder().encode(input).length > 8192)
    throw Error("Recipe is larger than 8 KB.");
  let x: unknown;
  try {
    x = JSON.parse(input);
  } catch {
    throw Error("Recipe is not valid JSON.");
  }
  if (!x || typeof x !== "object" || Array.isArray(x))
    throw Error("Expected a recipe object.");
  const r = x as Record<string, unknown>;
  if (
    Object.keys(r).some((k) => !allowed.includes(k)) ||
    Object.keys(r).length !== allowed.length
  )
    throw Error("Unexpected or missing recipe fields.");
  if (
    r.version !== 1 ||
    typeof r.study !== "string" ||
    !byStudy(r.study) ||
    !buddies.some((b) => b.id === r.buddy) ||
    !["hearth", "tomorrow", "orbit"].includes(String(r.palette)) ||
    !fidelities.includes(r.fidelity as Fidelity) ||
    !techniques.includes(r.technique as Technique) ||
    !weatherKinds.includes(r.weather as Weather) ||
    !states.includes(r.action as State)
  )
    throw Error("Unknown version, ID or option.");
  if (
    !Number.isInteger(r.month) ||
    Number(r.month) < 1 ||
    Number(r.month) > 12 ||
    !Number.isInteger(r.seed) ||
    Number(r.seed) < 0 ||
    Number(r.seed) > 4294967295
  )
    throw Error("Month or seed is outside its allowed range.");
  if (["night", "motion", "smooth"].some((k) => typeof r[k] !== "boolean"))
    throw Error("Motion, smooth and night must be booleans.");
  const recipe = r as unknown as Recipe;
  const reason = compatible(recipe);
  if (reason) throw Error(reason);
  return recipe;
}
export function deriveScene(
  month: unknown,
  weather: unknown,
  seed: unknown = 2187,
) {
  const m =
    typeof month === "number" &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12
      ? month
      : 10;
  const w = weatherKinds.includes(weather as Weather)
    ? (weather as Weather)
    : "unknown";
  const n =
    typeof seed === "number" && Number.isFinite(seed)
      ? Math.max(0, Math.min(4294967295, Math.trunc(seed)))
      : 2187;
  return {
    month: m,
    weather: w,
    seed: n,
    season: months[m - 1],
    particles: ["rain", "storm", "snow", "mixed"].includes(w)
      ? w === "storm"
        ? 64
        : 42
      : m === 10
        ? 16
        : 0,
    fog: w === "fog",
    wind: w === "storm" ? 38 : w === "rain" ? 15 : 6,
  };
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export const storageKey = "buddy-lab.favourites.v1";
export function readFavourites(storage: StorageLike | null): {
  items: Recipe[];
  error: string | null;
} {
  try {
    const raw = storage?.getItem(storageKey);
    if (!raw)
      return {
        items: [],
        error: storage
          ? null
          : "Storage unavailable; export recipes to keep them.",
      };
    if (raw.length > 100000) throw Error();
    const v = JSON.parse(raw);
    if (v.version !== 1 || !Array.isArray(v.items) || v.items.length > 50)
      throw Error();
    return {
      items: v.items.map((i: unknown) => parseRecipe(JSON.stringify(i))),
      error: null,
    };
  } catch {
    return {
      items: [],
      error:
        "Saved favourites could not be read. Export recipes or clear the damaged collection.",
    };
  }
}
export function writeFavourites(
  storage: StorageLike | null,
  items: Recipe[],
): string | null {
  try {
    if (!storage) throw Error();
    if (items.length > 50) return "The collection is full (50 recipes).";
    items.forEach((i) => parseRecipe(JSON.stringify(i)));
    storage.setItem(storageKey, JSON.stringify({ version: 1, items }));
    return null;
  } catch {
    return "Favourites could not be saved. Your preview is safe; export a recipe instead.";
  }
}
export function clearFavourites(storage: StorageLike | null): string | null {
  try {
    if (!storage) throw Error();
    storage.removeItem(storageKey);
    return null;
  } catch {
    return "Saved favourites could not be cleared in this browser.";
  }
}
export function route(hash: string): { page: string; id?: string } {
  const match =
    /^#?\/(studies|buddies|techniques|mix|compare)(?:\/([a-z0-9-]+))?$/.exec(
      hash,
    );
  if (!match) return { page: "studies" };
  if (match[2] && match[1] === "studies" && !byStudy(match[2]))
    return { page: "studies" };
  return { page: match[1], id: match[2] };
}
export function shouldRun(
  manual: boolean,
  reduced: boolean,
  hidden: boolean,
  motion: boolean,
  disposed = false,
) {
  return !manual && !reduced && !hidden && motion && !disposed;
}
export function poseSample(
  action: State,
  time: number,
  smooth: boolean,
  fidelity: Fidelity,
) {
  const frames = fidelity === "sketch" ? 3 : 8;
  const phase = (Math.max(0, time) % 4) / 4;
  const p = smooth ? phase : Math.floor(phase * frames) / frames;
  // Anticipation → action → recovery → long settled hold. No perpetual bounce.
  const pulse =
    p < 0.14
      ? (-p / 0.14) * 0.18
      : p < 0.34
        ? Math.sin(((p - 0.14) / 0.2) * Math.PI)
        : p < 0.5
          ? -(0.5 - p) * 0.2
          : 0;
  return {
    lean:
      action === "curious"
        ? pulse * 0.12
        : action === "weather-react"
          ? -0.14 + pulse * 0.03
          : action === "delighted"
            ? pulse * 0.08
            : 0,
    lift: action === "delighted" ? pulse * 7 : action === "rest" ? 3 : 0,
    reach:
      action === "curious"
        ? pulse * 9
        : action === "weather-react"
          ? 7
          : action === "delighted"
            ? pulse * 6
            : 0,
    rest: action === "rest",
    blink: action === "rest" || phase > 0.955,
    phase: p,
  };
}
