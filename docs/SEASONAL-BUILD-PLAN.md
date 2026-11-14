# Buddy: executable seasonal website build plan

Date: 2026-11-13. Status: proposed implementation specification; no milestones executed by this documentation commit. Read START-HERE.md, SEASONAL-WEBSITE-CONCEPT.md and PIXEL-ART-SOURCES.md first. This expands the concept's P0-P5 into reviewable deliverables; where sequencing differs, this plan governs the next implementation assignment. Historical docs/research describes a different research-IDE thread, not Buddy's current feature backlog.

## 1. Outcome and non-goals
Deliver a small website with readable ordinary HTML content over ornamental pixel-art scenery. Twelve authored monthly states determine landscape form; independently selected/current weather determines atmosphere. A usable site must not depend on canvas, motion, location permission or a successful provider request.

Not in scope: an IDE, accounts, database, AI chat, remote retrieval, game simulation, arbitrary docking, geographically accurate generated cities, global biome inference, continuous location tracking or automatic deployment. Do not import the library-ui gallery/monorepo to display one scene.

## 2. Starting evidence and authority
Known baseline: 35bd3c88d5c0ab79a198c30ab1a8859a92e87f72, with studies/autumn/{index.html,palette.css,scene.js}. This is an adapted study, not runtime-validated production code. Reinspect current main and any local work before editing; subsequent commits may supersede these observations.

Work on a feature branch. Preserve original studies, attribution, historical docs, owner data and unrelated changes. Ordinary package installation, local synthetic-data tests and application edits belong to the implementation assignment when the owner gives it to the agent. This plan alone authorizes no execution. Ask before destructive changes, paid services, credential/infrastructure changes, deployment, new tracking, commercial asset purchases or migration of an existing website. Never merge automatically.

The missing existing-site URL is a blocker only for final integration, not for building the isolated playground. Record other non-critical unknowns and proceed with documented reversible defaults.

## 3. Proposed implementation structure
Default for this standalone slice: Vite + TypeScript + HTML/CSS; no React requirement. If the actual target already uses a framework, adapt the engine through a small wrapper instead of rewriting that site. Inspect package manager/lockfiles first and use one.

Suggested structure, not a rigid framework:
```text
index.html
src/
  main.ts
  styles.css
  scene/
    types.ts
    months.ts
    derive-scene.ts
    renderer.ts
    sprites.ts
    layers.ts
  weather/
    fixtures.ts
    normalize.ts
    provider.ts             # Slice B only
  location/
    search.ts               # Slice B only
    resolve.ts              # Slice B only
  ui/
    preview-controls.ts
    weather-status.ts
    preferences.ts
public/art/                 # only cleared/original assets
test/
e2e/
docs/BUILD-STATUS.md         # created/maintained by implementation agent
```

Keep rendering independent of DOM controls, fetching and framework state. Do not fetch from an animation callback or add a global state package without demonstrated need.

## 4. Contracts and invariants
Define validated types for:
- Month: integer 1-12; invalid input falls back explicitly.
- IllustrationProfile: northern-temperate initially; not inferred local vegetation.
- WeatherKind: clear, cloudy, fog, rain, snow, mixed, storm, unknown.
- WeatherInput: kind, normalized intensity/cloud/wind, direction if known, isDay if known, source/provider time, freshness and mode fixture/live.
- Location: source default/search/geolocation, display label, coarse coordinates, IANA timezone if resolved. No assumption that browser timezone identifies a city.
- SceneConfig: sky/light, canopy/buds/blossoms, ground/litter, ambient species, precipitation, bounded wind and motion flag.

Pure deriveScene(month, profile, weather, preferences) returns deterministic serializable configuration. Clock, randomness and transport are injected; renderer does not decide the month or permission policy. Seed randomness for reproducible screenshots. Never use frame count as elapsed time.

Rules: weather cannot replace monthly tree/ground state; precipitation does not prove accumulated snow; autumn leaves are gated by calendar/profile; fog changes distant layers, not text; storm never requires flashes; unknown weather stays neutral. Clamp non-finite/out-of-range values and explicitly handle missing data.

Use selected-place timezone for actual month/day boundaries after resolution, including rollover and daylight-saving cases. Before that use a documented default/local display policy. Preview overrides remain clearly labelled and cannot silently persist as live state. Normalize wind units/direction once; a decorative scene is not a navigation/weather safety instrument.

