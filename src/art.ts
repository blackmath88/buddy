import {
  byBuddy,
  byStudy,
  type BuddyId,
  type Fidelity,
  type PaletteId,
  type State,
} from "./catalogue";
import { deriveScene, poseSample, seeded, type Recipe } from "./model";
export type Shape = {
  kind: "path" | "rect" | "ellipse";
  d?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fill: string;
  stroke?: string;
  sw?: number;
  opacity?: number;
};
export class Painter {
  shapes: Shape[] = [];
  path(d: string, fill: string, stroke?: string, sw = 1, opacity = 1) {
    this.shapes.push({ kind: "path", d, fill, stroke, sw, opacity });
  }
  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke?: string,
    sw = 1,
  ) {
    this.shapes.push({ kind: "rect", x, y, w, h, fill, stroke, sw });
  }
  ellipse(
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke?: string,
    sw = 1,
  ) {
    this.shapes.push({ kind: "ellipse", x, y, w, h, fill, stroke, sw });
  }
  line(x: number, y: number, x2: number, y2: number, color: string, width = 1) {
    this.path(`M${x} ${y}L${x2} ${y2}`, "none", color, width);
  }
}
export function canvasShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
  for (const s of shapes) {
    ctx.fillStyle = s.fill;
    ctx.strokeStyle = s.stroke ?? "transparent";
    ctx.lineWidth = s.sw ?? 1;
    ctx.globalAlpha = s.opacity ?? 1;
    let path: Path2D;
    if (s.kind === "path") path = new Path2D(s.d);
    else {
      path = new Path2D();
      if (s.kind === "rect") path.rect(s.x!, s.y!, s.w!, s.h!);
      else path.ellipse(s.x!, s.y!, s.w!, s.h!, 0, 0, Math.PI * 2);
    }
    if (s.fill !== "none") ctx.fill(path);
    if (s.stroke) ctx.stroke(path);
  }
  ctx.globalAlpha = 1;
}
export function svgShapes(shapes: Shape[]) {
  return shapes
    .map((s) => {
      const style = `fill="${s.fill}"${s.stroke ? ` stroke="${s.stroke}" stroke-width="${s.sw ?? 1}"` : ""}${s.opacity !== undefined ? ` opacity="${s.opacity}"` : ""}`;
      return s.kind === "path"
        ? `<path d="${s.d}" ${style}/>`
        : s.kind === "rect"
          ? `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" ${style}/>`
          : `<ellipse cx="${s.x}" cy="${s.y}" rx="${s.w}" ry="${s.h}" ${style}/>`;
    })
    .join("");
}
const palette: Record<
  PaletteId,
  {
    sky: string[];
    far: string;
    mid: string;
    dark: string;
    cream: string;
    roof: string;
    water: string;
    light: string;
    accent: string;
  }
