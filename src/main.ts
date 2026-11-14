import "./styles.css";
import {
  buddies,
  byBuddy,
  byStudy,
  fidelities,
  fidelitySizes,
  monthNames,
  paletteNames,
  states,
  studies,
  techniqueDescriptions,
  techniqueNames,
  techniques,
  weatherKinds,
  type BuddyId,
  type Fidelity,
  type PaletteId,
  type State,
  type Technique,
  type Weather,
} from "./catalogue";
import {
  clearFavourites,
  compatible,
  parseRecipe,
  preset,
  readFavourites,
  route,
  writeFavourites,
  type Recipe,
  type StorageLike,
} from "./model";
import { buddyArt, svgShapes } from "./art";
import {
  characterSheet,
  makeAtlas,
  SharedClock,
  Specimen,
  stats,
  thumbnail,
} from "./renderer";

const main = document.querySelector<HTMLElement>("main")!;
let clock: SharedClock | undefined,
  renderers: Specimen[] = [],
  current = preset(),
  right = { ...preset(), technique: "atlas" as Technique },
  filter = "All",
  sync = true,
  manual = false;
let storage: StorageLike | null = null;
try {
  storage = localStorage;
} catch {
  /* denied storage is a supported state */
}
let { items: favourites, error: storageError } = readFavourites(storage);
const thumbs = new Map<string, string>();
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const titleCase = (s: string) =>
  s.replace(/(^|-)(\w)/g, (_, a, b) => (a ? " " : "") + b.toUpperCase());
const heading = (kicker: string, title: string, body: string) =>
  `<div class="page-heading"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${body}</p></div>`;
const thumbnailFor = (r: Recipe) => {
  const key = JSON.stringify(r);
  if (thumbs.has(key)) return thumbs.get(key)!;
  const url = thumbnail({ ...r, motion: false });
  if (thumbs.size > 48) thumbs.delete(thumbs.keys().next().value!);
  thumbs.set(key, url);
  return url;
};
const image = (r: Recipe, alt: string) =>
  `<img src="${thumbnailFor(r)}" alt="${escape(alt)}" width="480" height="270" loading="lazy">`;