## 5. Slice A — running scene playground, no live APIs
### A0: inventory and baseline
Read instructions in the checkout. Record git status, starting commit, actual files, package environment and existing script results. Open the autumn study in a real browser; capture desktop and portrait baseline if tooling allows. If tooling is unavailable, state it rather than fabricate success. Inspect current renderer for canvas failure, loop lifecycle, resize behaviour and source-attribution issues.

Deliver: concise baseline in BUILD-STATUS.md, feature branch and runnable dev setup with pinned lockfile. Keep study URLs working.

### A1: isolate and stabilize rendering
Extract the reusable renderer without a large redesign. API: initialize(container, config, seed), update(config), pause/resume, dispose. One active loop; dispose removes listeners and cancels work. Prefer cached static scene layers and precomputed sprite frames; rebuild only for relevant configuration/size changes. Support a composed still.

Choose a documented stable logical grid (proposal: 480x270 landscape) and aspect-preserving crop/scale. Determine portrait safe zones: landmark and meaningful tree changes must not be cut off. Do not stretch each axis independently or multiply internal pixels by DPR until pixel art becomes smooth. Use integer placement/nearest-neighbour and test actual rotation edges. One responsive design may reposition foreground layers intentionally.

Use a capped particle pool, elapsed-time integration, bounded delta after backgrounding and no hidden-tab animation. Reduced-motion reacts while open; manual pause is independent from tab visibility. Do not automatically resume a manually paused scene when a tab returns. Network and animation lifecycles are separate.

Deliver: stable autumn renderer and ordinary HTML content card/navigation placeholder clearly labelled as sample copy. No external fonts required.

### A2: author all twelve months
Implement months.ts as twelve explicit configurations using the concept's month table. Change forms, not only hue: canopy density/leaf sizes, bare branch visibility, buds/blossoms, ground vegetation/litter and seasonal ornaments. Keep stable scene identity. Do not draw the content into canvas.

Art progression: first make January, April, July, October convincing, then complete intermediate months. This is a working sequence, not permission to ship only four. Use original/procedural placeholder sprites with explicit limitations; do not silently download unknown assets.

Deliver: month contact sheet, per-month notes and at least one distinguishing structural feature for every month. Owner reviews aesthetic quality; automated green checks do not constitute visual approval.

### A3: independent mocked weather
Create fixed fixtures for every WeatherKind. Implement clouds/light, distant fog, rain streaks, snow flakes, mixed precipitation and storm atmosphere without flashing. Wind direction/strength affects bounded particles consistently. Not every weather condition needs a separate engine or library. Reuse current particle code when useful; add a dependency only for a measured gap and inspect its rights/API.

Deliver: all 12 x 8 = 96 month/weather configuration combinations exercised through tests. Include a visible unknown-weather case. Test selected edge cases visually; do not claim every combination was manually reviewed.

### A4: usable preview page and verification
Controls: month, weather fixture, day/night, pause, reset preview. Controls are accessible HTML in a compact development drawer; keyboard operable with labels and visible focus. Preview mode is persistent on-screen text, not only a console note. Default opening can use current month and an explicitly mocked condition; it must not claim detected weather/location.

Test content with long heading, long body and small viewport. Reading panel remains opaque/stable, unaffected by scene contrast. Decorative canvas aria-hidden and pointer-events:none. Content, links and fallback explanation remain useful without JavaScript/canvas; disable or hide nonfunctional controls honestly.

Acceptance checks: strict typecheck, production build, unit tests, browser smoke. Pin Vitest/Playwright if chosen; install browser runtime in CI and preserve artifacts. Test 360x800, 768x1024, 1440x900 and ultrawide plus 200% zoom and relevant DPR variation. These are target checks, not executed results.

Capture seeded screenshots: four anchor months in day/night; autumn rain; winter snow; spring mixed precipitation; fog; portrait; paused/reduced motion. Generate a compact contact sheet for all months if tooling supports it. Use actual renders, never mock screenshots.

Measure on a named real/emulated environment: load/assets, frame timing over a repeatable interval, backing-store dimensions, particle count and hidden-tab/paused activity. Targets: no scene-related long tasks during steady state; zero continuing animation loop while paused/hidden; no per-frame allocations/network requests that scale unboundedly. Do not make universal mobile FPS guarantees from desktop results.

Slice A exit: twelve month states, independent weather fixtures, normal readable content, responsive functioning controls, no third-party runtime network calls, repeatable tests and truthful evidence. Deliver code and reviewable PR; stop for visual review before live APIs.