> = {
  hearth: {
    sky: ["#b1b5c4", "#d1b8ae", "#efd0ad", "#f5dfbd"],
    far: "#a5a48b",
    mid: "#7e8e75",
    dark: "#43594c",
    cream: "#eedbb9",
    roof: "#945947",
    water: "#91aca6",
    light: "#ffe0a1",
    accent: "#c87747",
  },
  tomorrow: {
    sky: ["#91b8ba", "#b1c9c5", "#d0d9c8", "#ebe5c9"],
    far: "#8caeac",
    mid: "#73998b",
    dark: "#345d59",
    cream: "#eddfbb",
    roof: "#537c7d",
    water: "#80aaa6",
    light: "#fbe3a0",
    accent: "#d38a70",
  },
  orbit: {
    sky: ["#596683", "#788396", "#a4a4aa", "#d0beb0"],
    far: "#8e9695",
    mid: "#718c83",
    dark: "#3c565a",
    cream: "#e8d6b4",
    roof: "#586c7b",
    water: "#889fae",
    light: "#f5d69b",
    accent: "#bd887c",
  },
};
const mix = (a: string, b: string, t: number) => {
  const rgb = (c: string) =>
    [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const x = rgb(a),
    y = rgb(b);
  return (
    "#" +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};
function tree(
  p: Painter,
  x: number,
  y: number,
  size: number,
  leaf: string,
  density: number,
  detail: number,
  seed: number,
) {
  const r = seeded(seed);
  p.path(
    `M${x - 2} ${y}L${x - 1} ${y - size * 0.8}L${x + 1} ${y - size * 0.8}L${x + 3} ${y}Z`,
    "#645e4b",
  );
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const bx = x + Math.cos(a) * size * 0.35,
      by = y - size * 0.6 + Math.sin(a) * size * 0.28;
    p.line(x, y - size * 0.35, bx, by, "#645e4b", 1.2);
  }
  for (let i = 0; i < Math.floor((detail === 0 ? 8 : 22) * density); i++) {
    const tx = x + (r() - 0.5) * size * 0.9,
      ty = y - size * 0.45 - r() * size * 0.5,
      rad = size * (0.1 + r() * 0.12);
    p.ellipse(
      tx,
      ty,
      rad,
      rad * 0.8,
      mix(leaf, i % 3 === 0 ? "#f5db94" : "#536d51", i % 3 === 0 ? 0.2 : 0.12),
    );
    if (detail > 1) p.rect(tx, ty, 2, 1, "#e6bc76");
  }
}
function pot(
  p: Painter,
  x: number,
  y: number,
  size: number,
  c: string,
  detail = 2,
) {
  p.path(
    `M${x - size * 0.5} ${y}L${x - size * 0.35} ${y + size * 0.7}L${x + size * 0.35} ${y + size * 0.7}L${x + size * 0.5} ${y}Z`,
    c,
  );
  p.rect(x - size * 0.6, y - 2, size * 1.2, 3, mix(c, "#f3d8ac", 0.25));
  p.line(x, y, x, y - size, "#58765c", 1.5);
  p.ellipse(x - 3, y - size * 0.6, 4, 2, "#88a476");
  p.ellipse(x + 3, y - size * 0.85, 4, 2, "#b6bd7e");
  if (detail > 1) p.ellipse(x, y - size * 1.15, 3, 2, "#ddbc91");
}
function lamp(p: Painter, x: number, y: number, h: number, night: boolean) {
  p.rect(x - 1, y - h, 2, h, "#5e5d4f");
  if (night) p.ellipse(x, y - h + 3, 12, 13, "#f3d194", undefined, 1);
  p.rect(x - 4, y - h, 8, 9, "#f1d6a0", "#71674f");
  p.path(`M${x - 6} ${y - h}L${x} ${y - h - 5}L${x + 6} ${y - h}Z`, "#5b6458");
}
function greenhouse(
  p: Painter,
  x: number,
  y: number,
  w: number,
  h: number,
  c: typeof palette.hearth,
  detail: number,
) {
  p.path(
    `M${x} ${y}V${y - h * 0.65}L${x + w * 0.5} ${y - h}L${x + w} ${y - h * 0.65}V${y}Z`,
    mix(c.water, c.cream, 0.35),
    c.dark,
    2,
  );
  p.path(
    `M${x} ${y - h * 0.65}L${x + w} ${y - h * 0.65}M${x + w * 0.5} ${y - h}V${y}M${x + w * 0.25} ${y - h * 0.8}V${y}M${x + w * 0.75} ${y - h * 0.8}V${y}M${x} ${y - h * 0.32}H${x + w}`,
    "none",
    c.cream,
    2,
  );
  if (detail) {
    for (let i = 0; i < 4; i++)
      pot(p, x + 10 + (i * (w - 20)) / 3, y - 8, 7, c.roof, detail);
  }
  p.path(
    `M${x + 4} ${y - h * 0.6}L${x + w * 0.43} ${y - h * 0.87}L${x + 4} ${y - h * 0.2}Z`,
    "#f8ebcd",
    undefined,
    1,
    0.25,
  );
}
export function landscape(recipe: Recipe): Shape[] {
  const p = new Painter(),
    s = byStudy(recipe.study)!,
    scene = deriveScene(recipe.month, recipe.weather, recipe.seed),
    season = scene.season;
  const c = palette[recipe.palette],
    detail =
      recipe.fidelity === "sketch" ? 0 : recipe.fidelity === "crafted" ? 1 : 2,
    r = seeded(recipe.seed);
  const night = recipe.night;
  // Quantized, dithered sky. This layer is cached until a scene input changes.
  const sky = night ? ["#273e52", "#3c5267", "#667b85", "#a5a59b"] : c.sky;
  for (let y = 0; y < 180; y += 3) {
    const t = (y / 180) * 3,
      i = Math.min(2, Math.floor(t)),
      f = t - i;
    p.rect(0, y, 480, 3, mix(sky[i], sky[i + 1], f));
    if (detail > 0 && y % 12 === 0)
      for (let x = 0; x < 480; x += 8) p.rect(x + (y % 8), y, 2, 1, sky[i + 1]);
  }
  if (night) {
    for (let i = 0; i < 72; i++)
      p.rect(
        Math.floor(r() * 480),
        Math.floor(r() * 125),
        i % 12 === 0 ? 2 : 1,
        1,
        "#e8dcbf",
      );
    p.ellipse(365, 48, 18, 18, "#e2d8b7");
    p.ellipse(372, 43, 17, 17, sky[0]);
  } else {
    p.ellipse(356, 63, 24, 24, "#f4dcad");
    p.ellipse(356, 63, 17, 17, "#f9e7be");
  }
  if (
    ["cloudy", "rain", "storm", "snow", "mixed", "unknown"].includes(
      scene.weather,
    )
  ) {
    for (let i = 0; i < 6; i++) {
      const x = i * 100 - 30,
        y = 32 + (i % 3) * 12;
      p.path(
        `M${x} ${y + 10}Q${x + 8} ${y - 5} ${x + 25} ${y}Q${x + 38} ${y - 17} ${x + 52} ${y}Q${x + 70} ${y - 5} ${x + 80} ${y + 10}Z`,
        night ? "#75838b" : "#d2d3c6",
        undefined,
        1,
        0.65,
      );
    }
  }
  if (s.world === "cottage" || s.world === "dock") {
    p.ellipse(90, 54, 43, 43, "#c3c4ad");
    p.path("M27 60Q90 89 154 49", "none", "#e0d8be", 4);
    p.path("M59 26Q83 52 123 63", "none", "#a3b3aa", 4);
  }
  const hill = (y: number, amp: number, color: string, phase: number) => {
    let d = `M0 270V${y}`;
    for (let x = 0; x <= 480; x += 8)
      d += `L${x} ${Math.round(y + Math.sin(x / 85 + phase) * amp + Math.sin(x / 39 + phase) * amp * 0.25)}`;
    p.path(d + "L480 270Z", color);
  };
  hill(136, 14, night ? mix(c.far, "#344b60", 0.45) : c.far, 1);
  hill(159, 18, night ? mix(c.mid, "#344b60", 0.3) : c.mid, 3);
  if (detail > 0)
    for (let i = 0; i < 40; i++) {
      let x = i * 14 - 10,
        y = 140 + Math.sin(x / 85 + 1) * 14;
      tree(
        p,
        x,
        y,
        10 + r() * 10,
        season.leaves,
        season.canopy,
        0,
        i + recipe.seed,
      );
    }
  p.path(
    "M0 195Q75 170 164 186Q280 204 480 167V270H0Z",
    night ? mix(season.ground, "#465b61", 0.35) : season.ground,
  );
  switch (s.world) {
    case "bridge": {
      p.path(
        "M480 153Q279 169 267 203Q227 229 160 270H306Q382 221 336 198Q320 179 480 167Z",
        c.water,
      );
      if (detail > 0)
        for (let i = 0; i < 30; i++) {
          const y = 185 + r() * 80;
          p.rect(
            265 + r() * 65 - (y - 190) * 0.5,
            y,
            3 + r() * 12,
            1,
            mix(c.water, c.cream, 0.35),
          );
        }
      p.path("M208 184Q268 201 346 180L346 187Q272 214 208 192Z", "#655e4f");
      p.path("M213 165L339 156L339 180L213 191Z", c.roof);
      p.path("M205 164L237 142L346 150L353 157Z", "#6c5849");
      p.path("M215 169L329 161L329 166L215 175Z", "#b77b56");
      for (let i = 0; i < (detail === 0 ? 4 : 9); i++) {
        const x = 220 + i * 12;
        p.path(
          `M${x} ${173 - i * 0.8}L${x + 7} ${172 - i * 0.8}V${183 - i * 0.8}L${x} ${184 - i * 0.8}Z`,
          c.dark,
        );
      }
      p.path("M228 191L228 211M323 184L323 198", "none", "#746a55", 5);
      tree(p, 54, 223, 123, season.leaves, season.canopy, detail, recipe.seed);
      tree(
        p,
        439,
        209,
        98,
        season.leaves,
        season.canopy,
        detail,
        recipe.seed + 1,
      );
      p.path("M0 230Q90 213 155 229Q194 237 223 270H0Z", c.dark);
      p.path("M480 219Q391 211 322 239L303 270H480Z", mix(c.mid, c.dark, 0.4));
      p.path("M325 270Q324 239 361 226L380 230Q348 251 355 270Z", c.cream);
      lamp(p, 389, 235, 35, night);
      pot(p, 410, 245, 11, c.accent, detail);
      break;
    }
    case "shelter": {
      tree(p, 41, 216, 104, season.leaves, season.canopy, detail, recipe.seed);
      tree(
        p,
        437,
        204,
        90,
        season.leaves,
        season.canopy,
        detail,
        recipe.seed + 5,
      );
      p.path("M93 230L152 202H387L439 230Z", "#bcaa83");
      p.rect(144, 133, 8, 83, c.dark);
      p.rect(375, 133, 8, 83, c.dark);
      p.rect(145, 137, 237, 7, c.roof);
      p.path("M108 137L163 92L365 92L415 137Z", c.roof);
      p.path("M108 137L163 92L178 92L132 137Z", c.accent);
      p.line(110, 139, 413, 139, c.cream, 3);
      if (detail > 0)
        for (let i = 0; i < 13; i++)
          p.line(
            157 + i * 17,
            97,
            133 + i * 20,
            132,
            mix(c.roof, c.cream, 0.16),
            1,
          );
      p.rect(164, 185, 68, 6, c.roof);
      p.rect(171, 191, 4, 26, c.dark);
      p.rect(218, 191, 4, 26, c.dark);
      p.ellipse(198, 182, 8, 3, c.cream);
      p.path("M190 175Q196 165 190 157", "none", c.cream, 1);
      p.rect(330, 195, 33, 5, c.roof);
      p.rect(336, 200, 4, 16, c.dark);
      lamp(p, 350, 193, 45, true);
      pot(p, 162, 214, 13, c.accent, detail);
      p.path("M13 270Q105 235 232 222L262 222Q125 247 96 270Z", c.cream);
      break;
    }
    case "path": {
      p.path(
        "M206 270Q147 230 246 193Q319 166 229 155L236 153Q339 168 270 198Q207 233 285 270Z",
        c.cream,
      );
      tree(p, 84, 223, 114, "#e6b6b1", 0.8, detail, recipe.seed);
      tree(p, 410, 210, 92, "#ecc3ba", 0.8, detail, recipe.seed + 2);
      for (let i = 0; i < 24; i++) {
        const x = r() * 480,
          y = 210 + r() * 60;
        p.ellipse(x, y, 2, 1, "#edc7bb");
      }
      lamp(p, 342, 211, 33, night);
      break;
    }
    case "window": {
      p.rect(0, 0, 480, 270, "#736f60");
      p.rect(66, 21, 348, 194, c.roof);
      p.rect(74, 29, 332, 177, "#c2c7c0");
      p.path("M74 159Q167 125 244 157Q330 136 406 159V206H74Z", "#8faba0");
      tree(p, 128, 184, 88, "#a5b4a7", 0, detail, recipe.seed);
      tree(p, 347, 187, 76, "#a5b4a7", 0, detail, recipe.seed + 1);
      p.rect(234, 29, 7, 177, c.cream);
      p.rect(74, 92, 332, 6, c.cream);
      p.rect(55, 206, 370, 14, c.cream);
      p.rect(0, 236, 480, 34, "#9a8b70");
      p.path("M28 15H74V196L38 172Z", "#bdb298");
      p.path("M406 15H452L440 178L406 196Z", "#bdb298");
      for (let i = 0; i < 3; i++)
        pot(p, 111 + i * 40, 202, 17, c.accent, detail);
      pot(p, 369, 230, 25, c.roof, detail);
      break;
    }
    case "terrace": {
      p.path("M0 201L105 168H415L480 198V225H0Z", c.cream);
      p.rect(0, 225, 480, 45, c.mid);
      p.path("M75 270L161 220H327L364 270Z", "#c3b98f");
      greenhouse(p, 113, 183, 146, 91, c, detail);
      p.path("M267 147L357 125L386 144L295 165Z", c.roof, c.dark, 1.5);
      for (let i = 0; i < 4; i++)
        p.line(
          282 + i * 21,
          144 - i * 5,
          303 + i * 21,
          160 - i * 5,
          c.cream,
          1,
        );
      p.line(319, 159, 319, 201, c.dark, 4);
      p.rect(79, 203, 330, 7, c.roof);
      for (let i = 0; i < 5; i++)
        pot(p, 98 + i * 37, 202, 10, c.accent, detail);
      tree(p, 439, 220, 72, season.leaves, season.canopy, detail, recipe.seed);
      p.rect(350, 211, 43, 7, c.roof);
      p.rect(355, 218, 4, 16, c.dark);
      p.rect(382, 218, 4, 16, c.dark);
      break;
    }
    case "transit": {
      p.path("M0 202L85 178H416L480 210V238H0Z", c.cream);
      p.path("M0 234H480V270H0Z", c.roof);
      p.line(0, 215, 480, 215, c.accent, 3);
      p.rect(123, 125, 6, 75, c.dark);
      p.rect(360, 125, 6, 75, c.dark);
      p.path("M91 127L130 102H360L397 127Z", c.roof);
      p.line(99, 128, 389, 128, c.light, 3);
      p.path(
        "M12 163Q8 137 38 137H104Q122 137 124 163V181H12Z",
        c.cream,
        c.dark,
        1.5,
      );
      p.rect(25, 146, 25, 18, c.water);
      p.rect(57, 146, 25, 18, c.water);
      p.rect(88, 147, 24, 17, c.water);
      p.rect(157, 176, 52, 5, c.roof);
      p.rect(163, 181, 3, 20, c.dark);
      p.rect(201, 181, 3, 20, c.dark);
      pot(p, 394, 194, 17, c.accent, detail);
      break;
    }
    case "archive": {
      p.path(
        "M75 214V75Q75 61 93 61H386Q403 61 403 78V214Z",
        c.roof,
        c.cream,
        3,
      );
      p.path("M88 211V82Q88 74 99 74H378Q390 74 390 85V211Z", c.dark);
      p.rect(235, 74, 6, 137, c.cream);
      for (let row = 0; row < 3; row++) {
        p.rect(97, 103 + row * 34, 284, 4, c.cream);
        for (let i = 0; i < 9; i++) {
          let x = 107 + i * 30;
          p.rect(x, 83 + row * 34, 15, 20, "#9bad94", c.water);
          p.ellipse(x + 7, 92 + row * 34, 3, 4, "#c5cf9e");
          if (detail > 0) p.rect(x + 4, 99 + row * 34, 7, 2, c.cream);
        }
      }
      p.path("M25 270L98 213H389L463 270Z", "#b4ae91");
      p.rect(155, 214, 82, 6, c.cream);
      p.rect(164, 220, 5, 23, c.dark);
      lamp(p, 352, 214, 36, true);
      break;
    }
    case "station": {
      greenhouse(p, 73, 195, 139, 81, c, detail);
      p.path("M252 109L347 122L337 129L261 117Z", c.roof);
      p.path("M303 126V154Q302 162 315 165", "none", c.cream, 5);
      p.rect(296, 162, 62, 45, c.roof, c.dark, 2);
      p.rect(304, 170, 45, 26, c.water);
      p.rect(307, 182, 39, 11, "#a2c3b1");
      p.line(329, 207, 329, 222, c.dark, 3);
      p.path("M39 244L92 209H376L440 244Z", c.cream);
      for (let i = 0; i < 4; i++)
        pot(p, 100 + i * 37, 220, 13, c.accent, detail);
      p.path("M357 215Q392 218 411 240", "none", c.roof, 3);
      break;
    }
    case "observatory": {
      p.path(
        "M0 225Q110 233 210 188Q295 152 391 174Q433 184 480 188V270H0Z",
        mix(c.mid, c.dark, 0.25),
      );
      p.path(
        "M158 270Q194 226 262 213Q312 206 327 190L341 191Q315 223 279 227Q230 243 215 270Z",
        c.cream,
      );
      p.path(
        "M187 193V154Q187 121 216 121Q245 121 245 154V193Z",
        c.cream,
        c.dark,
        2,
      );
      p.path("M177 149Q211 94 254 146Z", c.roof);
      p.rect(205, 158, 19, 24, c.water, c.roof, 2);
      p.line(220, 122, 234, 99, c.cream, 3);
      p.line(227, 101, 243, 108, c.cream, 6);
      tree(p, 424, 232, 74, season.leaves, 0.85, detail, recipe.seed);
      lamp(p, 268, 218, 27, true);
      break;
    }
    case "cottage": {
      p.path("M25 216Q154 167 364 187L448 218L393 246H81Z", c.roof);
      p.path("M42 214Q182 179 364 194L426 216L382 231H94Z", season.ground);
      p.rect(148, 140, 94, 62, c.cream);
      p.path("M135 141L190 102L254 141Z", c.roof);
      p.rect(169, 163, 19, 23, c.light, c.dark, 2);
      p.rect(212, 164, 18, 38, c.roof);
      greenhouse(p, 246, 199, 83, 68, c, detail);
      p.path("M107 206L155 206M116 202V220M142 202V220", "none", c.cream, 3);
      pot(p, 132, 207, 13, c.accent, detail);
      pot(p, 347, 210, 14, c.accent, detail);
      break;
    }
    case "repair": {
      p.rect(116, 128, 4, 88, c.dark);
      p.ellipse(118, 127, 5, 5, c.cream);
      p.path("M118 126L72 101L91 100L120 121Z", c.cream);
      p.path("M118 125L154 90L153 109L124 130Z", c.cream);
      p.path("M119 129L132 172L120 164L115 132Z", c.cream);
      p.path("M227 199V144H339L357 199Z", c.cream);
      p.path("M218 144L248 120H339L359 144Z", c.roof);
      p.rect(248, 160, 37, 25, c.water);
      p.rect(316, 168, 19, 31, c.roof);
      p.rect(171, 207, 81, 7, c.roof);
      p.line(180, 214, 177, 240, c.dark, 4);
      p.line(242, 214, 245, 240, c.dark, 4);
      p.ellipse(211, 204, 12, 4, c.cream);
      pot(p, 280, 222, 19, c.accent, detail);
      tree(p, 423, 221, 67, season.leaves, 0.7, detail, recipe.seed);
      break;
    }
    case "dock": {
      p.rect(0, 199, 480, 71, c.water);
      p.path("M0 224L138 205H319L407 252H0Z", c.roof);
      p.path("M0 218L141 199H319L407 246H0Z", c.cream);
      if (detail > 0)
        for (let i = 0; i < 10; i++)
          p.line(10 + i * 39, 217 - i * 1.5, 14 + i * 39, 246, c.roof, 1);
      p.path("M118 246V270M317 247V270", "none", c.dark, 5);
      p.path(
        "M354 179Q357 153 384 153H417Q439 153 444 179L429 197H366Z",
        c.cream,
        c.roof,
        2,
      );
      p.ellipse(400, 164, 13, 7, c.water);
      lamp(p, 151, 218, 59, true);
      p.rect(220, 209, 21, 18, c.accent, c.roof);
      p.line(229, 209, 229, 227, c.cream, 2);
      break;
    }
  }
  // Material detail is added at higher fidelities; not just more particles or scaling.
  if (detail > 0) {
    for (let i = 0; i < 55 + detail * 50; i++) {
      const x = r() * 480,
        y = 232 + r() * 38;
      p.rect(
        Math.floor(x),
        Math.floor(y),
        1 + r() * 2,
        1,
        mix(season.ground, c.cream, 0.25),
      );
    }
  }
  if (
    ["bridge", "shelter", "terrace", "path", "observatory", "repair"].includes(
      s.world,
    )
  ) {
    for (let i = 0; i < season.grass * (detail + 1); i++) {
      const x = r() * 480,
        y = 238 + r() * 32;
      p.path(`M${x} ${y}l-2 -4m2 4l2 -6`, "none", c.dark, 0.7);
    }
    for (let i = 0; i < season.flowers; i++) {
      const x = r() * 480,
        y = 237 + r() * 30;
      p.rect(x, y, 2, 2, "#e5c394");
    }
    for (let i = 0; i < season.litter; i++) {
      const x = r() * 480,
        y = 236 + r() * 34;
      p.path(`M${x} ${y}l3 -1l-1 3Z`, season.leaves);
    }
    for (let i = 0; i < season.buds; i++) {
      p.ellipse(26 + r() * 45, 139 + r() * 45, 2, 2, "#b8c29c");
    }
  }
  if (scene.weather === "fog")
    p.rect(0, 121, 480, 68, night ? "#afc0bb88" : "#e4ddc388");
  if (scene.weather === "storm") p.rect(0, 0, 480, 270, "#344b6038");
  return p.shapes;
}
export function buddyArt(
  id: BuddyId,
  action: State,
  time: number,
  fidelity: Fidelity,
  smooth = false,
): { shapes: Shape[]; transform: string; pose: ReturnType<typeof poseSample> } {
  const p = new Painter(),
    b = byBuddy(id),
    [dark, body, light, accent] = b.palette,
    q = poseSample(action, time, smooth, fidelity),
    detail = fidelity === "sketch" ? 0 : fidelity === "crafted" ? 1 : 2;
  const eyeY = q.rest ? 57 : 52,
    eye = (x: number) =>
      q.blink
        ? p.line(x - 2, eyeY, x + 2, eyeY, dark, 1.5)
        : p.ellipse(x, eyeY, 1.6, 2.3, dark);
  const feet = () => {
    p.path(`M33 75L30 ${83 + q.reach * 0.15}H43L42 75Z`, dark);
    p.path(`M54 75L55 83H68L64 75Z`, dark);
  };
  switch (id) {
    case "sprig":
      feet();
      p.path(
        "M28 56Q25 34 45 32Q68 31 70 56L67 72Q46 86 28 70Z",
        body,
        dark,
        1.5,
      );
      p.path(
        `M45 37Q22 ${18 - q.reach * 0.3} 23 9Q43 7 47 32Q50 12 72 18Q72 34 49 37Z`,
        light,
        dark,
        1.5,
      );
      p.line(46, 33, 29, 15, body, 1);
      p.line(51, 31, 66, 22, body, 1);
      p.path(
        `M30 57Q${16 - q.reach} ${55 - q.reach} 23 ${66 - q.reach}L32 66Z`,
        body,
        dark,
        1.3,
      );
      p.path(
        `M65 58Q${76 + q.reach} ${57 - q.reach} 72 ${67 - q.reach}L65 69Z`,
        body,
        dark,
        1.3,
      );
      p.path("M28 58Q44 77 65 73", "none", dark, 3);
      p.path("M59 64L77 61L79 77L61 80Z", accent, dark, 1.5);
      p.path("M59 64L69 72L77 61Z", light, dark, 1);
      eye(40);
      eye(55);
      if (detail > 0) p.ellipse(37, 60, 3, 1, "#d0b98b");
      if (detail > 1) {
        p.line(32, 69, 35, 71, light, 1);
        p.line(64, 75, 73, 73, dark, 1);
      }
      break;
    case "ember":
      feet();
      p.path("M32 35Q25 11 46 12Q64 12 64 34", "none", dark, 5);
      p.path("M27 43Q44 29 66 43L72 68Q49 85 25 68Z", body, dark, 2);
      p.path("M65 49L77 44L76 58L69 64Z", accent, dark, 1.5);
      p.path("M27 49Q12 41 14 56Q15 66 27 61", "none", dark, 4);
      p.path("M25 41L35 32H58L69 41Z", accent, dark, 1.5);
      p.rect(43, 27, 9, 5, dark);
      p.path("M35 64Q46 53 59 64V74H35Z", light, dark, 1.5);
      p.line(47, 60, 47, 74, accent, 1);
      eye(38);
      eye(57);
      if (detail > 1) {
        p.line(32, 46, 30, 54, light, 2);
        p.rect(39, 66, 4, 4, "#fff0bd");
      }
      break;
    case "pip":
      feet();
      p.path(
        "M31 38Q46 22 61 41L70 65Q63 81 41 78Q25 72 28 57Z",
        body,
        dark,
        1.5,
      );
      p.path(
        `M31 49Q${9 - q.reach} ${51 - q.reach} 5 26Q30 28 45 43L68 46L67 56L44 52Z`,
        accent,
        dark,
        1.5,
      );
      p.path("M51 54L75 63L84 53L78 74L52 61Z", light, dark, 1);
      eye(43);
      eye(57);
      if (detail > 0) p.path("M35 62Q44 66 50 64", "none", light, 2);
      if (detail > 1) p.line(11, 31, 28, 47, light, 1);
      break;
    case "sola":
      p.path("M39 74L35 83H45L48 76L55 83H67L58 73Z", dark);
      p.path("M39 38L57 38L62 72Q48 81 36 72Z", body, dark, 1.5);
      p.path("M17 32L23 14L45 9L70 16L80 33L60 42H34Z", light, dark, 1.5);
      p.path(
        "M45 11L45 35M24 16L36 36M68 18L56 37M20 30L76 30",
        "none",
        accent,
        1.5,
      );
      p.ellipse(48, 33, 10, 7, accent, dark, 1);
      p.path(
        `M38 54L${23 - q.reach} ${63 - q.reach}L29 ${68 - q.reach}L40 61Z`,
        body,
        dark,
        1,
      );
      p.path(
        `M59 54L${74 + q.reach} ${50 - q.reach}L78 ${57 - q.reach}L60 62Z`,
        body,
        dark,
        1,
      );
      eye(43);
      eye(54);
      if (detail > 1) {
        p.rect(43, 63, 12, 6, light);
        p.line(46, 63, 46, 69, accent, 1);
      }
      break;
    case "mote":
      p.path("M19 37Q13 15 37 12Q61 11 76 35Q87 62 61 68", "none", accent, 4);
      p.path("M29 37L55 29L70 42L66 65L37 68L25 53Z", body, dark, 1.5);
      p.path("M31 42L59 39L62 55L32 58Z", light, dark, 1);
      eye(40);
      eye(54);
      p.path(
        `M63 57L${78 + q.reach} ${65 - q.reach}L${81 + q.reach} ${54 - q.reach}`,
        "none",
        dark,
        3,
      );
      p.ellipse(81 + q.reach, 54 - q.reach, 3, 3, light, dark);
      p.line(42, 68, 40, 76, dark, 2);
      p.rect(30, 75, 26, 15, accent, dark);
      p.line(43, 75, 43, 90, light, 2);
      if (detail > 1) {
        p.rect(31, 32, 7, 4, accent);
        p.line(62, 32, 64, 25, light, 1);
        p.ellipse(64, 24, 2, 2, light);
      }
      break;
    case "lumen":
      p.path("M17 74L19 44L72 44L78 75L70 83H23Z", body, dark, 2);
      p.rect(13, 76, 68, 7, dark);
      p.path(
        `M16 44Q16 ${12 - q.reach} 47 ${12 - q.reach}Q77 ${12 - q.reach} 78 44Z`,
        accent,
        dark,
        2,
      );
      p.path(`M46 ${12 - q.reach}Q61 22 60 43L50 43Z`, light, dark, 1);
      p.path(
        `M43 44L${54 + q.reach} ${29 - q.reach}L${65 + q.reach} ${31 - q.reach}`,
        "none",
        dark,
        3,
      );
      p.path("M25 51Q33 45 40 51V63H25Z", light, dark, 1);
      p.path("M53 51Q61 45 68 51V63H53Z", light, dark, 1);
      eye(33);
      eye(61);
      p.path("M41 83V68Q47 62 53 68V83Z", dark);
      if (detail > 0) p.rect(43, 70, 8, 10, light);
      if (detail > 1) {
        p.line(22, 70, 34, 70, dark, 1);
        p.line(65, 68, 73, 68, dark, 1);
        p.ellipse(23, 41, 3, 2, light);
      }
      break;
  }
  return {
    shapes: p.shapes,
    transform: `translate(48 ${83 - q.lift}) rotate(${(q.lean * 180) / Math.PI}) translate(-48 -83)`,
    pose: q,
  };
}
export function weatherShapes(recipe: Recipe, time: number): Shape[] {
  const p = new Painter(),
    c = deriveScene(recipe.month, recipe.weather, recipe.seed),
    r = seeded(recipe.seed + 111);
  const t = Math.max(0, time);
  for (let i = 0; i < c.particles; i++) {
    const z = 0.4 + r() * 0.6,
      x = ((r() * 540 + t * c.wind * z) % 540) - 30,
      y = ((r() * 300 + t * (c.weather === "snow" ? 15 : 65) * z) % 300) - 15;
    if (
      ["rain", "storm", "mixed"].includes(c.weather) &&
      (c.weather !== "mixed" || i % 2 === 0)
    )
      p.line(x, y, x - 2, y + 7, "#c8dce0", 0.7);
    else if (c.weather === "snow" || c.weather === "mixed")
      p.rect(x, y, z > 0.7 ? 2 : 1, 1, "#f4ead5");
    else p.path(`M${x} ${y}l3 -1l-1 3Z`, "#d7a96c");
  }
  return p.shapes;
}
