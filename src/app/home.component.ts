import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PhotoComponent } from "./photo.component";
import { GalleryComponent } from "./gallery.component";
import { LetterComponent } from "./letter.component";
import { MemoryOrbitComponent } from "./memory-orbit.component";
import { GalaxyComponent } from "./galaxy.component";
import { PhotoboothComponent } from "./photobooth.component";
import { story } from "./content";
@Component({
  selector: "app-home",
  imports: [
    RouterLink,
    PhotoComponent,
    GalleryComponent,
    LetterComponent,
    MemoryOrbitComponent,
    GalaxyComponent,
    PhotoboothComponent,
  ],
  template: `
    <section class="love-hero">
      <div class="hero-wash" aria-hidden="true"></div>
      <div class="hero-inner page-width">
        <div class="hero-copy">
          <span class="eyebrow light">GỬI EM, MỘT CHÚT THƯƠNG ĐỂ DÀNH</span>
          <h1>
            Có em,<br />những ngày thường<br />cũng hóa <em>dịu dàng.</em>
          </h1>
          <p>Những ngày có em, anh cất ở đây.</p>
          <div class="hero-actions">
            <a class="button cream" routerLink="/chuyen-minh"
              >Xem kỷ niệm <span aria-hidden="true">♡</span></a
            ><a class="light-link" routerLink="/loi-thuong">Đọc thư</a>
          </div>
          <div class="hero-footnote">
            <span class="fine-line"></span>Từ một lần gặp, thành một người
            thương.
          </div>
        </div>
        <div class="hero-portraits">
          <span class="portrait-orbit orbit-outline-one"></span
          ><span class="portrait-orbit orbit-outline-two"></span>
          <div class="portrait-main">
            <app-photo
              id="portrait-hero"
              [eager]="true"
              sizes="(max-width:600px) 88vw, 43vw"
            />
            <div class="portrait-glint"></div>
          </div>
          <div class="hero-polaroid">
            <app-photo
              id="our-kiss"
              sizes="(max-width:600px) 150px, 210px"
            /><span>Thích nhất là có nhau.</span>
          </div>
          <span class="hero-spark spark-one" aria-hidden="true">✧</span
          ><span class="hero-spark spark-two" aria-hidden="true">✦</span
          ><span class="hero-art-note">EM, TRONG MẮT ANH.</span>
        </div>
      </div>
      <div class="hero-bottom">
        <span>ANH & EM</span><span>Chuyện mình còn nhiều trang để viết.</span
        ><span aria-hidden="true">♡</span>
      </div>
    </section>
    <section class="opening-quote page-width">
      <span class="eyebrow">THƯƠNG NHAU TỪ NHỮNG ĐIỀU NHỎ NHẤT</span>
      <h2>
        Chỉ cần mỗi lần nhìn lại,<br />vẫn thấy <em>mình đã thương nhau.</em>
      </h2>
      <p class="quote-thought">Có lẽ những điều đã qua đều có lý do của nó. Để đến một ngày, anh gặp em và muốn thương một người bằng tất cả chân thành.</p>
      <span class="quote-flower" aria-hidden="true">❀</span>
    </section>
    <section id="chuyen-minh" class="story-section page-width section-space">
      <div class="section-heading">
        <div>
          <span class="eyebrow">NHỮNG NGÀY ANH MUỐN NHỚ</span>
          <h2>Rồi mình thành <em>chúng mình.</em></h2>
        </div>
      </div>
      <div class="story-chapters">
        @for (moment of story.milestones; track moment.iso; let i = $index) {
          <article class="story-chapter" [class.reverse]="i % 2 === 1" [class.first-chapter]="i === 0">
            <div
              class="chapter-image"
              [class.letter-image]="moment.photo === 'first-letter'"
            >
              @if (moment.photo === 'first-letter') {
                <app-photo class="letter-photo-backdrop" id="portrait-window" [zoom]="false" sizes="480px" />
              }
              <app-photo
                [id]="moment.photo"
                sizes="(max-width:600px) 88vw, 48vw"
              /><span class="chapter-image-note">{{ moment.note }}</span>
            </div>
            <div class="chapter-copy">
              <time [attr.datetime]="moment.iso">{{ moment.date }}</time>
              <h3>{{ moment.title }}</h3>
              <p>{{ moment.text }}</p>
              <span class="chapter-heart" aria-hidden="true">♡</span>
            </div>
          </article>
        }
      </div>
    </section>
    <section class="heart-universe">
      <div class="center-heading">
        <span class="eyebrow light">GIỮA BAO NHIÊU NGƯỜI, ANH GẶP EM</span>
        <h2>Một chút vũ trụ.<br /><em>Thật nhiều thương em.</em></h2>
      </div>
      <app-galaxy class="heart-showcase" />
      <p>Trong những điều anh muốn giữ,<br />luôn có em.</p>
    </section>
    <section class="orbit-section">
      <div class="center-heading">
        <span class="eyebrow light">GIỮ THÊM MỘT CHÚT GẦN NHAU</span>
        <h2>Thế giới có thể quay.<br /><em>Anh vẫn muốn ở cạnh em.</em></h2>
      </div>
      <app-memory-orbit />
      <app-photobooth />
    </section>
    <section class="muse-section page-width section-space">
      <div class="muse-intro">
        <span class="eyebrow">MỘT PHIÊN BẢN EM, THẬT RIÊNG</span>
        <h2>Em của những<br /><em>miền dịu dàng.</em></h2>
        <span aria-hidden="true">✧</span>
      </div>
      <div class="muse-mosaic">
        <div class="muse-large">
          <app-photo id="portrait-light" sizes="(max-width:600px) 58vw, 30vw" />
        </div>
        <div class="muse-small">
          <app-photo
            id="portrait-balcony"
            sizes="(max-width:600px) 40vw, 22vw"
          />
        </div>
        <div class="muse-wide">
          <app-photo
            id="portrait-window"
            sizes="(max-width:600px) 85vw, 36vw"
          />
        </div>
      </div>
    </section>
    <section class="teachers-teaser">
      <div class="page-width teaser-inner">
        <div class="teaser-photo">
          <app-photo id="portrait-door" sizes="(max-width:600px) 70vw, 30vw" />
        </div>
        <div class="teaser-copy">
          <span class="eyebrow">20 THÁNG 11</span>
          <h2>Gửi cô giáo<br /><em>anh thương.</em></h2>
          <a class="button primary" routerLink="/20-11"
            >Đọc lời chúc 20/11 <span aria-hidden="true">♡</span></a
          >
        </div>
        <span class="teaser-flower" aria-hidden="true">♡</span>
      </div>
    </section>
    <section id="khoanh-khac" class="page-width section-space">
      <div class="section-heading">
        <div>
          <span class="eyebrow">CẤT LẠI NHỮNG ĐIỀU NHỎ XINH</span>
          <h2>Có nhau <em>trong khung hình.</em></h2>
        </div>
      </div>
      <app-gallery />
    </section>
    <section id="thu" class="letters-section section-space">
      <div class="page-width">
        <div class="section-heading">
          <div>
            <span class="eyebrow">NÉT CHỮ CỦA ANH, NHỮNG NGÀY CÓ EM</span>
            <h2>Giấy có thể cũ.<br /><em>Lời thương thì còn.</em></h2>
          </div>
        </div>
        <div class="letters-grid">
          @for (letter of story.letters; track letter.source) {
            <article class="letter-card">
              <app-photo class="letter-photo-backdrop" id="portrait-detail" [zoom]="false" sizes="480px" />
              <app-photo
                [id]="letter.source"
                sizes="(max-width:600px) 85vw, 28vw"
              />
              <div class="letter-card-copy">
                <time>{{ letter.date }}</time>
                <h3>{{ letter.title }}</h3>
                <p>{{ letter.excerpt }}</p>
                <app-letter
                  [title]="letter.title"
                  [paragraphs]="letter.paragraphs"
                  [source]="letter.source"
                  [compact]="true"
                  [from]="letter.from"
                  [signature]="letter.signature"
                />
              </div>
            </article>
          }
        </div>
      </div>
    </section>
    <section class="closing page-width">
      <span aria-hidden="true">♡</span>
      <h2>
        Anh không giữ được thời gian.<br /><em
          >Nên anh giữ những ngày có em.</em
        >
      </h2>
      <p>Mong những đêm giao thừa, những mùa Tết và những ngày lễ Tình nhân sau này,<br />người anh nắm tay vẫn là em.</p>
    </section>
  `,
})
export class HomeComponent {
  protected story = story;
}
