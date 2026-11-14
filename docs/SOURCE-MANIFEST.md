# Buddy Design Lab — source manifest

2026-11-14. Scope: implementation branch based on 142597b1ca10bf46c6505f1531c989bccff6e9d3. No new third-party runtime code package, sprite, font or image was imported into the Lab.

| Source | Revision / location | Used or copied | Terms / attribution / changes |
| --- | --- | --- | --- |
| Original Lab artwork | `src/art.ts`, branch implementation commits | All six buddy shape sources, twelve environments, weather primitives | Locally authored for this task. No external asset licence required; no project-wide licence or trademark-clearance claim introduced. |
| Original catalogues & palettes | `src/catalogue.ts` | Identity, manifests, material ramps, support/compatibility metadata | Locally authored; provisional buddy names. |
| Original renderer/model/UI | `src/{renderer,model,main}.ts`, CSS | Local xorshift32 PRNG implementation, clock/lifecycle, cache, atlas, SVG, recipes, UI | No donor engine code copied into Lab modules. Classic PRNG algorithm is used with a locally written implementation. |
| Existing autumn reference | `studies/autumn/`, unchanged from 35bd3c88d5c0ab79a198c30ab1a8859a92e87f72 | Preserved separately; not the new Lab runtime | Existing attribution and unresolved donor rights remain in PIXEL-ART-SOURCES.md. Owner review of third-party rights is still needed before redistribution/release. |
| Pinned library-ui donor | [hero source](https://github.com/blackmath88/library-ui/blob/789ac5cad69a2c57318d0933d53d0877e9c8f059/packages/html/src/pixel-art/autumn-new-england/hero.html), 789ac5cad69a2c57318d0933d53d0877e9c8f059 | Inspected as historical reference; no new copy into Lab modules/assets | Independent component licence not established. Existing original reference is not relabelled MIT. No donor skill/script executed. |
| MDN Canvas caching | https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas | Architectural guidance only | No source example or asset copied; not performance evidence. |
| MDN reduced motion | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion | Accessibility guidance only | No code/assets copied; live behaviour tested separately. |

## Build/test tooling (no runtime dependency)

Pinned direct versions are in package.json; exact transitive resolutions/integrities are in package-lock.json. Vite 7.2.2 (MIT), TypeScript 5.9.3 (Apache-2.0), Vitest 4.0.9 (MIT), Playwright Test 1.56.1 (Apache-2.0), Prettier 3.6.2 (MIT). These are development tools, not bundled art. Installed Chromium is used for tests. Pillow is used only by the optional contact-sheet compositor; it is not shipped as application code.

## Not adopted

The suggested ernkerr/falling-leaves, patch-gg/pixelfx, cahilfoley/react-snowfall, qtqz/natural-falling-effect, minhquocdk/pixel-live-wallpaper, jQuery/shader references, OpenGameArt and itch.io leads were not installed or copied. Their licences/assets were not independently cleared in this session, and no reuse right is asserted. Local original equivalents avoid that dependency. No arbitrary remote code, donor scripts or raw imported HTML is accepted by recipes.

No Studio Ghibli/franchise asset or shot, generated commercial-service image, external font, moodboard photograph or telemetry snippet is bundled. The original artwork statement describes authorship/provenance, not legal advice or a universal clearance guarantee.
