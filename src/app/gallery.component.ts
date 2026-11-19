import {
  afterNextRender,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from "@angular/core";
import { lockModalScroll, unlockModalScroll } from "./modal-scroll";

interface Photo {
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

@Component({
  selector: "app-gallery",
  template: `
    @if (photos().length) {
      <div class="photo-grid">
        @for (photo of photos(); track photo.src; let i = $index) {
          <button
            class="photo-card"
            (click)="open(i, $event)"
            [attr.aria-label]="'Xem ảnh ' + (i + 1)"
          >
            <img
              [src]="photo.thumbnail"
              [alt]="photo.alt"
              [width]="photo.width"
              [height]="photo.height"
              loading="lazy"
            />
            <span>{{ photo.caption || "Một khoảnh khắc của chúng mình" }}</span>
          </button>
        }
      </div>
    } @else {
      <div class="album-empty">
        <div class="empty-polaroids" aria-hidden="true">
          <div class="empty-polaroid back"><span>✧</span></div>
          <div class="empty-polaroid front">
            <span>♡</span><i>Những ngày có nhau</i>
          </div>
        </div>
        <div>
          <span class="eyebrow">CÒN THẬT NHIỀU NGÀY PHÍA TRƯỚC</span>
          <h3>Để dành cho những<br />khoảnh khắc của mình.</h3>
          <p>
            Một chỗ nhỏ cho những tấm ảnh, những buổi hẹn<br
              class="desktop-break"
            />
            và những điều cả hai muốn giữ lại.
          </p>
        </div>
      </div>
    }
    <dialog
      #viewer
      class="photo-dialog"
      aria-label="Ảnh kỷ niệm của Bình An và Thanh Tuyền"
      (click)="backdrop($event)"
      (close)="closed()"
      (keydown.arrowleft)="move(-1)"
      (keydown.arrowright)="move(1)"
      (touchstart)="touchStart($event)"
      (touchend)="touchEnd($event)"
    >
      <button class="dialog-close" aria-label="Đóng ảnh" (click)="close()">
        ×
      </button>
      @if (selected(); as photo) {
        <img [src]="photo.src" [alt]="photo.alt" />
        <p>
          {{ index() + 1 }} / {{ photos().length }} ·
          {{ photo.caption || "Bình An & Thanh Tuyền" }}
        </p>
      }
      <div class="photo-controls">
        <button (click)="move(-1)" aria-label="Ảnh trước">Trước</button
        ><button (click)="move(1)" aria-label="Ảnh tiếp theo">Tiếp</button>
      </div>
    </dialog>
  `,
})
export class GalleryComponent implements OnDestroy {
  protected photos = signal<Photo[]>([]);
  protected index = signal(0);
  protected selected = signal<Photo | null>(null);
  private previousFocus?: HTMLElement;
  private startX = 0;
  private startY = 0;
  private singleTouch = false;
  private request = new AbortController();
  @ViewChild("viewer") viewer!: ElementRef<HTMLDialogElement>;
  constructor() {
    afterNextRender(() => {
      fetch(new URL("media/manifest.json", document.baseURI), {
        signal: this.request.signal,
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((photos: Photo[]) =>
          this.photos.set(
            Array.isArray(photos)
              ? photos.map((photo) => ({
                  ...photo,
                  src: new URL(photo.src.replace(/^\//, ""), document.baseURI)
                    .href,
                  thumbnail: new URL(
                    photo.thumbnail.replace(/^\//, ""),
                    document.baseURI,
                  ).href,
                }))
              : [],
          ),
        )
        .catch(() => {});
    });
  }
  open(index: number, event: Event) {
    this.previousFocus = event.currentTarget as HTMLElement;
    this.index.set(index);
    this.selected.set(this.photos()[index]);
    this.viewer.nativeElement.showModal();
    lockModalScroll();
  }
  close() {
    this.viewer.nativeElement.close();
  }
  closed() {
    unlockModalScroll();
    this.previousFocus?.focus();
  }
  backdrop(event: MouseEvent) {
    if (event.target === this.viewer.nativeElement) this.close();
  }
  move(direction: number) {
    const count = this.photos().length;
    if (!count) return;
    const next = (this.index() + direction + count) % count;
    this.index.set(next);
    this.selected.set(this.photos()[next]);
  }
  touchStart(event: TouchEvent) {
    this.singleTouch = event.touches.length === 1;
    this.startX = event.changedTouches[0].clientX;
    this.startY = event.changedTouches[0].clientY;
  }
  touchEnd(event: TouchEvent) {
    const distance = event.changedTouches[0].clientX - this.startX;
    const vertical = event.changedTouches[0].clientY - this.startY;
    if (
      this.singleTouch &&
      Math.abs(distance) > 55 &&
      Math.abs(distance) > Math.abs(vertical)
    )
      this.move(distance < 0 ? 1 : -1);
  }
  ngOnDestroy() {
    this.request.abort();
    if (this.viewer?.nativeElement.open) unlockModalScroll();
  }
}
