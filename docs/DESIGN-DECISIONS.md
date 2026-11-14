# Buddy Design Lab — design decisions

2026-11-14. Implementation decisions, not owner acceptance.

## One app, an intact reference

There was no application stack at baseline 142597b. Vite + TypeScript + ordinary HTML/CSS now provide one root app. The historical autumn reference is unchanged, copied into production output and linked from the footer. No donor monorepo, research IDE, React wrapper, backend or runtime dependency was imported.

The cream/sage editorial layout separates readable HTML from scenery. A single anchor opens at root; static gallery images introduce the collection. Serif headings, small field-note annotations and generous space support browsing rather than a settings dashboard. No remote font is required.

## Original shapes with honest fidelity

`src/art.ts` is the original editable shape source for six companions and twelve compositions. Art uses local paths, fills and material roles; names remain provisional. No film frame, franchise character, downloaded asset, generation service or external mood image is bundled.

F1 uses broad geometry, a restricted sky palette, reduced environment detail and three pose samples. F2 adds botanical clusters, prop structure and eight samples. F3 adds material marks, plants, glints and finer character detail. Scene budgets are 160×90 / 320×180 / 480×270; atlas cells are independently 96×96. These are code-drawn, rasterized illustrations, not a claim of expert hand-clustered pixel art. Refining authored clusters/materials is an explicit next art pass.

The same `Painter` primitives can be replayed to Canvas2D or serialized into SVG. SVG uses vector edges and is labelled accordingly. Every study has its own environment composition; shared hills and material ramps keep the collection coherent. The bridge, shelter, terrace and observatory were authored first in the source progression.

## Acting and rendering

A four-second action cycle has anticipation, a brief action, recovery and a long hold. Curiosity leans/reaches, delight lifts, weather reaction braces/raises arms, rest settles. It is intentionally restrained, not a continuous game walk cycle. All six have five state poses and original palette/silhouette definitions.

T1 caches its environment and draws original buddy shapes directly. T2 samples a real precomputed atlas; no per-frame procedural buddy drawing occurs. T3 layers original SVG environment, actor and weather groups, with limited pose updates. T4 combines cached canvas scenery, an atlas buddy and a bounded weather pass. Smooth shape poses use continuous timing; smooth atlas poses crossfade samples. Neither claims hand-drawn interpolation.

A shared clock owns requestAnimationFrame and visibility/reduced-motion listeners. A page has at most two active specimens; thumbnails, contact sheets and the raw atlas inspector have no animation loop. Manual pause survives tab visibility changes and navigation. Motion=false yields a composed time-zero still. Paused and reduced-motion specimens retain a stable composed frame. Disposal cancels work and removes listeners; Canvas failure keeps HTML controls usable and SVG can recover.

The implementation retains bounded per-frame shape/path allocation (up to 64 weather elements); it does not claim allocation-free rendering. Static environment geometry is cached. Atlas memory is per active specimen and discarded on update/disposal; the thumbnail cache is bounded to 49 entries.

## Seasonal and recipe boundaries

Calendar controls structure independently from weather. The bridge reference landscape, shelter and terrace support twelve structural monthly states. Other studies use their fixed authored month. All inputs explicitly describe a northern-temperate illustration profile, not local ecology. Rain stays outside the tea shelter; window precipitation stays in the exterior window region. Snowfall does not imply permanent snow accumulation.

Mixing retains world anchors and aspect ratio, with a coherent per-buddy scale. Palette choices map environment material roles; a buddy keeps its identity palette. Compatibility rejects indoor/dock Lumen placements, warm orbital skies and unsupported weather. All three fidelities and four techniques are available for every compatible scene. Curated presets and experimental mixes are distinguished.

Recipes are strict version-1 data objects, not executable plugin manifests. Import validates 8 KB maximum, exact fields, IDs/enums, integer bounds, booleans and compatibility before committing any state. Favourites have a 50-item cap, explicit clearing and denied/corrupt-storage feedback. Reset does not delete favourites. JSON export and original atlas PNG export require no service.

Comparison keeps one time source and a fixed normalized camera. With sync enabled, scene, buddy, palette, action, seed, month/weather, light, motion and pose sampling synchronize. Technique/fidelity deliberately remain independent; the UI lists differences. With sync off, inputs differ while time remains shared.

## Strongest current studies and useful methods

- **A parcel before dusk:** foreground path and courier, diagonal water and a covered bridge create a readable small journey.
- **Tea until the rain passes:** shelter roof, cup, bench and a warm lamp provide a clear domestic reason for the rain.
- **A little more sunlight:** greenhouse, collector, pots and Sola connect technology to an everyday garden task.

**Hybrid Canvas** is useful for the seasonal anchors: cache scenery, reuse pose atlases and isolate bounded weather. **SVG cutout** is useful for readable expressive silhouettes and fast local edits; it also provides recovery when Canvas2D is unavailable.

These are implementation self-review judgements, not owner aesthetic approval. Observatories and some secondary scenes still merit a richer material/light pass, and atlas crossfading may look ghosted compared with designed in-between poses.
