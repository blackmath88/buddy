# Website Buddy — a companion for bridge-work.ai

**Status: concept only. Nothing is built, no art is approved, no palette is chosen.**
Assembled 2026-11-12 from a design conversation. Weekend-project scope by the owner's
explicit framing. This document exists so the work can be resumed without reconstructing
the reasoning.

## 1. What this is

A small companion character living on the bridge-work.ai website, rendered as
**square-grid pixel art**. It descends from the `e` companion built for Commons in
`blackmath88/baselhack26-open-presence`, but targets a different host, a different
brand and a different visual register.

## 2. Naming collision — unresolved

This repository currently holds research material for **Buddy the research/learning
environment** (Cyber December lineage, see `docs/research/CONTEXT.md`). The website
companion described here is **not established to be the same product**. They share a
name and nothing else that has been verified.

`docs/research/BUILD-PLAN.md` BUDDY-0 asks whether Buddy is a research home, a reusable
workspace extraction or a separate application. **This document does not answer BUDDY-0.**
Deciding that the website companion owns the name is a product decision that has not been
made. Until it is, treat these as two concepts filed in one repository.

## 3. What already exists, and what it actually is

In `baselhack26-open-presence`:

| Artefact | Status |
| --- | --- |
| `apps/commons/src/components/EPixelSprite.tsx` | Exists, merged in #39 |
| `apps/commons/src/components/e-behaviour.ts` | Pure reducer, tested |
| `docs/plans/E-PIXEL-COMPANION-V2.md` | Slice A implemented; Slices B and C proposed only |

