import { Component, computed, inject, input } from "@angular/core";
import { MediaService } from "./media.service";
@Component({
  selector: "app-photo",
  host: {
    class: "photo-frame",
    "[class.is-letter]": 'photo()?.category === "letter"',
  },
  template: `@if (photo(); as p) {
    <picture>
      <source type="image/avif" [attr.srcset]="avif()" [attr.sizes]="sizes()" />
      <img
        [src]="media.url(p.thumbnail)"
        [attr.srcset]="webp()"
        [attr.sizes]="sizes()"
        [width]="p.width"
        [height]="p.height"
        [alt]="p.caption"
        [style.object-position]="p.position"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="eager() ? 'high' : 'auto'"
        decoding="async"
      />
    </picture>
    @if (zoom()) {
      <button
        class="photo-zoom"
        [attr.aria-label]="'Xem ảnh: ' + p.caption"
        (click)="media.open(p.id)"
      >
        <span aria-hidden="true">＋</span>
      </button>
    }
  }`,
})
export class PhotoComponent {
  protected media = inject(MediaService);
  id = input.required<string>();
  sizes = input("(max-width: 600px) 85vw, 40vw");
  eager = input(false);
  zoom = input(true);
  protected photo = computed(() =>
    this.media.photos().find((p) => p.id === this.id()),
  );
  protected webp = computed(() =>
    this.photo()
      ?.variants.map((v) => `${this.media.url(v.webp)} ${v.width}w`)
      .join(","),
  );
  protected avif = computed(() =>
    this.photo()
      ?.variants.map((v) => `${this.media.url(v.avif)} ${v.width}w`)
      .join(","),
  );
}
