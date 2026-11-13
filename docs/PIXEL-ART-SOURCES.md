# Pixel-art port provenance and resources

2026-11-13. Owner requested transfer from library-ui to Buddy.

## Direct donor
- PR: https://github.com/blackmath88/library-ui/pull/1
- Inspected head: 789ac5cad69a2c57318d0933d53d0877e9c8f059
- Hero: https://github.com/blackmath88/library-ui/blob/789ac5cad69a2c57318d0933d53d0877e9c8f059/packages/html/src/pixel-art/autumn-new-england/hero.html
- Tokens: https://github.com/blackmath88/library-ui/blob/789ac5cad69a2c57318d0933d53d0877e9c8f059/packages/tokens/tokens.css
- Full donor research: https://github.com/blackmath88/library-ui/blob/789ac5cad69a2c57318d0933d53d0877e9c8f059/packages/tokens/donors/pixel-art_autumn-new-england.json
- Source rules: packages/tokens/laws.md and CLAUDE.md at the same revision. Their canon/gallery conventions are source-repository rules, not automatic product requirements for Buddy.

This is an adapted hero port, not a verbatim copy of the full PR. The donor's pixel-font button and decorative percentage meters are intentionally not adopted for the site's readable text interface. No independent component licence was found in the inspected source root; do not label this port MIT just because some research candidates are MIT. The owner's transfer request is not a substitute for verifying any third-party rights before redistribution. Preserve attribution and investigate source/asset rights before release. No external sprites/fonts or third-party engine were bundled.

## Engines and implementation references
- https://github.com/ernkerr/falling-leaves — leading drop-in candidate; repository describes small dependency-free canvas engine, optional React and reduced-motion support, MIT. Not installed; source port already includes a small leaf renderer.
- https://github.com/cahilfoley/react-snowfall — custom-sprite/weather candidate; verify current vanilla API, licence and bundle before use.
- https://github.com/daftspunk/3d-falling-leaves — older jQuery tumbling reference, not selected.
- https://github.com/qtqz/natural-falling-effect — owner-supplied multi-weather lead; unverified.
- https://codepen.io/soladiem/pen/qrmZoN — shader reference; verify reuse terms, no GPU dependency selected.
- https://github.com/patch-gg/pixelfx — pixel-effect lead; star/effect counts supplied earlier are not verified current facts.
- https://github.com/minhquocdk/pixel-live-wallpaper — procedural weather/foliage lead; unverified.
- https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
- https://www.belenalbeza.com/articles/retro-crisp-pixel-art-in-html-5-games/

## Asset leads, not licensed imports
- https://alda-k.itch.io/seamless-leaves-weather
- https://seliel-the-shaper.itch.io/autumn-forest
- https://opengameart.org/content/pixel-art-leaf-elemental-sprites
Check exact downloads, author, licence, attribution and permitted uses. Do not call every item free/CC0 from the hosting platform or a collection description. Procedural sprites in this port avoid importing these assets.

## Weather and browser references
- https://open-meteo.com/en/docs — fields, weather-code mapping, timezone, units, licensing/commercial access.
- https://open-meteo.com/en/docs/geocoding-api — city/postcode search and disambiguation.
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API — permission and secure-context requirements.

Open-Meteo docs and MDN were consulted for concept design, not used to make live location/weather requests. Provider terms, budget, attribution and privacy implementation must be checked before integration.
