import { afterNextRender, Injectable, OnDestroy } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MotionService implements OnDestroy {
  private observer?: IntersectionObserver;
  private mutations?: MutationObserver;
  private tracked = new Set<Element>();
  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(entries => {
        for (const entry of entries) entry.target.classList.toggle("motion-outside", !entry.isIntersecting);
      }, { rootMargin: "100px" });
      const scan = () => {
        for (const element of this.tracked) {
          if (!element.isConnected) { this.observer?.unobserve(element); this.tracked.delete(element); }
        }
        document.querySelectorAll("main section, .story-chapter, .gallery-photo").forEach(element => {
          if (this.tracked.has(element)) return;
          this.tracked.add(element);
          this.observer?.observe(element);
        });
      };
      scan();
      this.mutations = new MutationObserver(scan);
      const main = document.querySelector("main");
      if (main) this.mutations.observe(main, { childList: true, subtree: true });
      document.addEventListener("visibilitychange", this.visibility);
      this.visibility();
    });
  }
  private visibility = () => document.documentElement.classList.toggle("motion-hidden", document.hidden);
  ngOnDestroy() {
    this.observer?.disconnect();
    this.mutations?.disconnect();
    document.removeEventListener("visibilitychange", this.visibility);
    document.documentElement.classList.remove("motion-hidden");
  }
}