## 6. Slice B — selected location and actual weather
Entry gate: owner accepts Slice A and approves provider/audience/terms/privacy approach. Candidate Open-Meteo is not automatic permission for every commercial use. Recheck documentation, attribution, request limits and key handling. Use a server adapter only if justified; never embed a secret.

B1: city search with debouncing, minimum query handling, loading/empty/error states, escaped text rendering and disambiguated city/region/country results. Abort old requests, also reject stale responses by request identity. Validate coordinates, timezone and provider payload before use. Changing place must not briefly label old weather as the new city's weather.

B2: explicit one-shot browser geolocation after a plain-language purpose notice. No initial permission prompt, continuous watch, silent IP service or exact-coordinate persistence. Round before provider transport according to documented precision. Permission denial/timeout/insecure context/unavailable API preserve city search. Explain recipient; coarse location is still location data. Never log raw coordinates or put them in URLs/history/analytics.

B3: provider adapter maps weather codes/units into tested domain fixtures; preserve provider and received timestamps separately. Show source, place and fresh/stale/unavailable status in HTML. Proposal: refresh about 15 minutes while visible with backoff, deduplicate requests, honor provider limits. Define stale and expired thresholds explicitly; two-hour neutral fallback is a proposed default, not universal meteorological validity.

B4: remember selected city only with explicit opt-in. Validate versioned stored preferences, survive denied/corrupt storage and provide forget/reset. Do not store precise GPS or a historical trail. Cache coarse-location weather in memory by default; persistent caching requires an explicit privacy choice.

Test: city changes during requests, ambiguous names, all provider categories, malformed/partial responses, API outage, slow network, rate limit, no timezone, rejected geolocation, clock/timezone boundaries, hidden-tab return, stale/expired results and revoked/cleared preference. Default remains a labelled example/neutral state, not a fabricated detection.

Slice B exit: real requests verified locally, terms/attribution recorded, no misleading live labels, fallback works, privacy and race tests pass, no production deployment.

## 7. Slice C — integrate the existing website
Wait for the actual site/repo/artwork. Audit framework, content, fonts, routes, asset licences, CSP, hosting and existing network/privacy behaviour. Preserve application identity and content. Keep scene engine importable; adapt through one wrapper, not a re-scaffold.

Confirm whether artwork depicts New England, Basel, a fictional landscape or another place. Weather location does not imply architectural/geographic accuracy. Mark sample copy and remove it before publication. Check real page content, forms, navigation, mobile safe zones, static fallback, keyboard/screen reader and loading behaviour.

Release review includes asset rights, dependency notices, weather attribution, privacy notice, page metadata and measured performance. Any production publish, domain or hosting configuration requires separate explicit authorization; never enable auto-deploy just to obtain a green result.

## 8. Testing and evidence checklist
Unit: month bounds, twelve structural configs, 96 month/weather combinations, unknown inputs, wind normalization/clamps, deterministic seed/config, date/timezone rollover and fixture/live separation.

Browser: each control updates the scene/status; no content pixelation; focus/labels; pause/visibility lifecycle; live reduced motion; resize/crop; failed canvas; no-JS fallback; console errors; network assertion forbidding third-party calls in Slice A. Test initialize/dispose/reinitialize to detect leaked listeners/loops.

CI: clean install from lockfile, typecheck, unit, production build, focused browser checks with artifacts. Accessibility automation is a partial check, not a screen-reader audit. Record manual coverage separately. Screenshots cannot prove motion, network or timing guarantees.

## 9. Build status and handoff format
Create docs/BUILD-STATUS.md with milestones marked not started / in progress / implemented / verified / blocked. Link code and evidence, distinguish proposed checks from run checks, note starting/ending commits and environment. No invented pass counts, screenshots or provider success.

Each PR includes summary, scope/not-in-scope, files, commands/results, screenshots/contact sheet, source/asset changes, remaining risks and review gate. Suggested PRs: A0-A1 renderer foundation; A2-A3 monthly/weather engine; A4 polished playground/testing; B location/weather; C integration. Keep intermediate app runnable.

Final handoff: what works, how to run, what was tested, actual artifacts, limitations, next task and approvals. No estimates masquerading as commitments. No need to ask for approval between ordinary substeps within the explicitly assigned Slice A; stop for blockers, scope expansion or the end-of-slice gate.
