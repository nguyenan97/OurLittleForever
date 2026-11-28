import { afterNextRender, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from "@angular/core";
import { MediaService } from "./media.service";
interface MemoryVideo { id: string; caption: string; src: string; poster: string; hasAudio: boolean; }
@Component({
  selector: "app-photobooth",
  template: `<div #stage class="photobooth page-width">
    <div class="photobooth-copy"><span class="eyebrow light">MÌNH, THẬT DỄ THƯƠNG</span><h3>Thêm một lần<br /><em>cười bên nhau.</em></h3><span class="booth-doodle" aria-hidden="true">♡ &nbsp; ✧ &nbsp; ♡</span></div>
    <div class="booth-scrapbook">
      @for (video of videos(); track video.id) {
        <figure class="video-memory" [class.booth-video]="video.id === 'photobooth'" [class.meeting-video]="video.id !== 'photobooth'">
          <div class="video-window">
          <video controls loop playsinline preload="none" [attr.data-video]="video.id" [attr.src]="near() ? media.url(video.src) : null" [poster]="media.url(video.poster)" [attr.aria-label]="video.caption" (play)="pauseOthers($event)">
            Trình duyệt chưa phát được video này.
          </video>
          @if (!started().includes(video.id)) {
            <button class="video-cover" (click)="play(video.id)" [attr.aria-label]="'Phát video: ' + video.caption"><img [src]="media.url(video.poster)" alt="" loading="lazy" /><span><i aria-hidden="true">▷</i>{{ video.id === 'photobooth' ? 'Xem photobooth' : 'Xem kỷ niệm' }}</span></button>
          }
          </div><figcaption>{{ video.id === 'photobooth' ? '08.11 · Photobooth' : 'Lần đầu mình gặp nhau' }}@if (!video.hasAudio) { <span class="video-sound-note">Không tiếng</span> }</figcaption>
        </figure>
      }
    </div>
  </div>`,
})
export class PhotoboothComponent implements OnDestroy {
  @ViewChild("stage", { static: true }) stage!: ElementRef<HTMLElement>;
  protected media = inject(MediaService);
  protected videos = signal<MemoryVideo[]>([]);
  protected near = signal(false);
  protected started = signal<string[]>([]);
  private observer?: IntersectionObserver;
  private destroyed = false;
  constructor() {
    afterNextRender(() => {
      fetch(this.media.url("media/videos.json"), { cache: "no-cache" }).then(r => r.ok ? r.json() : []).then(v => { if (!this.destroyed) this.videos.set(v); }).catch(() => {});
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) this.near.set(true);
        else this.stage.nativeElement.querySelectorAll("video").forEach(v => v.pause());
      }, { rootMargin: "200px" });
      this.observer.observe(this.stage.nativeElement);
      document.addEventListener("visibilitychange", this.visibility);
      document.addEventListener("piano-play", this.pauseAll);
    });
  }
  protected play(id: string) {
    const video = Array.from(this.stage.nativeElement.querySelectorAll("video")).find(v => v.dataset["video"] === id);
    if (video) void video.play().catch(() => this.started.update(ids => ids.filter(value => value !== id)));
  }
  protected pauseOthers(event: Event) {
    const current = event.target as HTMLVideoElement;
    const id = current.dataset["video"]!;
    this.started.update(ids => ids.includes(id) ? ids : [...ids,id]);
    document.dispatchEvent(new Event("memory-video-play"));
    this.stage.nativeElement.querySelectorAll("video").forEach(v => { if (v !== current) v.pause(); });
  }
  private visibility = () => { if (document.hidden) this.stage.nativeElement.querySelectorAll("video").forEach(v => v.pause()); };
  private pauseAll = () => this.stage.nativeElement.querySelectorAll("video").forEach(v => v.pause());
  ngOnDestroy() { this.destroyed = true; this.observer?.disconnect(); document.removeEventListener("visibilitychange", this.visibility); document.removeEventListener("piano-play", this.pauseAll); }
}
