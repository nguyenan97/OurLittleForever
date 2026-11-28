import { Component } from "@angular/core";
import { PhotoComponent } from "./photo.component";

@Component({
  selector: "app-constellation",
  imports: [PhotoComponent],
  template: `<section class="constellation-world">
    <div class="constellation-inner page-width">
      <div class="constellation-copy">
        <span class="eyebrow light">MỖI KỶ NIỆM, MỘT VÌ SAO</span>
        <h2>Cả một bầu trời.<br /><em>Vẫn chỉ thương em.</em></h2>
        <p>Anh nối những ngày có em thành một chòm sao nhỏ.<br />Để lần nào nhìn lại, cũng thấy mình ở cạnh nhau.</p>
        <span class="constellation-signature">Bình An & Thanh Tuyền</span>
      </div>
      <div class="constellation-stage">
        <div class="celestial-orbit orbit-near" aria-hidden="true"></div>
        <div class="celestial-orbit orbit-far" aria-hidden="true"></div>
        <div class="love-moon" aria-hidden="true"><span>A & T</span></div>
        <div class="saturn-planet" aria-hidden="true"><i></i></div>
        <svg class="constellation-lines" viewBox="0 0 600 620" fill="none" aria-hidden="true">
          <path d="M130 130L385 70L500 330L280 490L130 130L500 330M280 490L60 370" />
          <g>@for (star of stars; track $index) { <circle [attr.cx]="star[0]" [attr.cy]="star[1]" r="3" /> }</g>
        </svg>
        <figure class="sky-keepsake sky-one"><app-photo id="sunny-together" sizes="(max-width:600px) 38vw, 220px" /><figcaption>Một ngày thật xanh.</figcaption></figure>
        <figure class="sky-keepsake sky-two"><app-photo id="portrait-gown" sizes="(max-width:600px) 35vw, 200px" /><figcaption>Em, thật dịu dàng.</figcaption></figure>
        <figure class="sky-keepsake sky-three"><app-photo id="couple-close" sizes="(max-width:600px) 45vw, 245px" /><figcaption>Có nhau là đủ.</figcaption></figure>
        <span class="sky-coordinate coordinate-one" aria-hidden="true">28.10.2026 · GẶP EM</span>
        <span class="sky-coordinate coordinate-two" aria-hidden="true">14.11.2026 · CHÚNG MÌNH</span>
      </div>
    </div>
  </section>`,
})
export class ConstellationComponent {
  protected stars = [[130,130],[385,70],[500,330],[280,490],[60,370]];
}
