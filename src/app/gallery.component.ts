import { Component, computed, inject, signal } from "@angular/core";
import { MediaService } from "./media.service";
import { PhotoComponent } from "./photo.component";
@Component({
  selector: "app-gallery",
  imports: [PhotoComponent],
  template: `
    <div class="album-tabs" aria-label="Chọn bộ ảnh">
      <button
        [class.active]="category() === 'memory'"
        [attr.aria-pressed]="category() === 'memory'"
        (click)="category.set('memory')"
      >
        Những ngày có nhau</button
      ><button
        [class.active]="category() === 'portrait'"
        [attr.aria-pressed]="category() === 'portrait'"
        (click)="category.set('portrait')"
      >
        Em trong mắt anh
      </button>
    </div>
    <div class="photo-grid">
      @for (photo of collection(); track photo.id; let i = $index) {
        <figure class="gallery-photo" [class.gallery-featured]="i % 7 === 0">
          <app-photo [id]="photo.id" sizes="(max-width:600px) 46vw, 30vw" />
          <figcaption>
            {{ photo.caption }}<span>{{ photo.date }}</span>
          </figcaption>
        </figure>
      }
    </div>
  `,
})
export class GalleryComponent {
  private media = inject(MediaService);
  protected category = signal<"memory" | "portrait">("memory");
  protected collection = computed(() =>
    this.media.photos().filter((p) => p.category === this.category()),
  );
}
