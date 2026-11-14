# Buddy Design Lab — expanded implementation plan

Status: specification, not implemented software. Owner brief: 2026-11-14. Build a browsable library of original buddies and seasonal design studies, mixing pastoral anime warmth, optimistic sci-fi and hybrids. This expands/reorders the previous Slice A. Keep SEASONAL-BUILD-PLAN.md's technical, privacy, accessibility and evidence requirements. Inspect existing code first; extend rather than scaffold a competing app. Preserve studies/autumn and all provenance.

## Art direction
Hearth & Meadow: original expressive creatures, layered hills, domestic details, warm lamps, patient movement and seasonal nature. Studio Ghibli is a mood reference, not a source of franchise characters or copied shots.
Tomorrow Garden: optimistic anime science fiction; planted terraces, greenhouses, friendly machines, cream/teal/coral, lavender dusk and useful welcoming technology. Avoid default cyberpunk HUD clutter.
Quiet Orbit: coherent hybrids, such as a living observatory or greenhouse station. Match silhouette, scale, materials and lighting rather than randomly stacking effects.
Normal readable text and controls remain HTML. Present large specimens in a calm editorial gallery, not a giant settings dashboard.

## Six original buddies
Provisional names, not trademark-clearance claims:
- Sprig: asymmetrical sprout-headed seed courier with satchel and grounded gait; shelters seeds from rain.
- Ember: little kettle/lantern caretaker with handle/roof silhouette; tends a warm light.
- Pip: compact wind traveller with broad scarf/sail and short legs; braces into gusts.
- Sola: solar-garden tender with narrow body and broad collector crown; tilts toward sunlight.
- Mote: hovering maintenance courier with offset cargo ring and parcel/tool; inspects plants/connectors, not a generic glowing orb.
- Lumen: a living observatory/building with window gaze and dome posture, not spider-like robot legs; opens its roof to observe.
Give each a distinct black silhouette, proportion, palette and motivation. Implement five states: idle, curious, delighted, weather-react and rest, with stable still poses. Acting changes pose/timing, not only eyes. Use anticipation, sparse blinks and recovery rather than perpetual bouncing.
Deliver character sheets, palettes and original sprite/shape sources. Code-drawn placeholders are acceptable if identified honestly; polish focal characters. No image-generation service is assumed. Missing tools must not reduce delivery to prompts or fabricated assets.

## Twelve authored studies
Pastoral: autumn bridge courier; rainy tea shelter; blossom hillside path; winter window garden.
Utopian: solar greenhouse terrace; cloud-transit platform; night seed archive; rain-cooled garden station.
Hybrid: living hill observatory; orbital greenhouse cottage; wind-powered repair garden; moonlit seed-delivery dock.
Each needs a buddy, deliberate framing, depth, palette/light, technique, defining motion, default month/weather and a short design hypothesis. Not twelve palette swaps. Polish autumn bridge, rainy shelter, solar terrace and hill observatory first, then expand.
Cards disclose implemented/placeholder/experimental, technique, fidelity and rights status. No fake metrics or owner acceptance. Static rendered gallery thumbnails; animate only opened specimens.

## Four real technique specimens
T1 procedural Canvas2D: cached scenery, code-drawn foliage, dithering and bounded particles.
T2 sprite-atlas Canvas2D: original authored/generated atlas, anchors, clips and an inspectable frame/atlas view. Per-frame procedural drawing alone does not qualify.
T3 SVG/CSS cutout: original layered vector art and limited transforms. Label vector output honestly rather than claiming all edges are pixel art.
T4 hybrid: cached/static environment, sprite buddy and separately bounded weather coordinated by one lifecycle.
All four must run and pause/stop/dispose. Compare the same buddy/action in at least three under matched framing. WebGL/shaders are optional stretch work only after core completion, with fallback; no Three.js merely to inflate technique count.

## Three meaningful fidelity levels
F1 sketch: approximately 160x90, limited palette, broad silhouette, 2–4 pose frames.
F2 crafted pixel: approximately 320x180, deliberate clusters/ramps, added form/detail, 6–8 frames.
F3 rich pixel/cutout: approximately 480x270, authored materials, purposeful layers, light detail and expressive acting.
Dimensions are initial budgets; atlas cells differ from scene dimensions. Deliver two complete F1/F2/F3 triptychs, one pastoral and one sci-fi, with matched framing. Upscaling, more particles or hue shifts alone are not higher fidelity. Separate pose sampling from scene refresh; offer a matched stepped/smooth experiment without claiming frame rate automatically creates hand-drawn animation.

## Shared seasonal/weather engine
Reuse twelve structural monthly states and eight mocked categories: clear, cloudy, fog, rain, snow, mixed, storm, unknown. Calendar controls vegetation/form; weather independently controls atmosphere. Northern-temperate illustration profile is explicit, not inferred local ecology.
Full seasonal variation is required in the reference landscape and two anchor environments. Other studies declare supported dimensions/fixed art; disable controls that would do nothing. Do not require bespoke monthly redraws for every study or pretend every Cartesian combination was visually reviewed.
Test 96 month/weather domain combinations separately from representative visual coverage. No live APIs, location prompts or IP lookup.

