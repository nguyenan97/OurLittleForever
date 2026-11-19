import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GalaxyComponent } from "./galaxy.component";
import { LetterComponent } from "./letter.component";
import { story } from "./content";

@Component({
  selector: "app-teachers-day",
  imports: [RouterLink, GalaxyComponent, LetterComponent],
  template: `
    <section class="teachers-hero">
      <app-galaxy
        ><span class="teachers-sky-note"
          >MỘT MÓN QUÀ NHỎ TỪ BÌNH AN</span
        ></app-galaxy
      >
      <div class="teachers-hero-copy">
        <span class="eyebrow light">NGÀY NHÀ GIÁO VIỆT NAM · 20.11.2026</span>
        <h1>
          Gửi người gieo chữ,<br /><em>cũng là người<br />Bình An thương.</em>
        </h1>
        <p>
          Chúc Thanh Tuyền một ngày 20/11 thật dịu dàng,<br />đầy ắp nụ cười và
          những điều ấm áp.
        </p>
        <button class="button cream" (click)="showLetter()">
          Có một lá thư gửi Thanh Tuyền
          <span aria-hidden="true">♡</span></button
        ><span class="teachers-hero-signature">Bình An, gửi Thanh Tuyền</span>
      </div>
    </section>
    <section class="wishes-section page-width section-space">
      <div class="center-heading">
        <span class="eyebrow"
          >HÔM NAY, NHỮNG ĐIỀU DỊU DÀNG DÀNH CHO THANH TUYỀN</span
        >
        <h2>
          Mong mỗi ngày đứng lớp,<br /><em
            >đều có một điều làm Thanh Tuyền vui.</em
          >
        </h2>
      </div>
      <div class="wishes-grid">
        <article>
          <span aria-hidden="true">✧</span>
          <h3>Niềm vui khi gieo chữ</h3>
          <p>
            Chúc những bài học tiếng Anh luôn có tiếng cười, và sự cố gắng của
            Thanh Tuyền được đáp lại bằng tiến bộ của học trò.
          </p>
        </article>
        <article>
          <span aria-hidden="true">❀</span>
          <h3>Một khoảng nghỉ cho mình</h3>
          <p>
            Giữa công việc văn phòng và những buổi dạy thêm, mong Thanh Tuyền
            vẫn có thời gian nghỉ ngơi, chăm sóc bản thân và làm những điều mình
            thích.
          </p>
        </article>
        <article>
          <span aria-hidden="true">♡</span>
          <h3>Thật nhiều điều ấm áp</h3>
          <p>
            Mong ngày hôm nay có những lời chúc chân thành, những nụ cười nhỏ,
            và cảm giác được trân trọng vì chính con người Thanh Tuyền.
          </p>
        </article>
      </div>
    </section>
    <section id="loi-chuc" class="teachers-letter">
      <div class="page-width letter-layout">
        <div>
          <span class="eyebrow">20 THÁNG 11 NĂM 2026</span>
          <h2>Sau buổi dạy,<br /><em>có một lời thương đợi.</em></h2>
          <p>Bình An để dành vài dòng ở đây.<br />Thanh Tuyền mở ra đọc nhé.</p>
          <div class="letter-dedication">
            Gửi riêng Thanh Tuyền <span aria-hidden="true">♡</span>
          </div>
        </div>
        <app-letter
          [title]="story.teachersLetter.title"
          [paragraphs]="story.teachersLetter.paragraphs"
        />
      </div>
    </section>
    <section class="gift-ending page-width">
      <span class="eyebrow">MỘT ĐÓA HOA NHỎ, MỘT LỜI CHÚC DÀI</span>
      <h2>Chúc Thanh Tuyền<br /><em>một ngày thật nhiều thương.</em></h2>
      <button class="button primary flower-button" (click)="sendFlowers()">
        {{ flowersSent() ? "Một bó thương đã gửi ♡" : "Nhận một bó thương" }}
      </button>
      <div
        class="flower-shower"
        aria-hidden="true"
        [class.play]="flowersSent()"
      >
        @for (flower of petals; track $index) {
          <span [style.--i]="$index">{{ flower }}</span>
        }
      </div>
      <p class="gift-feedback" aria-live="polite">
        {{
          flowersSent()
            ? "Từ Bình An, dành riêng cho Thanh Tuyền."
            : "Có một điều nho nhỏ dành cho Thanh Tuyền."
        }}
      </p>
      <a class="text-link" routerLink="/">Về câu chuyện của hai người</a>
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
  sendFlowers() {
    this.flowersSent.set(true);
  }
  showLetter() {
    document.getElementById("loi-chuc")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
}