function stage(id = "specimen") {
  return `<div class="stage" id="${id}"></div>`;
}
function openSpecimen(host: string, r: Recipe) {
  if (!clock) clock = new SharedClock();
  const h = document.getElementById(host);
  if (h) {
    const renderer = new Specimen(h, r, clock);
    renderers.push(renderer);
    return renderer;
  }
}
function stop() {
  renderers.forEach((r) => r.dispose());
  renderers = [];
  clock?.dispose();
  clock = undefined;
}
function option(
  value: string,
  label: string,
  selected: string | number,
  disabled = false,
  reason = "",
) {
  return `<option value="${escape(value)}" ${String(selected) === value ? "selected" : ""} ${disabled ? "disabled" : ""}>${escape(label)}${disabled && reason ? " — " + escape(reason) : ""}</option>`;
}
function select(
  label: string,
  key: string,
  opts: string,
  prefix = "",
  disabled = false,
  note = "",
) {
  return `<label>${label}<select data-key="${key}" data-side="${prefix}" ${disabled ? "disabled" : ""} ${note ? `title="${escape(note)}"` : ""}>${opts}</select>${note ? `<span>${note}</span>` : ""}</label>`;
}
function controls(r: Recipe, prefix = "", mixer = false, compare = false) {
  const study = byStudy(r.study)!;
  let html = "";
  if (mixer)
    html += select(
      "Environment",
      "study",
      studies.map((s) => option(s.id, s.title, r.study)).join(""),
      prefix,
    );
  if (mixer || compare)
    html += select(
      "Buddy",
      "buddy",
      buddies
        .map((b) => {
          const why = compatible({ ...r, buddy: b.id });
          return option(b.id, b.name, r.buddy, !!why, why ?? "");
        })
        .join(""),
      prefix,
    );
  if (mixer)
    html += select(
      "Art direction",
      "palette",
      Object.entries(paletteNames)
        .map(([id, name]) => {
          const why = compatible({ ...r, palette: id as PaletteId });
          return option(id, name, r.palette, !!why, why ?? "");
        })
        .join(""),
      prefix,
    );
  html += select(
    "Action",
    "action",
    states.map((x) => option(x, titleCase(x), r.action)).join(""),
    prefix,
  );
  html += select(
    "Technique",
    "technique",
    techniques.map((x) => option(x, techniqueNames[x], r.technique)).join(""),
    prefix,
  );
  html += select(
    "Fidelity",
    "fidelity",
    fidelities
      .map((x, i) => option(x, `F${i + 1} · ${titleCase(x)}`, r.fidelity))
      .join(""),
    prefix,
  );
  html += select(
    "Month",
    "month",
    monthNames.map((x, i) => option(String(i + 1), x, r.month)).join(""),
    prefix,
    !study.seasonal,
    !study.seasonal ? "Fixed seasonal art" : "",
  );
  html += select(
    "Mocked weather",
    "weather",
    weatherKinds
      .map((x) =>
        option(
          x,
          titleCase(x),
          r.weather,
          !study.supportedWeather.includes(x),
          "unsupported",
        ),
      )
      .join(""),
    prefix,
  );
  html += `<label>Seed<input type="number" min="0" max="4294967295" step="1" data-key="seed" data-side="${prefix}" value="${r.seed}"></label>`;
  html += `<label class="check"><input type="checkbox" data-key="night" data-side="${prefix}" ${r.night ? "checked" : ""}>Night</label><label class="check"><input type="checkbox" data-key="motion" data-side="${prefix}" ${r.motion ? "checked" : ""}>Motion</label><label class="check"><input type="checkbox" data-key="smooth" data-side="${prefix}" ${r.smooth ? "checked" : ""}>Smooth poses</label>`;
  return html;
}
function pauseButton() {
  return `<button class="button" data-command="pause" aria-pressed="${manual}">${manual ? "Resume" : "Pause"} animation</button>`;
}
function motionStatus() {
  return `<p class="status-line" id="motion-status" role="status" aria-live="polite">${clock?.isReduced ? "Reduced motion: composed still." : manual ? "Animation paused." : "Motion follows your browser preference."} Weather is simulated; no location is used.</p>`;
}
function refreshMotionStatus() {
  const el = document.getElementById("motion-status");
  if (el)
    el.textContent = clock?.isReduced
      ? "Reduced motion: composed still. Weather is simulated."
      : manual
        ? "Animation paused. Weather is simulated."
        : "Animation follows the motion control and browser preference. Weather is simulated.";
}
function studyCard(s: (typeof studies)[number], i: number) {
  return `<a class="card" href="#/studies/${s.id}"><div class="card-image">${image(preset(s.id), s.title + " — " + byBuddy(s.buddy).name + " in " + s.category.toLowerCase() + " scenery")}<span class="tag">${s.category}</span></div><div class="card-head"><h3>${s.title}</h3><span aria-hidden="true"><span class="arrow" aria-hidden="true"></span></span></div><p>${byBuddy(s.buddy).name} · ${techniqueNames[s.technique]} · F${fidelities.indexOf(s.fidelity) + 1}</p><p class="disclosure">${String(i + 1).padStart(2, "0")} / Implemented · original code-drawn art</p></a>`;
}
function gallery() {
  main.innerHTML = `<div class="intro"><div><div class="eyebrow">A collection of small, living worlds</div><h1>Small companions.<br>Worlds worth <em>slowing down for.</em></h1></div><p>Seasonal places, curious creatures, and a little everyday wonder. An open notebook of original art and motion.</p></div><section class="hero-grid" aria-labelledby="featured-heading">${stage("featured")}<div class="specimen-info"><div class="eyebrow">Study 01 · Hearth & Meadow</div><h2 id="featured-heading">A parcel<br>before dusk.</h2><p>A covered bridge. A pocket of seeds. Sprig takes the familiar way home.</p><a class="button primary" href="#/studies/autumn-bridge">Step into the study <span aria-hidden="true"><span class="arrow" aria-hidden="true"></span></span></a><dl class="meta"><div><dt>Companion</dt><dd>Sprig</dd></div><div><dt>Technique</dt><dd>Hybrid layers</dd></div><div><dt>Season</dt><dd>October · mocked clear</dd></div><div><dt>Artwork</dt><dd>Original code-drawn</dd></div></dl></div></section><div class="strip"><span>ORIGINAL WORLDS. SHARED CURIOSITY.</span><span>06 companions &nbsp; / &nbsp; 12 studies &nbsp; / &nbsp; 04 techniques</span><button class="filter" data-command="pause" aria-pressed="${manual}">${manual ? "Resume" : "Pause"} animation</button></div><section aria-labelledby="collection-heading"><div class="toolbar"><h2 id="collection-heading">The field collection <span class="number">/ 12</span></h2><div class="filters" role="group" aria-label="Filter studies">${["All", "Pastoral", "Utopian", "Hybrid", "Favourites"].map((f) => `<button class="filter" data-filter="${f}" aria-pressed="${filter === f}">${f}</button>`).join("")}</div></div><div class="cards" id="study-cards"></div><p class="section-note">Every study is a local, original composition. Cards are still renders; only an opened specimen animates. Seasonal range and supported weather are disclosed inside.</p></section><section class="section-head"><div><div class="section-kicker">Not just a change of scenery</div><h2>Meet the ones who live here.</h2></div><a class="button" href="#/buddies">Meet all six <span class="arrow" aria-hidden="true"></span></a></section><div class="buddy-grid">${buddies
    .slice(0, 3)
    .map(
      (b) =>
        `<a class="card buddy-card" href="#/buddies/${b.id}"><div class="buddy-portrait">${portrait(b.id)}</div><div class="card-head"><h3>${b.name}</h3><span><span class="arrow" aria-hidden="true"></span></span></div><p>${b.role}</p></a>`,
    )
    .join("")}</div>`;
  filterCards();
  openSpecimen("featured", preset());
  clock?.pause(manual);
}
function filterCards() {
  const selected = studies.filter(
    (s) =>
      filter === "All" ||
      (filter === "Favourites" && favourites.some((f) => f.study === s.id)) ||
      s.category === filter,
  );
  document.getElementById("study-cards")!.innerHTML = selected.length
    ? selected.map((s) => studyCard(s, studies.indexOf(s))).join("")
    : '<p class="empty">No favourites yet. Open a study or the mixer and save a recipe.</p>';
}
function portrait(id: BuddyId) {
  const a = buddyArt(id, "idle", 0, "rich");
  return `<svg aria-hidden="true" viewBox="0 0 120 100"><ellipse cx="60" cy="86" rx="29" ry="4" fill="#bdc7b1"/><g transform="translate(12 0)">${svgShapes(a.shapes)}</g></svg>`;
}
function buddyPage(id?: string) {
  const chosen = buddies.find((b) => b.id === id);
  main.innerHTML =
    heading(
      "Meet the companions",
      chosen
        ? `${chosen.name}, ${chosen.role.toLowerCase()}.`
        : "A little personality goes a long way.",
      "Six original silhouettes, six small motivations. Each has five pose-driven actions, with a settled still pose. These are authored code-drawn characters, not production sprite commissions.",
    ) +
    `<div class="buddy-grid">${(chosen ? [chosen] : buddies).map((b) => `<article class="buddy-card"><div class="buddy-portrait">${portrait(b.id)}</div><h2>${b.name}</h2><p class="role">${b.role}</p><div class="swatches" aria-label="${b.name} palette">${b.palette.map((c) => `<span style="background:${c}" title="${c}"></span>`).join("")}</div><p>${b.motivation}</p><p>${b.silhouette}</p><img class="character-sheet" src="data:image/svg+xml,${encodeURIComponent(characterSheet(b.id))}" alt="${b.name}: idle, curious, delighted, weather reaction and rest poses" width="480" height="112"><p class="disclosure">96 × 96 cells · bottom anchor (48, 83) · five states<br>Original paths in src/art.ts · implemented code-drawn art</p><a class="button" href="#/mix/${b.id}">Explore with ${b.name} <span class="arrow" aria-hidden="true"></span></a></article>`).join("")}</div><div class="section-head"><div><div class="section-kicker">Acting, not just blinking</div><h2>Try a different state.</h2></div></div>${stage()}<div class="controls" id="controls">${controls(current)}</div>${pauseButton()}${motionStatus()}<p class="timing-note">Curiosity leans and reaches. Delight anticipates, lifts and recovers. Weather reaction braces the body and raises the arm; rest lowers the posture. Sparse blinks and a long settled hold replace constant bouncing.</p>`;
  openSpecimen("specimen", current);
  clock?.pause(manual);
}
function specimenPage(id: string) {
  const s = byStudy(id)!;
  current = preset(id);
  main.innerHTML = `<a class="back" href="#/studies">← Back to the collection</a>${heading(`${s.category} · ${paletteNames[s.palette]}`, s.title + ".", s.hypothesis)}${stage()}<div class="strip"><span>${byBuddy(current.buddy).name} · ${techniqueNames[current.technique]}</span><span>${s.status} · ${s.rights}</span></div><div class="controls" id="controls">${controls(current)}</div><div class="actions">${pauseButton()}<button class="button" data-command="reset">Reset preview</button><button class="button" data-command="favourite">Save favourite ♡</button><a class="button" href="#/mix/${s.id}">Remix this world <span class="arrow" aria-hidden="true"></span></a><a class="button" href="#/compare/${s.id}">Compare techniques <span class="arrow" aria-hidden="true"></span></a></div>${motionStatus()}<div id="notice" class="notice" role="status" aria-live="polite"></div><div class="details-row"><section><h2>A small design hypothesis.</h2><p>${s.hypothesis}</p><p>${s.motion}</p><p>${s.seasonal ? "This anchor supports all twelve structural monthly states. Calendar changes foliage, buds, flowers, ground and litter independently from weather." : "This is fixed seasonal art. The month control is disabled because changing it would not illustrate another season."}</p><p>Supported mocked weather: ${s.supportedWeather.join(", ")}. All lighting is illustrative, not a weather report.</p></section><section><h2>Inside the specimen.</h2><dl><dt>Technique</dt><dd id="tech-description">${techniqueDescriptions[current.technique]}</dd><dt>Art & rights</dt><dd>${s.rights}. Original art lives in src/art.ts; no third-party sprites, fonts or generation service.</dd><dt>Profile</dt><dd>Northern-temperate illustration, with no inferred local ecology.</dd></dl></section></div><details id="atlas-details"><summary>Inspect the original sprite atlas</summary><p class="section-note">Rows: idle, curious, delighted, weather-react, rest. Columns: eight samples across a four-second acting cycle (three at F1). Anchor: (48, 83). Cell: 96 × 96, independent from scene resolution.</p><div class="atlas-wrap" id="atlas-host"></div></details>`;
  openSpecimen("specimen", current);
  clock?.pause(manual);
  document.getElementById("atlas-details")?.addEventListener("toggle", () => {
    const d = document.getElementById("atlas-details") as HTMLDetailsElement;
    if (d.open) showAtlas();
  });
}
function showAtlas() {
  const host = document.getElementById("atlas-host");
  if (!host) return;
  try {
    const a = makeAtlas(current);
    a.canvas.setAttribute(
      "aria-label",
      `${current.buddy} sprite atlas, five rows and ${a.columns} columns`,
    );
    a.canvas.setAttribute("role", "img");
    host.replaceChildren(a.canvas);
    a.canvas.style.width = a.canvas.width + "px";
    const slider = document.getElementById(
      "atlas-frame",
    ) as HTMLInputElement | null;
    if (slider) {
      slider.max = String(a.columns - 1);
      slider.value = "0";
    }
  } catch {
    host.textContent =
      "Canvas atlas inspection is unavailable in this browser.";
  }
}
function triptych(id: string) {
  return `<div class="triptych">${fidelities
    .map((f, i) => {
      const r = { ...preset(id), fidelity: f };
      return `<figure style="margin:0">${image(r, `${byStudy(id)!.title}, fidelity ${i + 1}`)}<h3>F${i + 1} · ${titleCase(f)}</h3><p>${fidelitySizes[f].join(" × ")} · ${i === 0 ? "3 pose samples, broad forms" : i === 1 ? "8 poses, foliage clusters & form" : "8 poses, authored materials & light"}</p></figure>`;
    })
    .join("")}</div>`;
}
function techniquesPage() {
  main.innerHTML =
    heading(
      "The working notebook",
      "Four ways to bring a world to life.",
      "A matched Sprig curiosity action runs through cached Canvas, a real sprite atlas, layered SVG and a hybrid renderer. Compare methods without confusing resolution or refresh rate with animation craft.",
    ) +
    `<div class="tech-list">${techniques.map((t, i) => `<article class="tech-card"><span class="number">T${i + 1} / EXECUTABLE SPECIMEN</span><h2>${techniqueNames[t]}</h2><p>${techniqueDescriptions[t]}</p><button class="button" data-tech="${t}">Open ${techniqueNames[t]} <span class="arrow" aria-hidden="true"></span></button></article>`).join("")}</div><div class="section-head"><div><div class="section-kicker">Matched subject · Sprig / curious</div><h2 id="tech-heading">${techniqueNames[current.technique]}</h2></div><a class="button" href="#/compare">Compare two methods <span class="arrow" aria-hidden="true"></span></a></div>${stage()}<div class="controls" id="controls">${controls(current)}</div><div class="actions">${pauseButton()}<button class="button" data-command="reset">Reset clock & preview</button></div>${motionStatus()}<p class="timing-note">Stepped poses sample three or eight designed poses. Smooth mode interpolates pose timing in shape/SVG methods; atlas methods crossfade adjacent samples. This is an experiment, not a claim of hand-drawn animation. The scene refresh clock remains independent.</p><details open><summary>Atlas / frame inspector</summary><div class="controls"><label>Atlas sample<input id="atlas-frame" type="range" min="0" max="7" value="0"></label><span id="frame-label" class="status-line">Frame 0 · curious · anchor 48,83</span></div><div class="atlas-wrap" id="atlas-host"></div></details><div class="section-head"><div><div class="section-kicker">Fidelity study A · pastoral</div><h2>The same path, more intention.</h2></div></div>${triptych("autumn-bridge")}<div class="section-head"><div><div class="section-kicker">Fidelity study B · optimistic sci-fi</div><h2>From broad forms to a tended place.</h2></div></div>${triptych("solar-terrace")}<p class="section-note">All three share framing and anchors. Higher levels add botanical clusters, material structure, prop marks and character detail. F1 has fewer poses; particle counts stay bounded independently of fidelity. SVG is cutout vector art, not pixel output.</p>`;
  openSpecimen("specimen", current);
  clock?.pause(manual);
  showAtlas();
  document.getElementById("atlas-frame")?.addEventListener("input", (e) => {
    const frame = Number((e.target as HTMLInputElement).value);
    clock?.pause(true);
    manual = true;
    clock!.time = (frame / (current.fidelity === "sketch" ? 3 : 8)) * 4;
    renderers[0]?.render(clock!.time);
    document.getElementById("frame-label")!.textContent =
      `Frame ${frame} · ${current.action} · anchor 48,83`;
    document
      .querySelectorAll<HTMLButtonElement>("[data-command=pause]")
      .forEach((b) => {
        b.textContent = "Resume animation";
        b.setAttribute("aria-pressed", "true");
      });
  });
}
function mixerPage(id?: string) {
  if (id) {
    if (byStudy(id)) current = preset(id);
    else if (buddies.some((b) => b.id === id)) {
      current = {
        ...preset(id === "lumen" ? "hill-observatory" : "autumn-bridge"),
        buddy: id as BuddyId,
      };
    }
  }
  main.innerHTML =
    heading(
      "The world mixer",
      "A familiar place. A new possibility.",
      "Begin with a composed study, then try a compatible companion, material palette or technique. Experimental recipes are local and deterministic. Nothing is uploaded.",
    ) +
    `<div class="preview-layout"><div>${stage()}<div class="actions">${pauseButton()}<button class="button" data-command="reset">Reset preview</button><button class="button primary" data-command="favourite">Save favourite ♡</button><button class="button" data-command="atlas-export">Export atlas PNG</button></div>${motionStatus()}<div class="callout" id="mix-kind">${isCurated() ? "Curated preset" : "Experimental mix"} · Anchors and scale stay normalized. Incompatible choices are disabled with reasons.</div><div id="notice" class="notice" role="status" aria-live="polite">${storageError ?? ""}</div></div><aside class="control-panel"><h2>Make it your own.</h2><div class="controls" id="controls">${controls(current, "", true)}</div></aside></div><div class="section-head"><div><div class="section-kicker">Coherent hybrid recipes</div><h2>Start somewhere good.</h2></div></div><div class="cards">${[
      "hill-observatory",
      "orbital-cottage",
      "repair-garden",
    ]
      .map((id) => {
        const s = byStudy(id)!;
        return `<a class="card" href="#/mix/${id}"><div class="card-image">${image(preset(id), s.title)}</div><h3>${s.title}</h3><p>${s.hypothesis}</p></a>`;
      })
      .join(
        "",
      )}</div><div class="details-row"><section><h2>Your local collection.</h2><p>Saved only in this browser when storage is available. Reset preview keeps favourites. Export a recipe to move it elsewhere.</p><div id="favourites"></div><button class="button" data-command="clear">Clear all favourites</button></section><section class="import-area"><h2>A recipe to keep.</h2><div class="actions"><button class="button" data-command="export">Export JSON</button><label class="button">Choose JSON file<input type="file" id="import-file" accept="application/json,.json" class="sr-only"></label></div><label for="recipe-json" class="status-line">Or paste a version 1 recipe (maximum 8 KB).</label><textarea id="recipe-json" spellcheck="false" aria-label="Recipe JSON" placeholder="Paste an exported recipe…"></textarea><button class="button" data-command="import">Load recipe</button><p class="section-note">IDs, versions, enums, numbers, size and compatibility are validated. Invalid imports leave your scene intact.</p></section></div>`;
  openSpecimen("specimen", current);
  clock?.pause(manual);
  renderFavourites();
  document
    .getElementById("import-file")
    ?.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 8192) {
        notice("Recipe is larger than 8 KB.");
        return;
      }
      try {
        importRecipe(await file.text());
      } catch {
        notice("The file could not be read.");
      }
    });
}
function isCurated() {
  const p = preset(current.study);
  return [
    "study",
    "buddy",
    "palette",
    "fidelity",
    "technique",
    "month",
    "weather",
    "night",
  ].every((k) => current[k as keyof Recipe] === p[k as keyof Recipe]);
}
function renderFavourites() {
  const el = document.getElementById("favourites");
  if (el)
    el.innerHTML = favourites.length
      ? `<ul class="favourites-list">${favourites.map((r, i) => `<li><button class="button" data-load="${i}">${escape(byStudy(r.study)!.title)} · ${byBuddy(r.buddy).name}</button></li>`).join("")}</ul>`
      : '<p class="status-line">No recipes saved yet.</p>';
}
function notice(message: string) {
  const el = document.getElementById("notice");
  if (el) el.textContent = message;
}
function importRecipe(text: string) {
  try {
    const r = parseRecipe(text);
    current = r;
    updateView();
    notice(
      "Recipe loaded. Your current scene now matches the validated recipe.",
    );
  } catch (e) {
    notice((e as Error).message + " Current preview kept.");
  }
}
function comparePage(id?: string) {
  const base = byStudy(id ?? "")?.id ?? "autumn-bridge";
  current = { ...preset(base), technique: "procedural", action: "curious" };
  right = { ...current, technique: "atlas" };
  sync = true;
  main.innerHTML =
    heading(
      "A closer look",
      "Same small moment. A different method.",
      "Seed, clock, camera, action and seasonal inputs are synchronized. Technique and fidelity may deliberately differ. Turn sync off to explore independent settings.",
    ) +
    `<div class="actions"><label class="button"><input type="checkbox" id="sync" checked> Sync scene & action</label>${pauseButton()}<button class="button" data-command="compare-reset">Reset comparison</button></div><div class="compare-grid"><section class="compare-pane"><span class="eyebrow">A / FIRST SPECIMEN</span>${stage("compare-a")}<h2 id="label-a">${techniqueNames[current.technique]}</h2><div class="controls" id="controls-a">${controls(current, "a", false, true)}</div></section><section class="compare-pane"><span class="eyebrow">B / SECOND SPECIMEN</span>${stage("compare-b")}<h2 id="label-b">${techniqueNames[right.technique]}</h2><div class="controls" id="controls-b">${controls(right, "b", false, true)}</div></section></div><p id="compare-diff" class="compare-diff"></p>${motionStatus()}<div id="notice" class="notice" role="status"></div><p class="section-note">The camera and normalized anchors are fixed for a matched view. Both panes share one clock and one bounded animation loop. Pausing, reduced motion and hidden-tab behaviour apply to both. Unsynced panes may vary inputs while time stays shared.</p>`;
  openSpecimen("compare-a", current);
  openSpecimen("compare-b", right);
  clock?.pause(manual);
  updateDifference();
  document.getElementById("sync")?.addEventListener("change", (e) => {
    sync = (e.target as HTMLInputElement).checked;
    if (sync) copySync("a");
    updateView();
  });
}
function copySync(from: string) {
  const src = from === "b" ? right : current;
  const target = from === "b" ? current : right;
  const keys = [
    "study",
    "buddy",
    "palette",
    "month",
    "weather",
    "night",
    "action",
    "seed",
    "motion",
    "smooth",
  ] as const;
  for (const k of keys)
    (target as unknown as Record<string, unknown>)[k] = src[k];
}
function updateDifference() {
  const el = document.getElementById("compare-diff");
  if (el) {
    const differences = Object.keys(current).filter(
      (k) => current[k as keyof Recipe] !== right[k as keyof Recipe],
    );
    el.textContent = `${sync ? "Synchronized" : "Independent inputs"} · Shared clock and camera · Differences: ${differences.length ? differences.map((k) => `${k}: ${current[k as keyof Recipe]} / ${right[k as keyof Recipe]}`).join("; ") : "none"}`;
  }
}
function updateView() {
  const page = route(location.hash).page;
  if (page === "compare") {
    renderers[0]?.update(current);
    renderers[1]?.update(right);
    document.getElementById("controls-a")!.innerHTML = controls(
      current,
      "a",
      false,
      true,
    );
    document.getElementById("controls-b")!.innerHTML = controls(
      right,
      "b",
      false,
      true,
    );
    document.getElementById("label-a")!.textContent =
      techniqueNames[current.technique];
    document.getElementById("label-b")!.textContent =
      techniqueNames[right.technique];
    updateDifference();
  } else {
    renderers[0]?.update(current);
    const c = document.getElementById("controls");
    if (c) c.innerHTML = controls(current, "", page === "mix");
    const desc = document.getElementById("tech-description");
    if (desc) desc.textContent = techniqueDescriptions[current.technique];
    const h = document.getElementById("tech-heading");
    if (h) h.textContent = techniqueNames[current.technique];
    const m = document.getElementById("mix-kind");
    if (m)
      m.textContent = `${isCurated() ? "Curated preset" : "Experimental mix"} · Anchors and scale stay normalized. Incompatible choices are disabled with reasons.`;
    if (document.getElementById("atlas-host")) showAtlas();
  }
  clock?.pause(manual);
  refreshMotionStatus();
}
function render() {
  stop();
  const r = route(location.hash);
  document.querySelectorAll("nav a").forEach((a) => {
    if (a.getAttribute("href") === `#/${r.page}`)
      a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (r.page === "studies" && r.id) specimenPage(r.id);
  else if (r.page === "buddies") {
    current = {
      ...preset(r.id === "lumen" ? "hill-observatory" : "autumn-bridge"),
      buddy: buddies.find((b) => b.id === r.id)?.id ?? "sprig",
    };
    buddyPage(r.id);
  } else if (r.page === "techniques") {
    current = { ...preset(), action: "curious", technique: "procedural" };
    techniquesPage();
  } else if (r.page === "mix") mixerPage(r.id);
  else if (r.page === "compare") comparePage(r.id);
  else gallery();
  refreshMotionStatus();
  document.title = `Buddy · ${r.id ? (byStudy(r.id)?.title ?? titleCase(r.id)) : titleCase(r.page)}`;
}
main.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement,
    key = target.dataset.key;
  if (!key) return;
  const side = target.dataset.side;
  let r = { ...(side === "b" ? right : current) };
  const value =
    target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : ["seed", "month"].includes(key)
        ? Number(target.value)
        : target.value;
  if (key === "study") {
    r = preset(String(value));
  } else (r as unknown as Record<string, unknown>)[key] = value;
  try {
    r = parseRecipe(JSON.stringify(r));
  } catch (err) {
    notice((err as Error).message);
    updateView();
    return;
  }
  if (side === "b") right = r;
  else current = r;
  if (route(location.hash).page === "compare" && sync) copySync(side ?? "a");
  updateView();
  // Keep keyboard focus on the replaced control.
  main
    .querySelector<HTMLElement>(
      `[data-key="${key}"][data-side="${side ?? ""}"]`,
    )
    ?.focus();
});
main.addEventListener("click", (e) => {
  const button = (e.target as HTMLElement).closest<HTMLElement>("button");
  if (!button) return;
  if (button.dataset.filter) {
    filter = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String((b as HTMLElement).dataset.filter === filter),
        ),
      );
    filterCards();
    return;
  }
  if (button.dataset.tech) {
    current.technique = button.dataset.tech as Technique;
    updateView();
    document
      .getElementById("tech-heading")
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
    return;
  }
  if (button.dataset.load !== undefined) {
    const r = favourites[Number(button.dataset.load)];
    if (r) {
      current = { ...r };
      updateView();
      notice("Favourite loaded.");
    }
    return;
  }
  switch (button.dataset.command) {
    case "pause":
      manual = !manual;
      clock?.pause(manual);
      main
        .querySelectorAll<HTMLButtonElement>("[data-command=pause]")
        .forEach((b) => {
          b.textContent = `${manual ? "Resume" : "Pause"} animation`;
          b.setAttribute("aria-pressed", String(manual));
        });
      const status = document.getElementById("motion-status");
      if (status)
        status.textContent = clock?.isReduced
          ? "Reduced motion: composed still."
          : manual
            ? "Animation paused."
            : "Animation running · mocked weather.";
      break;
    case "reset":
      current = preset(current.study);
      manual = false;
      clock?.reset();
      updateView();
      main
        .querySelectorAll<HTMLButtonElement>("[data-command=pause]")
        .forEach((b) => {
          b.textContent = "Pause animation";
          b.setAttribute("aria-pressed", "false");
        });
      notice("Preview reset. Favourites kept.");
      break;
    case "compare-reset":
      current = {
        ...preset(current.study),
        technique: "procedural",
        action: "curious",
      };
      right = { ...current, technique: "atlas" };
      sync = true;
      manual = false;
      (document.getElementById("sync") as HTMLInputElement).checked = true;
      clock?.reset();
      updateView();
      main
        .querySelectorAll<HTMLButtonElement>("[data-command=pause]")
        .forEach((b) => {
          b.textContent = "Pause animation";
          b.setAttribute("aria-pressed", "false");
        });
      break;
    case "favourite":
      if (
        favourites.some((f) => JSON.stringify(f) === JSON.stringify(current))
      ) {
        notice("This recipe is already in your favourites.");
        break;
      }
      const next = [...favourites, { ...current }];
      const err = writeFavourites(storage, next);
      if (!err) {
        favourites = next;
        renderFavourites();
        notice("Recipe saved in this browser.");
      } else notice(err);
      break;
    case "clear": {
      const err = clearFavourites(storage);
      if (!err) {
        favourites = [];
        renderFavourites();
        notice("Favourites cleared. Your preview is unchanged.");
      } else notice(err);
      break;
    }
    case "atlas-export": {
      try {
        const a = makeAtlas(current);
        const link = document.createElement("a");
        link.href = a.canvas.toDataURL("image/png");
        link.download = `buddy-${current.buddy}-${current.fidelity}-atlas.png`;
        link.click();
        notice(
          "Original sprite atlas exported: five rows, bottom anchor (48,83).",
        );
      } catch {
        notice("Atlas export needs Canvas2D.");
      }
      break;
    }
    case "export": {
      const blob = new Blob([JSON.stringify(current, null, 2) + "\n"], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = `buddy-${current.study}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notice("Recipe exported.");
      break;
    }
    case "import":
      importRecipe(
        (document.getElementById("recipe-json") as HTMLTextAreaElement).value,
      );
      break;
  }
});
window.addEventListener("hashchange", () => {
  render();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});
matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
  "change",
  refreshMotionStatus,
);
window.addEventListener("pagehide", stop);
render();
// Read-only diagnostic snapshot used by reproducible lifecycle tests and measurements.
Object.defineProperty(window, "__buddyLab", {
  value: Object.freeze({
    snapshot: () => ({
      stats: { ...stats },
      time: clock?.time ?? 0,
      reduced: clock?.isReduced ?? false,
      manual,
      recipes: [
        { ...current },
        ...(route(location.hash).page === "compare" ? [{ ...right }] : []),
      ],
    }),
  }),
});