## Reusable local library and mixer
Use typed local catalogues for buddies, worlds, palettes, effects, renderers, clips and presets, plus shared clock, seed, lifecycle and pure scene derivation. Not a published monorepo, executable plugin ecosystem or game engine.
Manifests include ID/title/tags, technique/fidelity, anchors/dimensions, compatibility, supported states/month/weather, provenance and status. No arbitrary remote code/assets or raw imported HTML.
Mixer: buddy, environment, palette/art direction, available fidelity, month/weather, day/night, pose/action, motion and deterministic seed. Separate curated presets from experimental mixes. Disable incompatible choices with reasons and provide honest fallback. Normalize scale/anchors/perspective without stretching characters. Palette roles/ramps should match materials, not indiscriminately rotate hue. Include a few coherent hybrid recipes and explain them.
Local favourites and JSON recipe export/import need version, size/ID/enum/numeric validation, graceful denied/corrupt storage and explicit clear favourites. Invalid import leaves the current scene intact. Reset preview does not delete favourites. No accounts/backend or executable recipe fields.

## Browsing and comparison
Provide equivalents of /studies, /buddies, /techniques, /mix and /compare, using simple hash routing if appropriate. Validate deep links and support hosting base paths. Root opens an interesting anchor and explains exploration.
Two-pane comparison synchronizes seed, clock, month/weather, action and camera unless deliberately varied; expose differences and a sync toggle/reset. Side-by-side desktop, stacked mobile. Static deterministic thumbnails and lazy disposal; maximum two active specimen renderers, not an animated canvas per gallery card.
One lifecycle across canvas/CSS/SVG. Pause, hidden tabs and reduced motion must stop all relevant animation. Returning to a tab must not override manual pause. Stable composed still, keyboard labels/focus, portrait/zoom, readable HTML, no-JS/canvas fallback, no flashing/audio required.

## Research and provenance
Inspect PIXEL-ART-SOURCES.md and the pinned library-ui donor. Research candidates include ernkerr/falling-leaves, patch-gg/pixelfx, cahilfoley/react-snowfall, qtqz/natural-falling-effect and minhquocdk/pixel-live-wallpaper; candidates are not approved dependencies or licence findings. Shader/jQuery references are optional comparisons.
For each used source record URL, pinned revision, code/assets copied, licence/asset terms, attribution and changes. Do not treat public visibility as permission. Individually verify downloaded asset rights, including OpenGameArt/itch.io. External mood images are not bundled art. Reject uncertain assets and implement an original equivalent. Never auto-run donor skills, remote shell pipes or arbitrary scripts. Do not install every library.
Canvas caching reference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
Reduced motion reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
References are guidance, not measured performance proof.

## Finite unattended work order
DL0 inspect instructions/code/git status, record baseline and branch, run available checks.
DL1 runnable gallery shell, shared contracts/seed/clock, first rendered autumn study.
DL2 four polished anchor studies before catalogue volume.
DL3 complete six buddies/five states, four technique specimens, inspectable atlas and two fidelity triptychs.
DL4 complete twelve composed studies and supported seasonal/weather integration.
DL5 bounded mixer, synchronized comparison, validated favourites/recipes, real thumbnails.
DL6 verification, contact sheets, performance measurement, provenance and final polish.
Checkpoint after runnable milestones. Continue ordinary reversible implementation/testing without owner replies. Missing nonessential assets/tools get original local alternatives and documented limitations. Skip paid/secret/deployment/destructive branches rather than expanding authorization. No endless optimization or guessed promise of completion within hours. If session/context ends, preserve the best runnable subset, name incomplete deliverables and provide exact continuation steps. No duplicate-card padding or false completion.

## Evidence and final handoff
Unit tests: unique manifests/references, compatibility/state transitions, deterministic derivation/seed, 96 combinations, bounds/unknowns, recipe validation and storage failures.
Browser tests: every study opens, all character/state controls, four techniques, compare sync, invalid mixes/imports, console errors, keyboard/mobile/zoom, live reduced motion, pause/visibility/dispose/reinitialize and zero third-party runtime requests.
Real artifacts: gallery overview, six character sheets, twelve-study contact sheet, two fidelity triptychs, same-action technique strip, selected light/weather comparisons and portrait/detail/mixer captures. Use real renders, not fabricated screenshots. If capture is unavailable, state that and give reproducible commands.
Measure named environment, canvas dimensions, renderer/particle counts, asset/bundle size and steady-state timing. No fabricated FPS or universal mobile claims. Avoid gallery-sized ongoing animation and unbounded per-frame allocations.
Maintain BUILD-STATUS.md, DESIGN-DECISIONS.md and SOURCE-MANIFEST.md with proposed/implemented/executed/visually-reviewed distinctions. Commit lockfile, document clean install/dev/build/typecheck/unit/browser commands and actual results. Provide branch/PR, exploration route map, artifacts, limitations, three strongest studies and two practical techniques with reasons. No owner approval claims.
No live weather, location, paid services, telemetry, credential/infrastructure changes, production deployment or automatic merge. Existing-site integration and live weather remain later approved milestones.
