import { Component, OnDestroy, signal, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PhotoComponent } from "./photo.component";
import { GalaxyComponent } from "./galaxy.component";
import { LetterComponent } from "./letter.component";
import { story } from "./content";

@Component({
  selector: "app-teachers-day",
  imports: [RouterLink, PhotoComponent, GalaxyComponent, LetterComponent],
  template: `
    <section class="teachers-hero teachers-hero-short">
      <div class="teacher-backdrop"><app-photo id="portrait-window" [zoom]="false" sizes="100vw" [eager]="true" /></div>
      <div class="teacher-heart-field" aria-hidden="true">
        @for (heart of hearts; track $index) { <span [style.--i]="$index" [style.--x]="heart.x + '%'" [style.--delay]="heart.delay + 's'">{{ $index % 3 ? '♡' : '♥' }}</span> }
      </div>
      <div class="teachers-hero-inner page-width">
        <div class="teachers-hero-copy">
          <span class="eyebrow light">20.11 · NGÀY NHÀ GIÁO VIỆT NAM</span>
          <h1>Gửi cô giáo<br /><em>anh thương.</em></h1>
          <p>Chúc em một ngày thật nhiều niềm vui.</p>
          <button class="button cream" (click)="letter.open()">Đọc lời chúc <span aria-hidden="true">♡</span></button>
        </div>
        <div class="teacher-portrait"><app-photo id="portrait-hero" sizes="(max-width:600px) 82vw, 35vw" [eager]="true" /></div>
      </div>
    </section>
    <section class="teachers-letter teachers-letter-short">
      <div class="page-width letter-layout">
        <div><span class="eyebrow">DÀNH RIÊNG CHO EM</span><h2>Một lời chúc.<br /><em>Thật nhiều thương.</em></h2></div>
        <app-letter [title]="story.teachersLetter.title" [paragraphs]="story.teachersLetter.paragraphs" [signature]="story.teachersLetter.signature" [source]="story.teachersLetter.source" [shortPaper]="true" />
      </div>
    </section>
    <section class="heart-universe teacher-heart-universe" [class.heart-celebration]="celebrating()">
      <div class="center-heading"><span class="eyebrow light">HAPPY TEACHER’S DAY</span><h2>20/11 <em>thật vui, em nhé.</em></h2></div>
      <app-galaxy class="heart-showcase" />
      <button class="heart-wish-button" (click)="celebrate()" aria-label="Gửi một trời trái tim"><span aria-hidden="true">♡</span> Chạm một chút thương</button>
      <div class="wish-heart-burst" aria-hidden="true">
        @for (heart of burst; track $index) { <span [style.--i]="$index" [style.--angle]="$index * 15 + 'deg'">{{ $index % 2 ? '♡' : '♥' }}</span> }
      </div>
      <a class="teacher-home-link" routerLink="/">Về chuyện mình</a>
    </section>
  `,
})
export class TeachersDayComponent implements OnDestroy {
  @ViewChild(LetterComponent) protected letter!: LetterComponent;
  protected story = story;
  protected celebrating = signal(false);
  protected hearts = Array.from({ length: 16 }, (_, i) => ({ x: (i * 29 + 4) % 96, delay: -i * 1.35 }));
  protected burst = Array.from({ length: 24 });
  private timer?: ReturnType<typeof setTimeout>;
  celebrate() {
    clearTimeout(this.timer);
    this.celebrating.set(false);
    this.timer = setTimeout(() => {
      this.celebrating.set(true);
      this.timer = setTimeout(() => this.celebrating.set(false), 2200);
    }, 30);
  }
  ngOnDestroy() { clearTimeout(this.timer); }
}
