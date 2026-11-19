import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PhotoComponent } from "./photo.component";
import { GalaxyComponent } from "./galaxy.component";
import { LetterComponent } from "./letter.component";
import { story } from "./content";
@Component({
  selector: "app-teachers-day",
  imports: [RouterLink, PhotoComponent, GalaxyComponent, LetterComponent],
  template: `
    <section class="teachers-hero">
      <div class="teacher-backdrop">
        <app-photo
          id="portrait-window"
          [zoom]="false"
          sizes="100vw"
          [eager]="true"
        />
      </div>
      <app-galaxy />
      <div class="teachers-hero-inner page-width">
        <div class="teachers-hero-copy">
          <span class="eyebrow light">20.11.2026 · NGÀY NHÀ GIÁO VIỆT NAM</span>
          <h1>Gửi cô giáo<br /><em>anh thương.</em></h1>
          <p>Em gieo những con chữ.<br />Anh cất một lời thương dành cho em.</p>
          <button class="button cream" (click)="showLetter()">
            Hôm nay, có thư gửi em <span aria-hidden="true">♡</span></button
          ><span class="teachers-hero-signature"
            >Một chút dịu dàng, từ anh.</span
          >
        </div>
        <div class="teacher-portrait">
          <app-photo
            id="portrait-hero"
            sizes="(max-width:600px) 82vw, 35vw"
            [eager]="true"
          /><span>Hôm nay, mọi điều đẹp đẽ dành cho em.</span>
        </div>
      </div>
    </section>
    <section class="wishes-section page-width section-space">
      <div class="center-heading">
        <span class="eyebrow">MỘT NGÀY ĐỂ EM ĐƯỢC NHẬN LẠI YÊU THƯƠNG</span>
        <h2>
          Em cứ dịu dàng gieo chữ.<br /><em>Để anh thương em thêm một chút.</em>
        </h2>
      </div>
      <div class="wishes-grid">
        <article>
          <span aria-hidden="true">✧</span>
          <h3>Niềm vui trong từng bài học</h3>
          <p>
            Mong những điều em tận tâm dạy hôm nay sẽ trở thành một niềm tự hào
            thật đẹp nơi học trò.
          </p>
        </article>
        <article>
          <span aria-hidden="true">❀</span>
          <h3>Một khoảng nghỉ cho em</h3>
          <p>
            Giữa công việc và những buổi dạy, mong em vẫn đủ thảnh thơi để chăm
            mình, cười vui và làm điều em thích.
          </p>
        </article>
        <article>
          <span aria-hidden="true">♡</span>
          <h3>Một người để em tựa vào</h3>
          <p>
            Có hoa, có lời chúc, và có anh. Không chỉ hôm nay, mà cả những ngày
            chẳng có dịp gì.
          </p>
        </article>
      </div>
    </section>
    <section id="loi-chuc" class="teachers-letter">
      <div class="page-width letter-layout">
        <div>
          <span class="eyebrow">SAU BUỔI DẠY, CÓ MỘT LỜI THƯƠNG ĐỢI</span>
          <h2>Em nhận hoa nhé.<br /><em>Và nhận cả một trời thương.</em></h2>
          <p>
            Vài dòng thôi.<br />Nhưng là những điều anh muốn gửi em thật lòng.
          </p>
          <div class="letter-dedication">
            Gửi em, cô giáo của anh. <span aria-hidden="true">♡</span>
          </div>
        </div>
        <app-letter
          [title]="story.teachersLetter.title"
          [paragraphs]="story.teachersLetter.paragraphs"
        />
      </div>
    </section>
    <section class="teacher-memory page-width section-space">
      <div class="teacher-memory-photo">
        <app-photo id="date-flowers" sizes="(max-width:600px) 80vw, 37vw" />
      </div>
      <div>
        <span class="eyebrow">TỪ MỘT BÓ HOA, THÀNH THẬT NHIỀU THƯƠNG</span>
        <h2>Mong được tặng em hoa,<br /><em>thêm nhiều lần nữa.</em></h2>
        <p>
          Như điều anh đã viết trong lá thư đầu tiên.<br />Vẫn là điều anh mong,
          đến hôm nay.
        </p>
        <button
          class="button primary flower-button"
          (click)="flowersSent.set(true)"
        >
          {{
            flowersSent() ? "Gửi em cả một trời thương ♡" : "Nhận một bó thương"
          }}
        </button>
        <p class="gift-feedback" aria-live="polite">
          {{
            flowersSent()
              ? "Và một cái ôm thật lâu, từ anh."
              : "Hôm nay, em cứ nhận những điều dịu dàng nhé."
          }}
        </p>
      </div>
      <div
        class="flower-shower"
        [class.play]="flowersSent()"
        aria-hidden="true"
      >
        @for (flower of petals; track $index) {
          <span [style.--i]="$index">{{ flower }}</span>
        }
      </div>
    </section>
    <section class="gift-ending page-width">
      <span aria-hidden="true">❀</span>
      <h2>Chúc cô giáo của anh<br /><em>một ngày thật nhiều thương.</em></h2>
      <a class="text-link" routerLink="/">Về câu chuyện của mình</a>
    </section>
  `,
})
export class TeachersDayComponent {
  protected story = story;
  protected flowersSent = signal(false);
  protected petals = [
    "❀",
    "♡",
    "✧",
    "❀",
    "✿",
    "♡",
    "✧",
    "❀",
    "♡",
    "✿",
    "❀",
    "✧",
    "♡",
    "❀",
    "✿",
    "♡",
  ];
  showLetter() {
    document.getElementById("loi-chuc")?.scrollIntoView({ behavior: "smooth" });
  }
}
