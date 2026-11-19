import { afterNextRender, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { GalaxyComponent } from "./galaxy.component";
import { LetterComponent } from "./letter.component";
import { GalleryComponent } from "./gallery.component";
import { story, daysTogether } from "./content";

@Component({
  selector: "app-home",
  imports: [RouterLink, GalaxyComponent, LetterComponent, GalleryComponent],
  template: `
    <section class="home-hero page-width">
      <div class="hero-copy">
        <div class="eyebrow with-line">BÌNH AN & THANH TUYỀN</div>
        <h1>Một khoảng trời,<br />dành riêng cho<br /><em>chúng mình.</em></h1>
        <p>
          Có những ngày chỉ là một tấm ảnh.<br />Có những ngày, nhìn lại, là cả
          một khoảng thương.
        </p>
        <div class="hero-actions">
          <a class="button primary" routerLink="/chuyen-minh">Mở câu chuyện</a
          ><a class="text-link" routerLink="/loi-thuong"
            >Đọc một lời thương <span aria-hidden="true">♡</span></a
          >
        </div>
        <div class="together">
          <span class="tiny-heart" aria-hidden="true">♡</span>
          <div>
            <strong>{{ days }} ngày <span>kể từ khi có nhau</span></strong
            ><small>CÂU CHUYỆN BẮT ĐẦU TỪ 28.10.2026</small>
          </div>
        </div>
      </div>
      <div class="hero-art">
        <app-galaxy
          ><div class="scene-top">MỖI VÌ SAO, MỘT ĐIỀU THƯƠNG</div>
          <div class="scene-bottom">
            <span>Giữa một vũ trụ rộng lớn,</span
            ><strong>thật vui vì đã gặp nhau.</strong
            ><i>Bình An & Thanh Tuyền</i>
          </div></app-galaxy
        ><span class="orbit-note">MỘT CÂU CHUYỆN NHỎ · MỘT TÌNH YÊU RIÊNG</span
        ><span class="hero-date"
          >Từ ngày<br /><strong>28.10</strong><small>2026</small></span
        >
      </div>
    </section>
    <section id="chuyen-minh" class="story-section page-width section-space">
      <div class="section-heading">
        <div>
          <span class="eyebrow">TỪ MỘT LỜI CHÀO</span>
          <h2>Rồi thành <em>chúng mình.</em></h2>
        </div>
        <p>Những ngày đầu tiên,<br />những điều muốn nhớ thật lâu.</p>
      </div>
      <div class="timeline">
        @for (moment of story.milestones; track moment.iso) {
          <article class="milestone">
            <div class="timeline-node" aria-hidden="true">
              {{ moment.symbol }}
            </div>
            <time [attr.datetime]="moment.iso">{{ moment.date }}</time>
            <h3>{{ moment.title }}</h3>
            <p>{{ moment.text }}</p>
          </article>
        }
      </div>
    </section>
    <section class="teachers-teaser">
      <div class="page-width teaser-inner">
        <div class="teaser-date">20<span>tháng 11</span></div>
        <div class="teaser-copy">
          <span class="eyebrow">MỘT NGÀY ĐẶC BIỆT, MỘT NGƯỜI ĐẶC BIỆT</span>
          <h2>Gửi Thanh Tuyền,<br /><em>cô giáo Bình An thương.</em></h2>
          <p>
            Một chút dịu dàng dành cho Thanh Tuyền,<br />sau những giờ làm và
            những buổi đứng lớp.
          </p>
          <a class="button primary" routerLink="/20-11"
            >Mở món quà 20/11 <span aria-hidden="true">✧</span></a
          >
        </div>
        <div class="teaser-flower" aria-hidden="true">✳<span>♡</span></div>
      </div>
    </section>
    <section id="khoanh-khac" class="page-width section-space">
      <div class="section-heading">
        <div>
          <span class="eyebrow">CẤT LẠI NHỮNG ĐIỀU NHỎ BÉ</span>
          <h2>Khoảnh khắc <em>của hai người.</em></h2>
        </div>
        <p>
          Không cần một dịp thật lớn.<br />Chỉ cần có nhau trong khung hình.
        </p>
      </div>
      <app-gallery />
    </section>
    <section id="thu" class="home-letter section-space">
      <div class="page-width letter-layout">
        <div>
          <span class="eyebrow">CÓ NHỮNG ĐIỀU MUỐN NÓI</span>
          <h2>Một lá thư,<br /><em>nhiều hơn vài dòng.</em></h2>
          <p>
            Có những lời, Bình An muốn viết lại.<br />Để Thanh Tuyền có thể đọc
            bất cứ khi nào.
          </p>
        </div>
        <app-letter
          [title]="story.homeLetter.title"
          [paragraphs]="story.homeLetter.paragraphs"
        />
      </div>
    </section>
    <section class="closing page-width">
      <span aria-hidden="true">✧</span>
      <h2>Những trang đẹp nhất,<br /><em>mình cùng viết tiếp nhé.</em></h2>
      <p>Bình An & Thanh Tuyền</p>
    </section>
  `,
})
export class HomeComponent {
  private route = inject(ActivatedRoute);
  protected story = story;
  protected days = daysTogether();
  constructor() {
    afterNextRender(() => {
      const section = this.route.snapshot.data["section"] as string | undefined;
      if (section) {
        requestAnimationFrame(() => {
          document
            .getElementById(section)
            ?.scrollIntoView({ behavior: "instant" });
        });
      }
    });
  }
}
