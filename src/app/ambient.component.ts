import { Component } from "@angular/core";
@Component({
  selector: "app-ambient",
  host: { "aria-hidden": "true", class: "ambient" },
  template: `
    <div class="ambient-glow glow-one"></div>
    <div class="ambient-glow glow-two"></div>
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
export class AmbientComponent {
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
