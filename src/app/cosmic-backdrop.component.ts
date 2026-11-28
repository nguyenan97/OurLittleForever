import { afterNextRender, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { PhotoComponent } from "./photo.component";

@Component({
  selector: "app-cosmic-backdrop",
  imports: [PhotoComponent],
  host: { class: "cosmic-backdrop", "aria-hidden": "true" },
  template: `<app-photo class="forever-backdrop" id="portrait-gown" [zoom]="false" sizes="100vw" />
    <div class="cosmic-veil"></div><canvas #sky></canvas>`,
})
export class CosmicBackdropComponent implements OnDestroy {
  @ViewChild("sky", { static: true }) sky!: ElementRef<HTMLCanvasElement>;
  private cleanup?: () => void;
  constructor() {
    afterNextRender(() => {
      const canvas = this.sky.nativeElement;
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;
      const compact = matchMedia("(max-width:700px), (pointer:coarse)").matches;
      const reduced = matchMedia("(prefers-reduced-motion:reduce)");
      const stars = Array.from({length:compact ? 45 : 110}, (_, i) => ({
        x: ((i * 73.37 + 11) % 100) / 100, y: ((i * 37.71 + 4) % 100) / 100,
        radius: i % 7 === 0 ? 1.35 : .65, phase:i * 1.7,
      }));
      let width = 0, height = 0, frame = 0, last = 0, elapsed = 0, previous = 0;
      const resize = () => {
        width = innerWidth; height = innerHeight;
        const ratio = Math.min(devicePixelRatio, compact ? 1 : 1.5);
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      };
      const render = (time:number) => {
        frame = 0;
        if (document.hidden) return;
        frame = requestAnimationFrame(render);
        if (time - last < (compact ? 1000 / 30 : 1000 / 45)) return;
        const delta = previous ? Math.min((time - previous) / 1000, .1) : 0;
        elapsed += delta * (reduced.matches ? .15 : 1);
        last = previous = time;
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#f4ddbb";
        for (const star of stars) {
          const x = (star.x * width + Math.sin(elapsed * .035 + star.phase) * 12 + width) % width;
          const y = (star.y * height + elapsed * (star.radius + .5)) % height;
          context.globalAlpha = .2 + (Math.sin(elapsed * .6 + star.phase) + 1) * .22;
          context.beginPath(); context.arc(x, y, star.radius, 0, Math.PI * 2); context.fill();
        }
        context.globalAlpha = 1;
      };
      const visibility = () => {
        cancelAnimationFrame(frame); frame = 0; previous = last = 0;
        if (!document.hidden) frame = requestAnimationFrame(render);
      };
      resize(); visibility();
      window.addEventListener("resize", resize, {passive:true});
      document.addEventListener("visibilitychange", visibility);
      this.cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", visibility);
      };
    });
  }
  ngOnDestroy() { this.cleanup?.(); }
}
