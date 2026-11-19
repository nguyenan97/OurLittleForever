import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from "@angular/core";
import { lockModalScroll, unlockModalScroll } from "./modal-scroll";

@Component({
  selector: "app-letter",
  template: `
    <div class="letter-experience" [class.is-open]="opened()">
      <button
        #trigger
        class="envelope"
        (click)="open()"
        aria-label="Mở thư Bình An gửi Thanh Tuyền"
      >
        <span class="envelope-paper"
          ><span>Gửi Thanh Tuyền,</span
          ><i>Một chút thương, từ Bình An.</i></span
        >
        <span class="envelope-back"></span><span class="envelope-front"></span
        ><span class="envelope-flap"></span>
        <span class="wax-seal">A<span>&</span>T</span>
      </button>
      <span class="envelope-hint">Chạm vào dấu niêm phong để mở thư</span>
    </div>
    <dialog
      #letterDialog
      class="letter-dialog"
      aria-labelledby="letter-title"
      (click)="onBackdrop($event)"
      (close)="onClose()"
    >
      <button class="dialog-close" aria-label="Đóng thư" (click)="close()">
        ×
      </button>
      <article class="letter-paper">
        <span class="eyebrow">MỘT BỨC THƯ DÀNH RIÊNG CHO THANH TUYỀN</span>
        <h2 id="letter-title">{{ title() }}</h2>
        <span class="letter-divider" aria-hidden="true">✧</span>
        @for (paragraph of paragraphs(); track $index) {
          <p>{{ paragraph }}</p>
        }
        <div class="signature">
          <span>Thương gửi,</span><strong>Bình An</strong
          ><span class="signature-heart" aria-hidden="true">♡</span>
        </div>
      </article>
    </dialog>
  `,
})
export class LetterComponent implements OnDestroy {
  title = input.required<string>();
  paragraphs = input.required<readonly string[]>();
  protected opened = signal(false);
  @ViewChild("letterDialog") dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild("trigger") trigger!: ElementRef<HTMLButtonElement>;
  open() {
    this.opened.set(true);
    this.dialog.nativeElement.showModal();
    lockModalScroll();
  }
  close() {
    this.dialog.nativeElement.close();
  }
  onClose() {
    this.opened.set(false);
    unlockModalScroll();
    this.trigger.nativeElement.focus();
  }
  onBackdrop(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) this.close();
  }
  ngOnDestroy() {
    if (this.dialog?.nativeElement.open) unlockModalScroll();
  }
}
