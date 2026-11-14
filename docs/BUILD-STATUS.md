# Buddy Design Lab — executed build status

2026-11-14. Branch: **feat/design-lab**. Trusted starting revision: **142597b1ca10bf46c6505f1531c989bccff6e9d3**, clean checkout. First runnable checkpoint: **a94e0da**. Subsequent fixes/evidence are on branch HEAD. This is a working illustrated prototype, not owner-approved final artwork. No deployment or merge occurred.

## Implemented / executed / visually reviewed

| Milestone | Implemented | Executed evidence | Visual review |
| --- | --- | --- | --- |
| DL0 | Inspected root/docs, source plans, original autumn code and pinned donor hero; feature branch | No existing app scripts/tests at baseline; original reference captured unchanged | Original reference capture exists; no new rights clearance claim |
| DL1 | Vite/TypeScript app, typed catalogues, deterministic seed/config, shared lifecycle, autumn study | Typecheck/build, route and lifecycle checks | Gallery reviewed; fixed river placement of Sprig |
| DL2 | Four separately composed anchors: bridge, tea shelter, solar terrace, hill observatory | Each opens in browser; captured separately | All four reviewed on contact sheet; original code-drawn art, further material polish desirable |
| DL3 | Six buddies × five states; T1/T2/T3/T4; original 96×96-cell atlas/PNG export; two F1/F2/F3 triptychs | All 30 buddy/action selections and four technique controls exercised; atlas dimensions asserted | Character sheets and technique/fidelity artifacts captured; representative sheets/strip reviewed, not every animation frame |
| DL4 | Twelve distinct environments; twelve-month structural bridge reference plus shelter/terrace; mocked weather support labels | 96 month/weather domain tests; every study opens | Twelve-study contact sheet reviewed; representative seasonal/light/weather captures, not every Cartesian combination |
| DL5 | Constrained mixer, normalized anchors, compare sync/differences, favourites, strict recipe import/export | Sync/reset, imports, denied storage, export, reset/clear favourites, incompatible controls tested | Mixer portrait and desktop captures reviewed |
| DL6 | Captures, contact sheets, tests, measured timing/build size, source manifest and handoff | Commands/results below; self-review only | Fixed double-scaled low-fidelity thumbnails, misplaced buddy, missing arrow glyphs; further aesthetic review remains with owner |

**Preservation:** no changes to `studies/autumn/` or historical research. The Lab is the only new root app. The original reference is copied into `dist/studies/autumn/` with its provenance unchanged.

## Actual commands and results

Environment: managed Linux container, Node **24.22.1**, npm **11.9.0**, TypeScript **5.9.3**, Vite **7.2.2**, Playwright Test **1.56.1**, installed headless Chromium **156.0.8078.79**. Python/Pillow **13.0.0** composes actual screenshots.

```sh
npm ci --cache /workspace/work/npm-cache       # clean install passed
npm run typecheck                            # passed
npm test                                     # 126 passed (96 are month/weather domain cases)
npm run build                                # passed; typecheck + Vite + reference/docs copy
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
# Development-server suite passed (8 scenarios before final cosmetic/fallback refinements).
LAB_PRODUCTION=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
# Final production-output suite passed: 8 scenarios, 22.6 s; mounted at /buddy/.
python3 scripts/contact-sheets.py             # composed real captures
npm run measure                              # exact file and gzip bytes recorded
```

Browser scenarios cover all study routes, six buddies/five actions, all four techniques, atlas resolution, comparison inputs/reset, pause/visibility/live reduced motion, disposal/reinitialization via route changes, atomic invalid imports, valid imports and download, favourites persistence/reset/clear, denied storage, disabled incompatibilities, portrait stacking, keyboard focus, CSS 200% zoom approximation, no-JS and Canvas2D failure/recovery to SVG. Console exceptions are asserted absent in the primary flows; zero third-party HTTP runtime requests are asserted while exploring all app routes. Corrupt storage is exercised in unit tests; denial is also exercised in browser tests.

Initial failures were repaired before the final pass: npm's default home cache was unwritable (workspace cache used), Vitest initially collected Playwright tests (unit path scoped), an async media change needed event polling, and disabled-option assertions needed the actual DOM attribute. Self-review found and fixed a separate Canvas-failure control-update defect; its regression now exercises recovery into SVG. No hidden/skipped test count is represented as passing.

