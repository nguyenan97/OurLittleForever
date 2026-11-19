import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { PhotoComponent } from "./photo.component";
import { lockModalScroll, unlockModalScroll } from "./modal-scroll";
@Component({
  selector: "app-letter",
  imports: [PhotoComponent],
  template: `
    @if (compact()) {
      <button class="text-link letter-read" (click)="open()">
        Đọc lá thư <span aria-hidden="true">♡</span>
      </button>
    } @else {
      <div class="letter-experience">
        <button
          class="envelope"
          (click)="open()"
          aria-label="Mở thư anh gửi em"
        >
          <span class="envelope-art" aria-hidden="true"
            ><span class="envelope-paper"
              ><span>Gửi em thương,</span
              ><i>Vài dòng thôi, thật nhiều thương.</i></span
            ><span class="envelope-back"></span
            ><span class="envelope-front"></span
            ><span class="envelope-flap"></span
            ><span class="wax-seal">A<span>&</span>T</span></span
          ></button
        ><span class="envelope-hint"
          >Chạm vào dấu niêm phong, có lời thương bên trong.</span
        >
      </div>
    }
    <dialog
      #letterDialog
      class="letter-dialog"
      [attr.aria-labelledby]="headingId"
      (click)="backdrop($event)"
      (close)="closed()"
    >
      <button class="dialog-close" aria-label="Đóng thư" (click)="close()">
        ×
      </button>
      <article class="letter-paper">
        <span class="eyebrow">{{ from() }}</span>
        <h2 [id]="headingId">{{ title() }}</h2>
        <span class="letter-divider" aria-hidden="true">❀</span>
        @for (p of paragraphs(); track $index) {
          <p>{{ p }}</p>
        }
        @if (signature()) {
          <div class="signature"><strong>{{ signature() }}</strong></div>
        }
        @if (source(); as id) {
          <div class="original-letter">
            <span class="eyebrow">NÉT CHỮ NGÀY ẤY</span
            ><app-photo
              [id]="id"
              [zoom]="false"
              sizes="(max-width:600px) 85vw, 650px"
            />
          </div>
        }
      </article>
    </dialog>
  `,
})
export class LetterComponent implements OnDestroy {
  private static count = 0;
  protected headingId = "letter-title-" + LetterComponent.count++;
  title = input.required<string>();
  paragraphs = input.required<readonly string[]>();
  source = input<string>();
  compact = input(false);
  from = input("TỪ ANH, GỬI EM");
  signature = input("Thương em ♡\nBình An");
  @ViewChild("letterDialog") dialog!: ElementRef<HTMLDialogElement>;
  private trigger?: HTMLElement;
  open() {
    this.trigger = document.activeElement as HTMLElement;
    this.dialog.nativeElement.showModal();
    lockModalScroll();
  }
  close() {
    this.dialog.nativeElement.close();
  }
  closed() {
    unlockModalScroll();
    this.trigger?.focus({ preventScroll: true });
  }
  backdrop(e: MouseEvent) {
    if (e.target === this.dialog.nativeElement) this.close();
  }
  ngOnDestroy() {
    if (this.dialog?.nativeElement.open) unlockModalScroll();
  }
}
