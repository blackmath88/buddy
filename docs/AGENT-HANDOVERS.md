# Buddy agent handovers

These prompts work for Claude Code or ChatGPT/Codex with repository/code execution access. They specify deliverables, not model-specific APIs. Paste the relevant prompt into the coding agent; no agent is launched by this document.

## 1. First implementation: deliver Slice A
```text
Repository: https://github.com/blackmath88/buddy

Build the seasonal pixel-art website playground, not another concept document.

Read repository instructions if present, then:
- START-HERE.md
- docs/SEASONAL-BUILD-PLAN.md
- docs/SEASONAL-WEBSITE-CONCEPT.md
- docs/PIXEL-ART-SOURCES.md
- studies/autumn/index.html, palette.css and scene.js

Current direction: a small website with ordinary readable HTML text and ornamental pixel-art scenery. Twelve calendar-month states and weather are independent inputs. Older docs/research is historical material, NOT a mandate to build an IDE.

Work on a new feature branch from current main. Inspect git status and preserve unrelated/uncommitted work. Record starting revision and baseline. Treat the imported autumn study as unverified reference code; run it before trusting it.

Implement Slice A (A0-A4) from the build plan end to end. Default to Vite + TypeScript + ordinary HTML/CSS if no app stack already exists. Use one package manager and a committed lockfile. Keep original study accessible and preserve source attribution. Do not import the entire donor monorepo.

Deliver:
1. Runnable dev/production setup.
2. Reusable renderer with initialize/update/pause/dispose lifecycle and one bounded animation loop.
3. All twelve authored monthly configurations, with structural differences, not merely hue changes. Start with January/April/July/October, then complete the other eight.
4. Independent mocked clear/cloudy/fog/rain/snow/mixed/storm/unknown weather; calendar remains intact.
5. Ordinary HTML content and accessible preview controls: month, weather, day/night, pause and reset. Clearly label simulated weather.
6. Responsive art framing, crisp pixel scale, high-contrast reading surface, reduced-motion/still and hidden-tab pausing.
7. Deterministic config tests, all 96 month/weather combinations, browser smoke, production build and actual screenshot artifacts/contact sheet.
8. docs/BUILD-STATUS.md with truthful implemented versus verified status and exact commands/results.

Use original/procedural placeholder art where necessary and state visual limitations. No unlicensed assets, external fonts by default, new tracking, live weather API, location request, accounts, backend, game framework, paid service or deployment in this slice. No merge. The missing existing-site URL does not block the standalone playground.

Do not spend the assignment rewriting the plan. Make reasonable reversible decisions, document them and ship a working slice. Execute actual checks. If tooling prevents a check, report that limitation, never invent success. Test pause/resume, visibility, live reduced-motion changes, resize, canvas failure and dispose/reinitialize.

Deliver a reviewable PR or branch and concise handoff: commits, run commands, working functionality, test results, real screenshots, visual limitations, remaining risks and next gate. Stop after Slice A for visual review before live APIs.
```

## 2. Continue with live weather (only after Slice A approval)
```text
Continue blackmath88/buddy with Slice B in docs/SEASONAL-BUILD-PLAN.md. First inspect current code, BUILD-STATUS and the accepted Slice A feedback. Do not re-scaffold.

Before integration, present/confirm the provider, deployment audience and applicable terms/attribution/privacy approach. If that approval is absent, stop at that gate, not at an invented technical blocker.

Once approved, implement disambiguated city search, an optional explicit one-shot Use my location flow, a validated weather adapter, freshness/cache/backoff, aborted/superseded request handling and clear HTML place/source/status. No surprise permission prompt, IP-geolocation vendor, continuous tracking or precise GPS persistence/logging. Location refusal and API failure must preserve the site.

Test malformed responses, request races, city changes, permissions/timeouts, stale/expired/offline states and selected-timezone month boundaries using deterministic mocks; separately report any real provider requests actually verified. Update BUILD-STATUS, provide evidence and a reviewable PR. No production deployment or automatic merge.
```

## 3. Independent review prompt
```text
Independently review the Buddy implementation branch/PR I provide. Read START-HERE, SEASONAL-BUILD-PLAN, SEASONAL-WEBSITE-CONCEPT and BUILD-STATUS, then inspect actual code. Do not accept the builder's test counts or screenshots as independent execution.

Check: ordinary readable HTML; twelve structurally distinct months; month/weather independence; honest preview/live labels; responsive art framing; deterministic state; unknown weather; animation lifecycle/leaks; pause/reduced-motion/hidden-tab behaviour; bounded work; no unauthorized location/network/tracking; source/asset provenance; fallback and tests. For Slice B also inspect privacy, API terms/attribution, request races and timestamp/timezone correctness.

Run relevant checks when possible. For every finding give severity, file/line, concrete reproduction or source-supported counterexample, user consequence and smallest repair. Distinguish independently reproduced, source-supported and unverified. Assess visual quality separately from type/test success.

Answer: ready for owner preview / ready with limitations / not ready. Identify the top three next repairs and any false completion claims. Do not edit, merge or deploy unless separately asked.
```

## 4. Existing-site integration prompt (when its URL/repository is supplied)
```text
Integrate the accepted Buddy scene into the existing site I provide. First inspect its instructions, framework, content, routes, artwork, hosting and privacy constraints. Read Buddy's concept/build plan and current verification record.

Propose the minimal wrapper and exact touched files; preserve the site's content, design identity and framework. Do not replace it with a demo or assume its place/landmark. Keep pixel art decorative, text normal HTML, weather optional and no-location/no-network fallback intact. Confirm the extraction/licence/asset boundary before copying.

Implement only the approved integration on a branch, run real checks, provide desktop/mobile artifacts and enumerate remaining release tasks. Never publish, change domains/hosting or merge without separate approval.
```
