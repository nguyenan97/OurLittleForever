import { Component, HostListener, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PianoComponent } from "./piano.component";
import { NavigationSkipped, Router, RouterLink, RouterOutlet, RouterLinkActive, Scroll } from "@angular/router";
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
        <a routerLink="/">Chuyện mình</a>
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
    <nav class="mobile-chapters" aria-label="Đi nhanh giữa các trang"><a routerLink="/">Chuyện mình</a><a routerLink="/khoanh-khac">Ảnh</a><a routerLink="/loi-thuong">Thư</a><a routerLink="/20-11">20/11 ♡</a></nav>
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
  private router = inject(Router);
  protected progress = signal(0);
  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof Scroll && !event.position) this.scrollToRoute("instant");
      if (event instanceof NavigationSkipped) this.scrollToRoute("smooth");
    });
  }
  @HostListener("window:scroll") updateProgress() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    this.progress.set(distance > 0 ? scrollY / distance : 0);
  }
  toTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  private scrollToRoute(behavior: ScrollBehavior) {
    // Run after the router's own scrolling, once the routed view is rendered.
    requestAnimationFrame(() => {
      const sections: Record<string,string> = { "chuyen-minh":"chuyen-minh", "khoanh-khac":"khoanh-khac", "loi-thuong":"thu" };
      const section = sections[this.router.url.split("/").filter(Boolean).at(-1) || ""];
      if (section) document.getElementById(section)?.scrollIntoView({ behavior });
      else window.scrollTo({ top:0, behavior });
    });
  }
  skipToContent() {
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: "instant" });
  }
}
