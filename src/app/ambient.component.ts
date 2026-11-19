import { Component, HostListener, OnDestroy, signal } from "@angular/core";
@Component({
  selector: "app-ambient",
  host: { "aria-hidden": "true", class: "ambient" },
  template: `
    <div class="ambient-glow glow-one"></div>
    <div class="ambient-glow glow-two"></div>
    @for (heart of hearts; track $index) {
      <span class="floating-heart" [style.--x]="heart.x + '%'" [style.--delay]="heart.delay + 's'" [style.--duration]="heart.duration + 's'">{{ $index % 2 ? '♡' : '♥' }}</span>
    }
    @for (heart of bursts(); track heart.id) {
      <span class="touch-heart" [style.left]="heart.x + 'px'" [style.top]="heart.y + 'px'" [style.--drift]="heart.drift + 'px'">♡</span>
    }
    @for (petal of petals; track $index) {
      <i
        class="petal"
        [style.--left]="petal.left + '%'"
        [style.--delay]="petal.delay + 's'"
        [style.--duration]="petal.duration + 's'"
        [style.--size]="petal.size + 'px'"
        [style.--drift]="petal.drift + 'px'"
      ></i>
    }
    @for (star of stars; track $index) {
      <span
        class="twinkle"
        [style.left]="star.left + '%'"
        [style.top]="star.top + '%'"
        [style.animation-delay]="star.delay + 's'"
        >✧</span
      >
    }
  `,
})
export class AmbientComponent implements OnDestroy {
  protected hearts = Array.from({ length: 9 }, (_, i) => ({ x: (i * 29 + 7) % 98, delay: -i * 3.1, duration: 20 + i % 6 }));
  protected bursts = signal<{id:number;x:number;y:number;drift:number}[]>([]);
  private serial = 0;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  @HostListener("document:pointerdown", ["$event"]) scatter(event: PointerEvent) {
    if ((event.target as HTMLElement).closest('video,dialog,button,a,input')) return;
    const batch = Array.from({length:5}, (_, i) => ({id:this.serial++,x:event.clientX,y:event.clientY,drift:(i-2)*26}));
    this.bursts.update(current => [...current.slice(-15), ...batch]);
    const timer = setTimeout(() => { this.bursts.update(current => current.filter(h => !batch.some(b => b.id === h.id))); this.timers.delete(timer); }, 1800);
    this.timers.add(timer);
  }
  ngOnDestroy() { this.timers.forEach(clearTimeout); }
  protected petals = Array.from({ length: 18 }, (_, i) => ({
    left: (i * 37) % 103,
    delay: -i * 1.7,
    duration: 15 + (i % 7),
    size: 7 + (i % 6),
    drift: 35 + (i % 5) * 18,
  }));
  protected stars = Array.from({ length: 11 }, (_, i) => ({
    left: (i * 23 + 5) % 99,
    top: (i * 31 + 9) % 96,
    delay: -i * 0.8,
  }));
}
