import { byStudy, fidelitySizes, states, type Fidelity } from "./catalogue";
import {
  buddyArt,
  canvasShapes,
  landscape,
  svgShapes,
  weatherShapes,
} from "./art";
import { shouldRun, type Recipe } from "./model";

export interface RenderStats {
  active: number;
  scheduled: boolean;
  draws: number;
  time: number;
  instances: number;
  particles: number[];
}
export const stats: RenderStats = {
  active: 0,
  scheduled: false,
  draws: 0,
  time: 0,
  instances: 0,
  particles: [],
};
export class SharedClock {
  time = 0;
  manual = false;
  smooth = false;
  private raf = 0;
  private last = 0;
  private dead = false;
  private members = new Set<Specimen>();
  private reduced = matchMedia("(prefers-reduced-motion: reduce)");
  private visibility = () => this.schedule();
  private reduction = () => {
    if (this.reduced.matches) this.members.forEach((m) => m.render(this.time));
    this.schedule();
  };
  constructor() {
    document.addEventListener("visibilitychange", this.visibility);
    this.reduced.addEventListener("change", this.reduction);
  }
  add(member: Specimen) {
    if (this.members.size >= 2)
      throw Error("Maximum two active specimen renderers.");
    this.members.add(member);
    stats.active = this.members.size;
    member.render(this.time);
    this.schedule();
  }
  remove(member: Specimen) {
    this.members.delete(member);
    stats.active = this.members.size;
    this.schedule();
  }
  private tick = (now: number) => {
    this.raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;
    stats.time = this.time;
    for (const m of this.members) if (m.recipe.motion) m.render(this.time);
    this.schedule(false);
  };
  private schedule(reset = true) {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    const run = shouldRun(
      this.manual,
      this.reduced.matches,
      document.hidden,
      [...this.members].some((m) => m.recipe.motion),
      this.dead,
    );
    if (run) {
      if (reset) this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
    stats.scheduled = !!this.raf;
  }
  pause(value: boolean) {
    this.manual = value;
    this.schedule();
  }
  reset() {
    this.time = 0;
    stats.time = 0;
    for (const m of this.members) m.render(0);
    this.schedule();
  }
  refresh() {
    this.schedule();
  }
  get isReduced() {
    return this.reduced.matches;
  }
  dispose() {
    this.dead = true;
    for (const m of [...this.members]) m.dispose();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    stats.scheduled = false;
    document.removeEventListener("visibilitychange", this.visibility);
    this.reduced.removeEventListener("change", this.reduction);
  }
}
export interface Atlas {
  canvas: HTMLCanvasElement;
  cell: number;
  columns: number;
  rows: number;
  key: string;
}
// One atlas per active specimen. There is no unbounded global atlas cache.
export function makeAtlas(recipe: Recipe): Atlas {
  const cell = 96,
    columns = recipe.fidelity === "sketch" ? 3 : 8,
    rows = states.length,
    canvas = document.createElement("canvas");
  canvas.width = cell * columns;
  canvas.height = cell * rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas2D is unavailable.");
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < columns; col++) {
      ctx.save();
      ctx.translate(col * cell, row * cell);
      drawBuddy(ctx, recipe, states[row], (col / columns) * 4, false);
      ctx.restore();
    }
  return { canvas, cell, columns, rows, key: recipe.buddy + recipe.fidelity };
}
function drawBuddy(
  ctx: CanvasRenderingContext2D,
  recipe: Recipe,
  action = recipe.action,
  time = 0,
  smooth = recipe.smooth,
) {
  const art = buddyArt(recipe.buddy, action, time, recipe.fidelity, smooth),
    q = art.pose;
  ctx.save();
  ctx.translate(48, 83 - q.lift);
  ctx.rotate(q.lean);
  ctx.translate(-48, -83);
  canvasShapes(ctx, art.shapes);
  ctx.restore();
}
function background(recipe: Recipe) {
  const canvas = document.createElement("canvas");
  [canvas.width, canvas.height] = fidelitySizes[recipe.fidelity];
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas2D is unavailable.");
  ctx.scale(canvas.width / 480, canvas.height / 270);
  canvasShapes(ctx, landscape(recipe));
  ctx.resetTransform();
  return canvas;
}
export class Specimen {
  recipe: Recipe;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private bg?: HTMLCanvasElement;
  private svg?: SVGSVGElement;
  private actor?: SVGGElement;
  private weather?: SVGGElement;
  private atlas?: Atlas;
  private disposed = false;
  private lastPose = -1;
  constructor(
    private host: HTMLElement,
    recipe: Recipe,
    private clock: SharedClock,
  ) {
    this.recipe = { ...recipe };
    stats.instances++;
    try {
      this.initialize();
      clock.add(this);
    } catch {
      host.innerHTML =
        '<div class="canvas-fallback"><strong>This specimen needs a drawing surface.</strong><p>The HTML catalogue, controls and recipe export still work. Try a browser with Canvas2D enabled.</p></div>';
    }
  }
  private initialize() {
    this.host.replaceChildren();
    this.lastPose = -1;
    if (this.recipe.technique === "cutout") {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("viewBox", "0 0 480 270");
      this.svg.setAttribute("aria-hidden", "true");
      this.svg.innerHTML = `<g>${svgShapes(landscape(this.recipe))}</g><g data-actor></g><g data-weather></g>`;
      this.actor = this.svg.querySelector("[data-actor]")!;
      this.weather = this.svg.querySelector("[data-weather]")!;
      this.host.append(this.svg);
    } else {
      this.canvas = document.createElement("canvas");
      [this.canvas.width, this.canvas.height] =
        fidelitySizes[this.recipe.fidelity];
      this.canvas.setAttribute("aria-hidden", "true");
      this.ctx = this.canvas.getContext("2d") ?? undefined;
      if (!this.ctx) throw Error();
      this.bg = background(this.recipe);
      if (
        this.recipe.technique === "atlas" ||
        this.recipe.technique === "hybrid"
      )
        this.atlas = makeAtlas(this.recipe);
      this.host.append(this.canvas);
    }
  }
  render(time: number) {
    if (this.disposed) return;
    const recipe = this.recipe,
      s = byStudy(recipe.study)!,
      scale = recipe.buddy === "lumen" ? 0.86 : 0.76,
      x = s.anchor[0] * 480,
      y = s.anchor[1] * 270;
    const actionTime = recipe.motion ? time : 0;
    const columns = recipe.fidelity === "sketch" ? 3 : 8;
    const sample = Math.floor(((actionTime % 4) / 4) * columns);
    const weatherTime = recipe.motion ? time : 0;
    if (this.svg && this.actor && this.weather) {
      if (sample !== this.lastPose || recipe.smooth) {
        const art = buddyArt(
          recipe.buddy,
          recipe.action,
          actionTime,
          recipe.fidelity,
          recipe.smooth,
        );
        this.actor.innerHTML = `<g transform="translate(${x - 48 * scale} ${y - 83 * scale}) scale(${scale})"><ellipse cx="48" cy="83" rx="25" ry="4" fill="#2d4d4938"/><g transform="${art.transform}">${svgShapes(art.shapes)}</g></g>`;
        this.lastPose = sample;
      }
      this.weather.innerHTML = svgShapes(weatherShapes(recipe, weatherTime));
    }
    if (this.ctx && this.canvas && this.bg) {
      const ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.bg, 0, 0);
      ctx.scale(this.canvas.width / 480, this.canvas.height / 270);
      ctx.save();
      ctx.translate(x - 48 * scale, y - 83 * scale);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#2d4d4938";
      ctx.beginPath();
      ctx.ellipse(48, 83, 25, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      if (this.atlas) {
        const a = this.atlas,
          row = states.indexOf(recipe.action);
        if (recipe.smooth) {
          const pos = ((actionTime % 4) / 4) * a.columns,
            frac = pos - Math.floor(pos);
          ctx.globalAlpha = 1 - frac;
          ctx.drawImage(
            a.canvas,
            sample * a.cell,
            row * a.cell,
            a.cell,
            a.cell,
            0,
            0,
            96,
            96,
          );
          ctx.globalAlpha = frac;
          ctx.drawImage(
            a.canvas,
            ((sample + 1) % a.columns) * a.cell,
            row * a.cell,
            a.cell,
            a.cell,
            0,
            0,
            96,
            96,
          );
          ctx.globalAlpha = 1;
        } else
          ctx.drawImage(
            a.canvas,
            sample * a.cell,
            row * a.cell,
            a.cell,
            a.cell,
            0,
            0,
            96,
            96,
          );
      } else drawBuddy(ctx, recipe, recipe.action, actionTime);
      ctx.restore();
      canvasShapes(ctx, weatherShapes(recipe, weatherTime));
    }
    stats.draws++;
  }
  update(recipe: Recipe) {
    if (this.disposed) return;
    this.recipe = { ...recipe };
    this.atlas = undefined;
    this.bg = undefined;
    this.canvas = undefined;
    this.ctx = undefined;
    this.svg = undefined;
    this.initialize();
    this.render(this.clock.time);
    this.clock.refresh();
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.clock.remove(this);
    this.host.replaceChildren();
    this.atlas = undefined;
    this.bg = undefined;
    this.canvas = undefined;
    this.svg = undefined;
  }
}
export function thumbnail(recipe: Recipe): string {
  try {
    const canvas = background(recipe),
      ctx = canvas.getContext("2d")!,
      s = byStudy(recipe.study)!,
      scale = recipe.buddy === "lumen" ? 0.86 : 0.76;
    ctx.save();
    ctx.scale(canvas.width / 480, canvas.height / 270);
    ctx.translate(
      s.anchor[0] * 480 - 48 * scale,
      s.anchor[1] * 270 - 83 * scale,
    );
    ctx.scale(scale, scale);
    drawBuddy(ctx, recipe);
    ctx.restore();
    ctx.save();
    ctx.scale(canvas.width / 480, canvas.height / 270);
    canvasShapes(ctx, weatherShapes(recipe, 0));
    ctx.restore();
    return canvas.toDataURL("image/png");
  } catch {
    return (
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270"><rect width="480" height="270" fill="#c7ceba"/><text x="24" y="135" fill="#304f46">Canvas preview unavailable</text></svg>',
      )
    );
  }
}
export function characterSheet(
  id: Recipe["buddy"],
  fidelity: Fidelity = "rich",
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 112">${states
    .map((state, i) => {
      const a = buddyArt(
        id,
        state,
        state === "idle" || state === "rest" ? 0 : 1,
        fidelity,
      );
      return `<g transform="translate(${i * 96} 0)"><g transform="${a.transform}">${svgShapes(a.shapes)}</g><text x="48" y="106" text-anchor="middle" font-size="8" font-family="sans-serif" fill="#344c40">${state}</text></g>`;
    })
    .join("")}</svg>`;
}
