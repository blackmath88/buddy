# Buddy: current product direction

2026-11-13 owner brief: build a small website with normal readable text and ornamental pixel-art scenery. Twelve fixed monthly art states combine with weather for the visitor's selected or consented location. This supersedes the imported research-IDE material as Buddy's current product direction; that material remains historical research, not the website's required feature list.

## Build next
- [Detailed implementation plan and acceptance gates](docs/SEASONAL-BUILD-PLAN.md)
- [Copy-paste implementation, continuation and review prompts](docs/AGENT-HANDOVERS.md)
- [Website concept](docs/SEASONAL-WEBSITE-CONCEPT.md)
- [Autumn study](studies/autumn/index.html): open directly in a browser.
- [Port provenance and resources](docs/PIXEL-ART-SOURCES.md)

The first implementation assignment is Slice A: a running twelve-month scene playground with mocked weather, normal HTML content, tests and real screenshots. Do not deliver only another plan.

## Baseline and limits
Initial study port: commit 35bd3c88d5c0ab79a198c30ab1a8859a92e87f72. It contains an adapted autumn hero, not the entire library-ui monorepo. At that baseline there is no live weather, location lookup, twelve-month system or deployment. No runtime/browser tests were performed by the connector-based port. This documentation change implements none of those features.

The owner will provide the existing website for later integration; do not replace it before inspection. Its absence does not block the standalone Slice A playground. Source attribution and licence/asset verification remain required before release.
