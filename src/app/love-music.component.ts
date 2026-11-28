import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from "@angular/core";
import { MediaService } from "./media.service";

interface MusicTrack { title:string; performer:string; src:string; duration:number; }

@Component({
  selector: "app-love-music",
  template: `
    <audio #player loop preload="none" (play)="played()" (pause)="playing.set(false)" (error)="failed()"></audio>
    <button class="music-toggle" [class.playing]="playing()" [attr.aria-pressed]="playing()" [disabled]="starting() || !track()" [title]="track()?.title || 'Nhạc tình ca'" (click)="toggle()">
      <span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>
      {{ playing() ? 'Tắt nhạc' : 'Bật nhạc' }}
      <span class="music-track-title">{{ track()?.title }}</span>
    </button><span class="sr-only" aria-live="polite">{{ status() }}</span>`,
})
export class LoveMusicComponent implements OnDestroy {
  @ViewChild("player", {static:true}) player!: ElementRef<HTMLAudioElement>;
  protected playing = signal(false);
  protected starting = signal(false);
  protected track = signal<MusicTrack | null>(null);
  protected status = signal("");
  private media = inject(MediaService);
  private destroyed = false;
  constructor() {
    fetch(this.media.url("media/music.json"), {cache:"no-cache"}).then(r => {
      if (!r.ok) throw new Error("Missing music");
      return r.json();
    }).then(track => {if (!this.destroyed) this.track.set(track);}).catch(() => this.status.set("Nhạc chưa tải được."));
    document.addEventListener("memory-video-play", this.pause);
    document.addEventListener("visibilitychange", this.visibility);
  }
  async toggle() {
    if (this.playing()) { this.pause(); return; }
    const track = this.track();
    if (!track) return;
    const audio = this.player.nativeElement;
    if (!audio.getAttribute("src")) audio.src = this.media.url(track.src);
    audio.volume = .42;
    this.starting.set(true);
    try { await audio.play(); } catch { this.failed(); }
    finally { this.starting.set(false); }
  }
  protected played() {
    this.playing.set(true);
    this.status.set(`${this.track()?.title} đang phát.`);
    document.dispatchEvent(new Event("piano-play"));
  }
  protected failed() { this.playing.set(false); this.status.set("Nhạc chưa tải được. Chạm bật nhạc để thử lại."); }
  private pause = () => { this.player.nativeElement.pause(); this.playing.set(false); };
  private visibility = () => {
    if (document.hidden) this.pause();
  };
  ngOnDestroy() {
    this.destroyed = true;
    this.pause();
    document.removeEventListener("memory-video-play", this.pause);
    document.removeEventListener("visibilitychange", this.visibility);
  }
}