The managed Sites preview relay failed to initialize and no `cua_repl.js` route is available. There is no interactive preview URL to claim. The owner's requested repository browser tests and captures instead ran in the self-contained Playwright harness using installed Chromium and a test-owned server. No production service was published.

## Real artifacts

- [Gallery overview](../artifacts/gallery.png)
- [Twelve-study contact sheet](../artifacts/study-contact-sheet.png), [individual rendered studies](../artifacts/studies/)
- [Six character sheets](../artifacts/buddies/) and [six original sprite-atlas PNGs](../artifacts/atlases/)
- [Pastoral triptych](../artifacts/fidelity-pastoral.png), [sci-fi triptych](../artifacts/fidelity-scifi.png)
- [Matched Sprig/curious technique strip](../artifacts/technique-strip.png), [individual methods](../artifacts/techniques/)
- [Spring mixed](../artifacts/spring-mixed.png), [winter snow](../artifacts/winter-snow.png), [autumn rain at night](../artifacts/autumn-rain-night.png)
- [Mixer](../artifacts/mixer.png), [portrait](../artifacts/portrait.png), [comparison](../artifacts/comparison.png)
- [Unchanged historical autumn reference](../artifacts/original-autumn-reference.png)
- [Browser report](../artifacts/browser-results.json), [timing](../artifacts/performance.json), [bundle sizes](../artifacts/build-size.json)

These are actual browser renders, not image-generator mock screenshots. Contact sheets only resize/label those captures. Unit-domain coverage does not imply 96 manually reviewed visual combinations.

## Measurements and limits

The active comparison measurement uses two **480×270** canvases, Sprig/curious in procedural and atlas methods, **16 bounded leaf elements per pane**, one shared RAF clock, seed 2187, viewport **1440×1000**, DPR **1**. After discarding five warm-up samples, **115** browser-frame intervals were recorded; see raw JSON for median/p95/max and exact start/end draw counts. The harness asserts rendering actually advanced by over 100 draws and was not manually paused. A previous paused sampling attempt was discarded and replaced. These are container/browser scheduling observations, not isolated CPU draw cost, battery results or universal mobile FPS.

The upper weather budget is **64 elements per specimen** (storm). Raw atlas size is **768×480** RGBA at F2/F3 (about 1.47 MB per active atlas) or **288×480** at F1, plus cached scene surfaces. There is no unbounded particle spawning; geometry/path allocations remain bounded per frame. The thumbnail cache is capped and card canvases do not animate. Exact built app and gzip sizes are in build-size.json; the app has **zero runtime package dependencies** and original artwork is generated locally. Test images/documentation/reference files are not initial-load app assets.

No independent review route meeting isolated/read-only/supervised requirements was available. Review here means **coordinator self-review**, source inspection, actual tests and representative image inspection. No claim of owner approval, full screen-reader audit, all-frame inspection, cross-browser certification, physical-device performance, every-DPR testing or full browser-menu 200% zoom testing is made.

## Remaining work / continuation

The functional core is implemented; artistic finish remains an explicit prototype limitation. Code-rasterized vectors are not expert hand-authored pixel clusters. Secondary worlds need richer materials/lighting, more purposeful designed in-betweens and stronger per-character acting; atlas smooth mode currently crossfades. No commissioned/generative assets are silently substituted.

Recommended next sequence:
1. Review `#/studies/autumn-bridge`, `rainy-shelter`, `solar-terrace` and `hill-observatory`, then the contact sheet. Record concrete art feedback without treating green tests as aesthetic acceptance.
2. Refine original shapes/ramps and atlas in-betweens in `src/art.ts`; preserve anchors and supported-state contracts. Expand browser visual regression assertions from accepted renders.
3. Run physical-device, browser-menu zoom, screen-reader and additional-browser checks. Measure renderer CPU/heap separately if optimizing; current timing is RAF scheduling only.
4. If later approved, separately clear original donor redistribution terms, integrate the actual existing website and select live-weather/privacy/hosting policies. None of those gates is bypassed by this branch.

Three strongest current studies and two practical techniques, with reasons, are recorded in [DESIGN-DECISIONS](DESIGN-DECISIONS.md). Exact exploration routes and clean run commands are in [README](../README.md). No agent or monitor continues running after this session.
