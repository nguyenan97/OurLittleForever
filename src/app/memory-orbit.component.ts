import { Component } from "@angular/core";
import { PhotoComponent } from "./photo.component";
@Component({
  selector: "app-memory-orbit",
  imports: [PhotoComponent],
  template: `
    <div class="orbit-stage">
      <div class="orbit-aura"></div>
      <div class="memory-orbit">
        @for (id of photos; track id; let i = $index) {
          <div class="orbit-card" [style.--angle]="i * 45 + 'deg'">
            <app-photo [id]="id" sizes="(max-width:600px) 140px, 200px" /><span
              >♡</span
            >
          </div>
        }
      </div>
      <span class="orbit-heart" aria-hidden="true">♡</span>
    </div>
    <p class="orbit-caption">Có những khoảnh khắc, anh muốn giữ mãi ở đây.</p>
  `,
})
export class MemoryOrbitComponent {
  protected photos = [
    "couple-smile",
    "date-flowers",
    "our-kiss",
    "first-meeting",
    "couple-close",
    "her-smile",
    "private-date",
    "hands",
  ];
}
