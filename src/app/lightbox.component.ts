import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
} from "@angular/core";
import { MediaService } from "./media.service";
import { lockModalScroll, unlockModalScroll } from "./modal-scroll";
@Component({
  selector: "app-lightbox",
  template: ` <dialog
    #viewer
    class="photo-dialog"
    aria-label="Ảnh của chúng mình"
    (click)="backdrop($event)"
    (close)="closed()"
    (keydown.arrowleft)="media.move(-1)"
    (keydown.arrowright)="media.move(1)"
    (touchstart)="touchStart($event)"
    (touchend)="touchEnd($event)"
  >
    <button class="dialog-close" (click)="media.close()" aria-label="Đóng ảnh">
      ×
    </button>
    @if (media.active(); as p) {
      <img
        [src]="media.url(p.src)"
        [alt]="p.caption"
        [class.document-photo]="p.category === 'letter'"
      />
      <p>
        {{ p.caption }}
        @if (p.date) {
          <span>· {{ p.date }}</span>
        }
      </p>
    }
    <div class="photo-controls">
      <button (click)="media.move(-1)" aria-label="Ảnh trước">Trước</button
      ><button (click)="media.move(1)" aria-label="Ảnh tiếp theo">Tiếp</button>
    </div>
  </dialog>`,
})
export class LightboxComponent {
  protected media = inject(MediaService);
  @ViewChild("viewer") viewer?: ElementRef<HTMLDialogElement>;
  private previousFocus?: HTMLElement;
  private x = 0;
  private y = 0;
  private single = false;
  constructor() {
    effect(() => {
      const photo = this.media.active(),
        dialog = this.viewer?.nativeElement;
      if (!dialog) return;
      if (photo && !dialog.open) {
        this.previousFocus = document.activeElement as HTMLElement;
        dialog.showModal();
        lockModalScroll();
      }
      if (!photo && dialog.open) dialog.close();
    });
  }
  closed() {
    unlockModalScroll();
    this.media.close();
    this.previousFocus?.focus({ preventScroll: true });
  }
  backdrop(event: MouseEvent) {
    if (event.target === this.viewer?.nativeElement) this.media.close();
  }
  touchStart(e: TouchEvent) {
    this.single = e.touches.length === 1;
    this.x = e.changedTouches[0].clientX;
    this.y = e.changedTouches[0].clientY;
  }
  touchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.x,
      dy = e.changedTouches[0].clientY - this.y;
    if (this.single && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy))
      this.media.move(dx < 0 ? 1 : -1);
  }
}
