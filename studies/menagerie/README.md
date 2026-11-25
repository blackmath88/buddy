# Menagerie: pixel critters that walk on the page

2026-11-25. A second pixel-art study next to [autumn](../autumn/index.html). Open `index.html` directly in a browser.

It started as a concept for the MCP Lab (blackmath88/mcp): weird real MCP servers as pixel critters that walk over the lab's own cards, joke in speech bubbles, and open a card with the real facts when clicked. It's kept here as a worked example of the technique. The same method could give Buddy a companion that lives in the page.

## What's in the folder

- `index.html`: the full study (cast cards, a mock lab page, rules, plan). The critters walk over all of it.
- `sprites.js`: the eight critters as 16×16 text grids with two walk frames each. Data only.

No image files, no libraries, no fonts beyond Inter and JetBrains Mono.

## How it's made

### 1. Sprites are text

Each critter is 16 rows of 16 characters. `.` is empty, `k` is the outline, and every other letter is a palette key:

```
'......kkkk......',
'....kkPPppkk....',
'...kPPpppyypk...',   p = cap, P = cap light, y = spots
```

Frame B overrides only the last rows (the feet), so a walk cycle costs two or three lines. Silhouettes come first. Every critter has to be recognisable as a solid black shape: mushroom, floppy disk with halo, nightcap, brain on legs, gopher, telescope, dotted ghost, trenchcoat with four feet.

### 2. Fidelity comes from rules, not more pixels

The renderer adds three passes when it draws a grid to a canvas, so the hand-written data stays flat and easy to edit:

1. **Light from top-left.** A fill pixel whose upper neighbour is the outside edge gets 28% white mixed in. If only its left neighbour is the edge, it gets 14%.
2. **Shade bottom-right.** The same rule from below and from the right, with 24% / 14% dark mixed in.
3. **Selective outline.** An outline pixel that touches the outside takes a deep tone of the fill it wraps (62% toward near-black) instead of flat black.

The passes only look at the *exterior* edge. Eyes and mouths are outline pixels inside the shape, so faces stay crisp. An earlier version shaded around every outline pixel and the faces went muddy.

### 3. One grid, three render modes

| Mode | Used for | What changes |
| --- | --- | --- |
| sticker | walking critters, small icons | 1-pixel white outline around the whole shape, so it reads on any background, dark ones included |
| duo | giant card art | colours collapse to the critter's dark / mid / light tones by luminance; one "pop" colour (halo, eyes, spots) stays |
| plain | debugging | grid as written, with shading |

### 4. Cards: mosaic + cropped giant

This borrows a technique from AI-lab pixel branding (Mistral's 2025–26 site was the reference; no assets were copied):

- A **mosaic** background in the critter's hue: a light tint, about 22% of tiles one step darker, and a faint grid. The tile choice is seeded from the critter's name, so it's stable across reloads.
- The **critter drawn huge** (15 px per pixel) in duotone, pushed off the right and bottom edge so it's cropped.
- The name sits over the mosaic. The text below holds the joke, the fact, and two meters drawn as 7×7 pixel icons (filled vs. empty).

### 5. Terrain and the walker

- Anything marked `data-perch` is ground: card tops, headings, stepped colour blocks in the hero, the colour bands at the bottom. `data-magnet` makes an element three times as likely to be chosen, so critters gather where you want attention.
- Each critter paces its perch. At an edge it turns around or jumps on a sine arc to another perch, preferring perches inside the viewport.
- Walk frames switch every 170 ms. Movement is in whole CSS pixels and rendering stays `image-rendering: pixelated`.
- Clicking a critter opens its full card above it, with a tail pointing at it. If there's no room above, the card opens below. Escape or a click outside closes it.
- One switch hides them all (remembered in `localStorage`). With `prefers-reduced-motion` they stand still.

## For Buddy

What carries over directly: text-grid sprites, the shading passes, sticker mode, the perch/magnet walker. What doesn't: the MCP content and the lab mock. If Buddy gets a companion, it would be one critter with seasonal variants (twelve palettes on one grid), standing on the scene's ground line instead of on cards.

## Limits

- Checked in Chromium at 1200 px in dark mode. Phone width and light mode weren't checked visually.
- The critters' facts are about real MCP servers. Two of them (LSD MCP, Consciousness Bridge) come from a web search on 2026-11-25 and are labelled `research`, not verified at the source.
- The live version is a private claude.ai artifact; this folder is the source.