**`EPixelSprite` is not pixel art.** Read at commit of 2026-11-12: it is smooth bezier
vector — `<ellipse rx="9" ry="7">` eyes, quadratic `Q` curve paths, anti-aliased edges.
The name is a holdover. The character is the Adobe-derived lowercase *e* ("Adobe →
a dope e"), with the Towelie personality brief, a backwards cap and a smoke opening.

This is not a problem to fix — `E-PIXEL-COMPANION-V2.md` already anticipated it:

> Original sprite atlas can replace SVG poses after an approved art contact sheet.

The present concept is that anticipated replacement, redirected to a new host and a
new visual register. The existing behaviour reducer is the reusable part; the art is not.

## 4. Visual direction — the square-pixel register

The owner's brief is pixel art in the idiom associated with Mistral's brand graphics.
Stated as buildable construction rules, independent of any company's marks:

1. Coarse square grid. Every cell is a filled square; the grid is visible, not implied.
2. **No anti-aliasing.** No sub-pixel edges, no soft shadows, no blur.
3. **No outline strokes.** Form is read from colour change between cells only.
4. Colour arrives as an **ordered ramp** — light to deep across a fixed number of steps.
   Forms are built from stepped bands of that ramp, not from arbitrary per-cell colour.
5. Diagonals are hard staircases. Curvature is quantized, never drawn.
6. Fixed small palette per sprite. A sprite that needs a sixth colour is too detailed.

### Boundary — original artwork only

`.observstory/proposals/e-pixel-companion-v2-20261101.json` already carries this condition
and it carries forward unchanged:

> Original artwork only; no copying Mistral, Adobe, Clippy or other proprietary sprites.

The rules above describe a **general visual idiom**. Mistral's flame mark, wordmark and
specific sprites are their trademarks and are not to be reproduced, traced or approximated.
The same applies to the Adobe wordmark that the original `e` was derived from — that
derivation is an existing risk in `open-presence`, not something to extend here.

## 5. Two quantization grammars — proposed split

Separate bridge-work design work (2026-11-12) produced an identity field built from
**filled discs on a hex lattice**, where curvature emerges from disc placement. That
study lives outside this repository.

This concept uses **filled squares on a square lattice**. Both are "curvature without
stroked curves", which satisfies the bridge-work pictogram law, but they are visually
distinct grammars and will read as two systems if used interchangeably.

**Proposed rule, not yet accepted:**

| Grammar | Domain | Rationale |
| --- | --- | --- |
| Hex lattice, filled discs | bridge-work brand identity, ornament, hero fields | Organic; derived from the brand's own primitive vocabulary |
| Square lattice, filled squares | Companion sprites, document and raster contexts | A rastered page *is* a square pixel grid — the idiom is earned, not decorative |

If this split is accepted it belongs in the bridge-work design system documentation, not
only here. If it is rejected, one of the two grammars should be dropped rather than both
kept.

## 6. Open decisions — all blocking

**D1 · Palette.** Not chosen. Three candidates, materially different outcomes:

| Option | Source | Trade-off |
| --- | --- | --- |
| Aurora pastels | PDF Lab workbench (`#b7dde0`, `#fff4e2`, `#f3f0fa`) | Matches existing Lab surfaces; pale, low contrast as a ramp |
| bridge-work warm ramp | `--amber #c48a2a` → `--rose #d4416b` → `--purple #3d1f47` | Ties companion to the brand; untested as a stepped ramp |
| Independent warm ramp | New yellow → orange → red | Reads best in the idiom; risks reading as borrowed |

**D2 · Naming.** See §2. Does the website companion take the Buddy name?

**D3 · Placement.** Where on bridge-work.ai does it live — a single page, a persistent
dock, or anchored appearances? `E-PIXEL-COMPANION-V2.md` Slice B defines safe-anchor
movement with exclusion zones; that work is proposed there and unbuilt.

**D4 · Subject and poses.** Which poses, and what the companion is *for* on a governance
and AI-adoption practice site. An idle mascot and a functional guide are different products.
Unresolved: whether a playful companion fits the brand's stated "calm operator, not
breathless evangelist" voice. This tension is real and should be settled before art.

## 7. Inherited constraints

Carried from `E-PIXEL-COMPANION-V2.md` and the bridge-work design system. These are
requirements, not aspirations:

- The site must remain fully usable and coherent with the companion hidden or absent.
- `prefers-reduced-motion` honoured: settled state, no animated loops.
- Keyboard accessible, accessible names, no focus disruption, no obscured controls.
- No timer leaks; suspend on hidden documents.
- No pointer-chasing, no floating windows, no arbitrary page crawling.
- bridge-work motion law: one easing `cubic-bezier(.22,1,.36,1)`; no particles.
- Colour driven from `tokens.css`, never hardcoded hex, in any ported implementation.

## 8. Picking this back up

Tracking issue: [#8 Website Buddy — start here](https://github.com/blackmath88/buddy/issues/8).
Blocking: [#2 brand-voice fit](https://github.com/blackmath88/buddy/issues/2) and
[#1 colour ramp](https://github.com/blackmath88/buddy/issues/1).

Start here, in order:

1. Read this document and §6.
2. Answer **D1** — nothing visual can be built before the ramp exists.
3. Answer **D4** — settle the voice tension before investing in art.
4. Build a pixel contact sheet at 32 / 48 / 64 px, light and dark, before any integration.
5. Only then consider the behaviour reducer port from `open-presence`.

Do not start at step 4. The previous iteration produced art before the register was
agreed, which is why it is being replaced.

## 9. Evidence and boundaries

- Source conversation: 2026-11-12. No code was written, no art produced, nothing deployed.
- `EPixelSprite.tsx` characterisation in §3 comes from reading the file at
  `blackmath88/baselhack26-open-presence@main`, 2026-11-12. The component was not executed
  or rendered; the "not pixel art" finding is source-level.
- The Aurora hex values in §6 were read from
  `sideprojects/pdf-lab/workbench/src/styles.css`. They are the workbench's colours, not
  an established `.phf` palette.
- No human has approved the §4 construction rules, the §5 split or any palette.
- This document does not change `.phf`, Commons, PDF Lab or the Human Signal concept,
  and establishes no claim about Mistral, Adobe or any third-party product.
