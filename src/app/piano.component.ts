import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from "@angular/core";
import { MediaService } from "./media.service";
@Component({
  selector: "app-piano",
  template: `<audio #piano loop preload="none" (error)="failed()"></audio>
    <button class="music-toggle" [class.playing]="playing()" [attr.aria-pressed]="playing()" [disabled]="starting()" (click)="toggle()">
      <span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>
      {{ playing() ? 'Tắt nhạc' : 'Bật nhạc' }}<span class="music-label"> · piano</span>
    </button><span class="sr-only" aria-live="polite">{{ status() }}</span>`,
})
export class PianoComponent implements OnDestroy {
  @ViewChild("piano", { static:true }) piano!: ElementRef<HTMLAudioElement>;
  protected url = inject(MediaService).url("media/audio/piano-v1.mp3");
  protected playing = signal(false);
  protected starting = signal(false);
  protected status = signal("");
  private resumeOnVisible = false;
  constructor() { document.addEventListener("visibilitychange", this.visibility); }
  async toggle() {
    const audio = this.piano.nativeElement;
    if (this.playing()) { audio.pause(); this.playing.set(false); this.resumeOnVisible=false; return; }
    this.starting.set(true);
    if (!audio.getAttribute("src")) audio.src = this.url;
    audio.volume = 0.45;
    try { await audio.play(); this.playing.set(true); this.status.set("Piano đang phát nhẹ"); }
    catch { this.failed(); }
    finally { this.starting.set(false); }
  }
  protected failed() { this.playing.set(false); this.status.set("Chạm bật nhạc lại để nghe piano."); }
  private visibility = () => {
    const audio=this.piano.nativeElement;
    if (document.hidden) { this.resumeOnVisible=this.playing(); audio.pause(); }
    else if (this.resumeOnVisible) { this.resumeOnVisible=false; void audio.play().catch(() => this.failed()); }
  };
  ngOnDestroy() { document.removeEventListener("visibilitychange",this.visibility); this.piano?.nativeElement.pause(); }
}
