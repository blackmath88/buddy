# Buddy: twelve months, local weather, ordinary readable content

Owner brief captured 2026-11-13. Status: proposed website concept plus an adapted autumn study. Not a live-weather implementation. The owner will share an existing site; inspect its code and artwork before integration.

## 1. Product definition
A small, calm website whose ornamental pixel-art environment changes with the calendar and local weather. Typography, navigation, links, forms and content remain ordinary accessible HTML. Pixel art is the atmosphere, not a requirement to pixelate text or turn the site into a game. No research IDE, dashboard, mastery meter or chatbot is required.

Two independent drivers:
- Calendar: twelve fixed, authored monthly compositions/configurations.
- Weather: the selected location's current modelled conditions, applied as bounded overlays and lighting modifiers.

Optional local day/night is a lighting input, not twelve more scenes or a third major product. A November rainy scene remains November; snow in April can overlay spring without replacing the calendar with January.

## 2. Visual system
Keep a stable landscape identity: sky, distant ridge, architecture/landmark, trees, ground, foreground ornaments. Separate layers so weather can change without rebuilding twelve entire websites. The imported New England covered bridge is a study subject, not an assertion about the visitor's location. Selecting Tokyo weather must not imply the artwork depicts Tokyo.

Normal system or approved site fonts; stable high-contrast content surface; generous spacing. Never pixelate the whole page. Decorative canvas stays aria-hidden and pointer-events:none. Meaningful weather/location is available in HTML. Do not let particles cross opaque reading panels. No flashing lightning by default.

Proposed monthly art direction for a northern-temperate default, not a claim of local phenology:
| Month | Authored atmosphere |
| --- | --- |
| January | Bare trees, cool palette, dormant ground; snow only when configured/weather permits. |
| February | Sparse canopy, restrained thaw/late-winter details. |
| March | Buds, muted fresh greens, early flowers. |
| April | Blossoms and small leaves. |
| May | Full fresh canopy, brighter ground. |
| June | Mature green, early-summer growth. |
| July | Rich summer canopy and warm highlights. |
| August | Dry grasses and late-summer gold accents. |
| September | First selective color changes, fewer drifting leaves. |
| October | Strong red/gold foliage and deeper litter. |
| November | Sparse canopy, brown/gold ground and exposed branches. |
| December | Dormant forms, evergreen accents and winter palette; no forced holidays. |

Do not silently shift six months for every southern latitude: climate/biome is more complex. MVP explicitly labels its northern-temperate illustration profile while weather follows the selected place. Later add deliberately authored southern-temperate/tropical profiles only if needed. Timezone/language alone is not location consent.

## 3. Weather grammar
Normalize provider codes into clear, cloudy, fog, rain, snow, mixed and thunderstorm categories; retain intensity, wind, provider timestamp, timezone and day/night flag when supplied. Unknown means neutral/unknown, never invented sunshine. Mixed precipitation needs an explicit mapping.

- Clear: brighter sky/light; no precipitation.
- Cloud: cloud cover and softer contrast, not darkened text.
- Fog: distant-layer haze only.
- Rain: short pixel streaks, restrained wet accents.
- Snow: slow sparse flakes; snowfall does not prove accumulated snow cover.
- Mixed: restrained mixed particles rather than falsely converting to snow.
- Storm: darker atmosphere/stronger capped wind, no strobing.
- Wind: particle direction/sway bounded for readability and performance; provider units normalized.

Leaves depend on calendar/profile canopy state, not solely wind or rain. Do not render falling autumn leaves in every month. Avoid physically precise claims: the background is an interpretation of weather, not radar or a safety instrument.

## 4. Location experience and privacy
No geo-locking: nobody is denied access based on geography. Proposed order:
1. Render immediately with labelled default/example location or neutral artwork. No permission prompt on arrival.
2. Offer city/postcode search and an explicit Use my location button.
3. Search returns disambiguated city/country/region choices; the visitor chooses.
4. On consent, request a one-time browser position, not continuous tracking. Round coordinates before sending to the weather service; explain the recipient and purpose. Rounding reduces precision but does not make location anonymous.
5. Denial, timeout or unavailable location leaves search and the whole site usable.

No silent IP-geolocation vendor in MVP. Browser timezone may support a labelled default, not identify a city. Prefer selected city persistence only when requested; do not retain precise GPS, put it in URLs, analytics or error logs. An optional server proxy also sees coordinates and needs its own privacy/retention rules.

Show 'Weather for Basel, Switzerland' rather than 'You are in Basel' if using a chosen/default place. Geolocation without reverse-geocoding may simply say 'Weather near your selected location'. Provide Change location and clear saved preference.

