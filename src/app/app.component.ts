import { Component, HostListener, signal } from "@angular/core";
import { PianoComponent } from "./piano.component";
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
    PianoComponent,
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
    <div class="reading-progress" aria-hidden="true" [style.transform]="'scaleX(' + progress() + ')' "></div>
    <div class="floating-tools"><app-piano /><button class="back-top" [class.visible]="progress() > 0.025" (click)="toTop()" aria-label="Về đầu trang">Lên đầu <span aria-hidden="true">⌃</span></button></div>
    <nav class="mobile-chapters" aria-label="Đi nhanh giữa các trang"><a routerLink="/chuyen-minh">Chuyện mình</a><a routerLink="/khoanh-khac">Ảnh</a><a routerLink="/loi-thuong">Thư</a><a routerLink="/20-11">20/11 ♡</a></nav>
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
  protected progress = signal(0);
  @HostListener("window:scroll") updateProgress() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    this.progress.set(distance > 0 ? scrollY / distance : 0);
  }
  toTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  @HostListener("document:click", ["$event"]) revisit(event: MouseEvent) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor || anchor.target === "_blank") return;
    const target = new URL(anchor.href);
    if (target.origin !== location.origin || target.pathname.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
    const sections: Record<string,string> = { "chuyen-minh":"chuyen-minh", "khoanh-khac":"khoanh-khac", "loi-thuong":"thu" };
    const section = sections[target.pathname.split("/").filter(Boolean).at(-1) || ""];
    if (section) document.getElementById(section)?.scrollIntoView({ behavior:"smooth" });
    else this.toTop();
  }
  skipToContent() {
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: "instant" });
  }
}
