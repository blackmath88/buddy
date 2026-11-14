export const states = [
  "idle",
  "curious",
  "delighted",
  "weather-react",
  "rest",
] as const;
export const weatherKinds = [
  "clear",
  "cloudy",
  "fog",
  "rain",
  "snow",
  "mixed",
  "storm",
  "unknown",
] as const;
export const techniques = ["procedural", "atlas", "cutout", "hybrid"] as const;
export const fidelities = ["sketch", "crafted", "rich"] as const;
export type State = (typeof states)[number];
export type Weather = (typeof weatherKinds)[number];
export type Technique = (typeof techniques)[number];
export type Fidelity = (typeof fidelities)[number];
export type PaletteId = "hearth" | "tomorrow" | "orbit";
export type BuddyId = "sprig" | "ember" | "pip" | "sola" | "mote" | "lumen";
export interface Buddy {
  id: BuddyId;
  name: string;
  role: string;
  motivation: string;
  palette: string[];
  silhouette: string;
  anchor: [number, number];
  dimensions: [number, number];
  states: readonly State[];
  status: string;
  provenance: string;
}
const origin =
  "Original local vector/shape source, src/art.ts; no external asset.";
export const buddies: Buddy[] = [
  {
    id: "sprig",
    name: "Sprig",
    role: "The seed courier",
    motivation:
      "Every seed deserves a place to begin. Sprig keeps the satchel dry, even when the path is not.",
    palette: ["#3b5b44", "#8dba6e", "#dbe6a2", "#b66b44"],
    silhouette:
      "Two unequal leaves, round seed body, low satchel and planted feet.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
  {
    id: "ember",
    name: "Ember",
    role: "The light keeper",
    motivation:
      "A warm window is a small promise. Ember tends it until the last traveller is home.",
    palette: ["#783f36", "#cc7850", "#f4c986", "#f8e4b0"],
    silhouette:
      "Wide kettle belly, tall loop handle, spout and a glowing belly window.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
  {
    id: "pip",
    name: "Pip",
    role: "The wind traveller",
    motivation:
      "Pip follows the breeze, then learns to stand still long enough to listen.",
    palette: ["#526e86", "#a8c7cb", "#e6b99a", "#f2dec4"],
    silhouette:
      "Compact teardrop body, oversized scarf sail and short braced legs.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
  {
    id: "sola",
    name: "Sola",
    role: "The garden tender",
    motivation: "Sola turns spare sunlight into good things to grow.",
    palette: ["#38676a", "#80a8a1", "#f2bd68", "#f7df9c"],
    silhouette:
      "Tall narrow stem body under a broad segmented collector crown.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
  {
    id: "mote",
    name: "Mote",
    role: "The gentle mechanic",
    motivation:
      "A loose connector, a thirsty plant. Mote notices the little things.",
    palette: ["#465668", "#8a9db4", "#e1a48c", "#dde2cb"],
    silhouette:
      "Boxy hovering courier, offset cargo ring, hanging parcel and inspection arm.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
  {
    id: "lumen",
    name: "Lumen",
    role: "The living observatory",
    motivation:
      "Lumen keeps a record of the sky, and always leaves a window open for visitors.",
    palette: ["#4b585d", "#8b9b90", "#e7c38f", "#f1e2bb"],
    silhouette:
      "Grounded cottage body with a hinged dome and window gaze; no robot legs.",
    anchor: [48, 83],
    dimensions: [96, 96],
    states,
    status: "Implemented · code-drawn",
    provenance: origin,
  },
];
export interface Study {
  id: string;
  title: string;
  category: "Pastoral" | "Utopian" | "Hybrid";
  buddy: BuddyId;
  world: string;
  palette: PaletteId;
  technique: Technique;
  fidelity: Fidelity;
  month: number;
  weather: Weather;
  hypothesis: string;
  motion: string;
  seasonal: boolean;
  supportedWeather: readonly Weather[];
  status: string;
  rights: string;
  anchor: [number, number];
  tags: string[];
}
const all = weatherKinds;
export const studies: Study[] = [
  {
    id: "autumn-bridge",
    title: "A parcel before dusk",
    category: "Pastoral",
    buddy: "sprig",
    world: "bridge",
    palette: "hearth",
    technique: "hybrid",
    fidelity: "rich",
    month: 10,
    weather: "clear",
    hypothesis:
      "A tiny courier makes a wide landscape feel like somewhere to come home to.",
    motion: "Sprig checks the satchel; a few leaves cross the river.",
    seasonal: true,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes; new scene, no donor code copied",
    anchor: [0.76, 0.92],
    tags: ["bridge", "courier", "autumn"],
  },
  {
    id: "rainy-shelter",
    title: "Tea until the rain passes",
    category: "Pastoral",
    buddy: "ember",
    world: "shelter",
    palette: "hearth",
    technique: "cutout",
    fidelity: "rich",
    month: 11,
    weather: "rain",
    hypothesis:
      "A roof and one warm light can turn rain into a reason to stay.",
    motion: "Ember leans toward the lamp, rain falls beyond the tea shelter.",
    seasonal: true,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.59, 0.86],
    tags: ["tea", "rain", "shelter"],
  },
  {
    id: "blossom-path",
    title: "The long way through spring",
    category: "Pastoral",
    buddy: "pip",
    world: "path",
    palette: "hearth",
    technique: "procedural",
    fidelity: "crafted",
    month: 4,
    weather: "clear",
    hypothesis:
      "An off-centre winding path makes the wind feel like an invitation.",
    motion: "Pip braces beneath the scarf sail.",
    seasonal: false,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.57, 0.86],
    tags: ["blossom", "path"],
  },
  {
    id: "winter-window",
    title: "Something still growing",
    category: "Pastoral",
    buddy: "ember",
    world: "window",
    palette: "hearth",
    technique: "atlas",
    fidelity: "rich",
    month: 1,
    weather: "snow",
    hypothesis:
      "A window garden holds a pocket of summer inside a winter frame.",
    motion: "Ember tends the light beside the potted seedlings.",
    seasonal: false,
    supportedWeather: ["clear", "cloudy", "snow", "mixed", "unknown"],
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.6, 0.85],
    tags: ["winter", "interior", "garden"],
  },
  {
    id: "solar-terrace",
    title: "A little more sunlight",
    category: "Utopian",
    buddy: "sola",
    world: "terrace",
    palette: "tomorrow",
    technique: "hybrid",
    fidelity: "rich",
    month: 6,
    weather: "clear",
    hypothesis:
      "Useful solar technology belongs among pots, benches and growing things.",
    motion: "Sola angles the collector crown toward the light.",
    seasonal: true,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.65, 0.84],
    tags: ["solar", "greenhouse"],
  },
  {
    id: "cloud-platform",
    title: "Next stop, the gardens",
    category: "Utopian",
    buddy: "pip",
    world: "transit",
    palette: "tomorrow",
    technique: "cutout",
    fidelity: "crafted",
    month: 7,
    weather: "cloudy",
    hypothesis:
      "A quiet platform and soft cloud banks make transit feel neighbourly.",
    motion: "Pip waits in a low, balanced stance beneath a transit canopy.",
    seasonal: false,
    supportedWeather: ["clear", "cloudy", "fog", "unknown"],
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.61, 0.85],
    tags: ["transit", "clouds"],
  },
  {
    id: "night-archive",
    title: "The seeds of tomorrow",
    category: "Utopian",
    buddy: "mote",
    world: "archive",
    palette: "tomorrow",
    technique: "atlas",
    fidelity: "rich",
    month: 9,
    weather: "clear",
    hypothesis:
      "An archive should feel tended, warm and alive rather than secret.",
    motion: "Mote inspects the labels with a small articulated arm.",
    seasonal: false,
    supportedWeather: ["clear", "cloudy", "fog", "unknown"],
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.61, 0.84],
    tags: ["archive", "night", "seeds"],
  },
  {
    id: "rain-station",
    title: "Water for the next morning",
    category: "Utopian",
    buddy: "mote",
    world: "station",
    palette: "tomorrow",
    technique: "hybrid",
    fidelity: "rich",
    month: 8,
    weather: "rain",
    hypothesis:
      "Collecting rain becomes a visible, friendly part of everyday infrastructure.",
    motion: "Mote checks the rain collector beside the greenhouse.",
    seasonal: false,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.61, 0.85],
    tags: ["water", "rain", "station"],
  },
  {
    id: "hill-observatory",
    title: "A house that watches stars",
    category: "Hybrid",
    buddy: "lumen",
    world: "observatory",
    palette: "orbit",
    technique: "hybrid",
    fidelity: "rich",
    month: 9,
    weather: "clear",
    hypothesis:
      "A planted hill and a living observatory give the cosmic a domestic scale.",
    motion: "Lumen opens the dome and settles back into the hillside.",
    seasonal: false,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.64, 0.85],
    tags: ["observatory", "hill", "stars"],
  },
  {
    id: "orbital-cottage",
    title: "Home, a little further out",
    category: "Hybrid",
    buddy: "sprig",
    world: "cottage",
    palette: "orbit",
    technique: "cutout",
    fidelity: "rich",
    month: 5,
    weather: "clear",
    hypothesis:
      "The greenhouse and porch can make an orbital habitat feel familiar.",
    motion: "Sprig shelters a seed parcel beside the greenhouse airlock.",
    seasonal: false,
    supportedWeather: ["clear", "cloudy", "unknown"],
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.61, 0.85],
    tags: ["orbit", "cottage"],
  },
  {
    id: "repair-garden",
    title: "Mending with the wind",
    category: "Hybrid",
    buddy: "sola",
    world: "repair",
    palette: "orbit",
    technique: "procedural",
    fidelity: "crafted",
    month: 8,
    weather: "cloudy",
    hypothesis:
      "A garden workshop gives renewable machinery a place in a cared-for world.",
    motion: "Sola tilts and reaches toward a planted workbench.",
    seasonal: false,
    supportedWeather: all,
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.64, 0.85],
    tags: ["wind", "repair"],
  },
  {
    id: "moonlit-dock",
    title: "The last delivery tonight",
    category: "Hybrid",
    buddy: "mote",
    world: "dock",
    palette: "orbit",
    technique: "atlas",
    fidelity: "rich",
    month: 10,
    weather: "fog",
    hypothesis:
      "A simple dock and a waiting parcel make a moonlit landscape feel inhabited.",
    motion: "Mote hovers over the last parcel on the landing dock.",
    seasonal: false,
    supportedWeather: ["clear", "cloudy", "fog", "unknown"],
    status: "Implemented · original code-drawn art",
    rights: "Original shapes",
    anchor: [0.64, 0.85],
    tags: ["moon", "dock", "delivery"],
  },
];
export const paletteNames: Record<PaletteId, string> = {
  hearth: "Hearth & Meadow",
  tomorrow: "Tomorrow Garden",
  orbit: "Quiet Orbit",
};
export const techniqueNames: Record<Technique, string> = {
  procedural: "Procedural Canvas",
  atlas: "Sprite atlas",
  cutout: "SVG cutout",
  hybrid: "Hybrid layers",
};
export const techniqueDescriptions: Record<Technique, string> = {
  procedural:
    "Cached landscape, direct shape acting and bounded weather. Shape detail is sampled at the selected fidelity.",
  atlas:
    "An original 96 × 96 cell atlas: five actions × eight authored pose samples. Only drawImage runs for the buddy.",
  cutout:
    "Original SVG paths in layered groups; limited pose transforms driven by the shared clock. Vector edges, honestly labelled.",
  hybrid:
    "A cached environment, an atlas buddy and a separately bounded weather pass, coordinated by one lifecycle.",
};
export const fidelitySizes: Record<Fidelity, [number, number]> = {
  sketch: [160, 90],
  crafted: [320, 180],
  rich: [480, 270],
};
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const months = [
  {
    canopy: 0,
    leaves: "#a8b5ab",
    ground: "#bac2b3",
    flowers: 0,
    litter: 0,
    grass: 2,
    buds: 0,
  },
  {
    canopy: 0.05,
    leaves: "#a4b19c",
    ground: "#acb29c",
    flowers: 0,
    litter: 1,
    grass: 3,
    buds: 0,
  },
  {
    canopy: 0.18,
    leaves: "#9cab72",
    ground: "#9da77d",
    flowers: 4,
    litter: 1,
    grass: 5,
    buds: 8,
  },
  {
    canopy: 0.58,
    leaves: "#e6b7b2",
    ground: "#a4b680",
    flowers: 16,
    litter: 0,
    grass: 7,
    buds: 3,
  },
  {
    canopy: 0.9,
    leaves: "#8ca868",
    ground: "#8b9c68",
    flowers: 12,
    litter: 0,
    grass: 10,
    buds: 0,
  },
  {
    canopy: 1,
    leaves: "#6f9767",
    ground: "#859869",
    flowers: 9,
    litter: 0,
    grass: 13,
    buds: 0,
  },
  {
    canopy: 1,
    leaves: "#5f865c",
    ground: "#8b9b68",
    flowers: 5,
    litter: 0,
    grass: 15,
    buds: 0,
  },
  {
    canopy: 0.92,
    leaves: "#93915d",
    ground: "#aaa172",
    flowers: 2,
    litter: 3,
    grass: 14,
    buds: 0,
  },
  {
    canopy: 0.8,
    leaves: "#b49b61",
    ground: "#a69c6a",
    flowers: 0,
    litter: 12,
    grass: 10,
    buds: 0,
  },
  {
    canopy: 0.72,
    leaves: "#c47d48",
    ground: "#a49b6b",
    flowers: 0,
    litter: 28,
    grass: 6,
    buds: 0,
  },
  {
    canopy: 0.22,
    leaves: "#997b52",
    ground: "#9c9578",
    flowers: 0,
    litter: 35,
    grass: 3,
    buds: 0,
  },
  {
    canopy: 0,
    leaves: "#8d9b91",
    ground: "#b3b7a3",
    flowers: 0,
    litter: 3,
    grass: 1,
    buds: 0,
  },
];
export const byStudy = (id: string) => studies.find((s) => s.id === id);
export const byBuddy = (id: BuddyId) => buddies.find((b) => b.id === id)!;