## 5. Data and state
Suggested independent contracts: CalendarState (actual/preview month, selected-place timezone, illustration profile); LocationState (default/search/geolocation, coarse coordinates, display label, permission/error); WeatherState (normalized conditions, source, provider/received times, fresh/stale/unavailable); Preferences (motion and deliberately saved place); SceneConfig (derived visual settings).

Implement pure deriveScene(calendar, weather, preferences), separate from network and rendering. Use destination timezone for month/day boundaries after location resolution; keep SSR/default state deterministic to avoid hydration mismatch. A stored preview month must never silently become real live state.

Candidate service: Open-Meteo geocoding plus forecast/current fields including weather_code, temperature_2m, cloud_cover, precipitation, wind_speed_10m, wind_direction_10m and is_day where supported. Inspect exact API contracts, attribution and commercial-use terms before integration; not every deployment qualifies for free non-commercial access. This port calls no service.

Suggested refresh policy: cache by coarse place, refresh around 15 minutes while visible with backoff; avoid requests on every animation frame or tab event. Mark stale results and their time; after an agreed limit (proposal: two hours) use neutral seasonal fallback rather than imply live accuracy. Refresh on return only when stale. Abort superseded searches/requests and reject out-of-order responses.

## 6. Rendering and accessibility
Start with Canvas2D plus ordinary HTML/CSS, not WebGL/Three or a new framework. Reuse the existing site's framework when provided. The study uses a deliberately small backing canvas enlarged with image-rendering:pixelated and smoothing disabled. Integer sprite placement and limited palettes are the intention; quantized canvas rotations still need visual checks for crispness.

Prefer one cached backdrop, precomputed sprite frames and one bounded particle loop. No heavy per-frame network/layout work. Pause when hidden; support live changes to reduced-motion and explicit Pause. Reduced motion retains the composition and weather description without falling particles. Site content works without canvas/network/location.

The study currently stretches a viewport-sized low-resolution canvas; its scale/crop policy is provisional. Production should use a stable logical scene and aspect-preserving integer scale/crop where practical. Verify portrait, ultrawide, zoom and DPR rather than claim nearest-neighbor alone solves every screen.

## 7. Port scope and status
Source: blackmath88/library-ui PR #1, merged; head 789ac5cad69a2c57318d0933d53d0877e9c8f059. Adapted hero only, not button/progress archetypes, full gallery or other canons.

Retained: autumn palette/moods, low-resolution canvas, Bayer sky, procedural maple/oak/birch leaves, precomputed eight-angle frames, depth tiers, hills/bridge, wind/sway and landed litter. Changed: normal HTML text/controls, no external fonts or canvas captions, module encapsulation, bounded canvas size, no global single-letter shortcuts, live reduced-motion reaction and a single scheduled animation loop. Particle mirroring and some source composition details are simplified.

No tests or browser render were run by this connector-based port. The source author's Node/stub smoke checks are historical source claims, not validation of the adapted files. No geolocation, API, monthly scene presets, actual snow/rain or deployment is implemented.

## 8. Build plan
P0: inspect existing site/artwork when supplied; confirm content, visual region, deployment/audience and chosen climate/profile policy. Preserve its framework and content.
P1: run/visually validate this autumn study; get one convincing desktop/mobile composition with ordinary text. Test pause, focus, no-JS, hidden tab and reduced motion. Check licence/rights before public release.
P2: extract pure scene config and author all twelve monthly presets; test January/April/July/October plus each month's distinguishing forms. Same scaffold, not twelve copied pages. Expose clearly labelled preview-only controls.
P3: add deterministic mocked weather categories; validate every month with every weather state without live API dependence. Test precipitation priority, wind bounds and no flashing.
P4: add city search then optional one-shot geolocation; implement timeout/denial, ambiguous cities, stale/no network, race cancellation, terms/attribution and clear preference controls.
P5: integrate into the owner's actual site, performance/accessibility/browser checks, then a separately authorized deployment.

Acceptance: readable content in every scene; twelve distinguishable months; location refusal works; weather visibly matches normalized input; offline fallback honest; selected timezone boundaries correct; no precise location retention by default; deterministic tests; measured mobile performance; source attribution; no fabricated API/test/deployment claims.

Agent prompt: Read START-HERE.md, this concept and PIXEL-ART-SOURCES.md. Treat docs/research as historical imports, not a mandate to build an IDE. First run and verify the autumn study; report actual screenshots/checks and inspect the existing site once supplied. Implement one milestone at a time. Preserve text as HTML, monthly state independent from weather and privacy by default. Do not invent missing artwork, live integration, licence clearance or test results. No auto-deployment.
