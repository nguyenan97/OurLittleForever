import { Component } from "@angular/core";
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";
import { AmbientComponent } from "./ambient.component";
import { LightboxComponent } from "./lightbox.component";

@Component({
  selector: "app-root",
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    AmbientComponent,
    LightboxComponent,
  ],
  template: `
    <app-ambient />
    <button class="skip-link" (click)="skipToContent()">
      Đến nội dung chính
    </button>
    <header class="site-header">
      <a class="brand" routerLink="/" aria-label="Anh và em, trang chủ"
        >A<span>&</span>T<i></i
      ></a>
      <span class="brand-note">NHỮNG NGÀY CÓ NHAU</span>
      <nav aria-label="Điều hướng chính">
        <a routerLink="/chuyen-minh">Chuyện mình</a>
        <a routerLink="/khoanh-khac">Khoảnh khắc</a>
        <a class="desktop-nav" routerLink="/loi-thuong">Lời thương</a>
        <a class="special-nav" routerLink="/20-11" routerLinkActive="active"
          >Dành cho 20/11 <span aria-hidden="true">✧</span></a
        >
      </nav>
    </header>
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-lightbox />
    <footer class="site-footer">
      <a class="brand" routerLink="/" aria-label="Trang chủ"
        >A<span>&</span>T</a
      >
      <p>Từ một lần gặp, thành một người thương.</p>
      <span>ANH & EM · TỪ MÙA THU 2026</span>
    </footer>
  `,
})
export class AppComponent {
  skipToContent() {
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: "instant" });
  }
}
