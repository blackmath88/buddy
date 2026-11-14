# Buddy Design Lab

A runnable local gallery of six original companions, twelve illustrated studies and four rendering methods. Readable HTML surrounds code-drawn scenery. No accounts, live weather, location, telemetry, runtime services or external fonts.

## Run

Node 22.12+ (verified with Node 24.22.1) and npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For production output: `npm run build`, then `npm run preview`. Output in `dist/` includes the preserved `studies/autumn/` reference and documentation. Hash routes and relative assets support a hosting base path.

## Explore

- `#/studies`: gallery and featured autumn bridge; `#/studies/autumn-bridge` opens controls.
- `#/buddies`: six character/palette/action sheets; `#/buddies/lumen` opens a companion.
- `#/techniques`: four executable renderers, atlas/frame inspector, two fidelity triptychs.
- `#/mix`: constrained local mixer, favourites, recipe JSON interchange and atlas PNG export.
- `#/compare`: two synchronized specimens; technique/fidelity can deliberately differ.
- `studies/autumn/index.html`: unchanged historical donor-derived study, separate provenance.

Three studies have twelve-month structural variation: the bridge reference landscape, tea shelter and solar terrace. Other studies disclose fixed seasonal art and disable month selection. Weather is always mocked. Unsupported weather, incompatible Lumen placements and orbital palettes are disabled with explanations.

## Verify and capture

```sh
npm run typecheck
npm test
npm run build
# On a normal development machine, install the test browser once:
npx playwright install chromium
npm run test:browser
# Test the built app mounted at /buddy/ instead of the dev server:
LAB_PRODUCTION=1 npm run test:browser
npm run capture
# Optional contact-sheet composition; Python with Pillow required:
python3 scripts/contact-sheets.py
```

In this managed Linux environment, the browser was already installed; use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` before browser commands. The test harness starts and stops its own local server. `LAB_URL` can instead target an existing local test server, with a trailing slash if mounted under a path. `LAB_PRODUCTION=1 npm run capture` captures the built app.

**Observed:** clean install, typecheck, 126 unit tests and 8 browser scenarios pass, including the production `/buddy/` mount. See [BUILD-STATUS](docs/BUILD-STATUS.md) for scope and verification limits, [real captures](artifacts/), [design decisions](docs/DESIGN-DECISIONS.md) and [provenance](docs/SOURCE-MANIFEST.md).

This is an illustrated implementation prototype, not professional commissioned pixel art or owner-accepted artwork. Canvas methods rasterize original local shapes; SVG cutout stays vector. No deployment or merge has been performed. The historical research-IDE imports remain in [docs/research](docs/research/).
