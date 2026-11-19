import {
  afterNextRender,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-galaxy",
  host: { class: "galaxy-scene" },
  template: `
    <div #canvasHost class="canvas-host" aria-hidden="true"></div>
    <div class="galaxy-haze" aria-hidden="true"></div>
    <div class="galaxy-fallback" [class.hidden]="ready()" aria-hidden="true">
      ♡
    </div>
    <div class="orbital-ring ring-one" aria-hidden="true"></div>
    <div class="orbital-ring ring-two" aria-hidden="true"></div>
    <span class="galaxy-star star-one" aria-hidden="true">✧</span
    ><span class="galaxy-star star-two" aria-hidden="true">✦</span>
    <ng-content />
  `,
})
export class GalaxyComponent implements OnDestroy {
  @ViewChild("canvasHost", { static: true })
  canvasHost!: ElementRef<HTMLDivElement>;
  protected ready = signal(false);
  private destroyed = false;
  private cleanup?: () => void;
  constructor() {
    afterNextRender(() => void this.initialize());
  }
  private async initialize() {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: import("three").WebGLRenderer | undefined;
    try {
      const THREE = await import("three");
      if (this.destroyed) return;
      const host = this.canvasHost.nativeElement;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.z = 8.5;
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      host.appendChild(renderer.domElement);
      const count = innerWidth < 700 ? 900 : 2000;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      const material = new THREE.PointsMaterial({
        color: 0xe9d4b6,
        size: 0.021,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      });
      const stars = new THREE.Points(geometry, material);
      scene.add(stars);
      const heartPositions = [];
      for (let i = 0; i < 1700; i++) {
        const t = Math.random() * Math.PI * 2;
        const scale = 0.075 + Math.random() * 0.01;
        heartPositions.push(
          16 * Math.pow(Math.sin(t), 3) * scale,
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)) *
            scale +
            0.1,
          (Math.random() - 0.5) * 0.3,
        );
      }
      const heartGeometry = new THREE.BufferGeometry();
      heartGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(heartPositions, 3),
      );
      const heartMaterial = new THREE.PointsMaterial({
        color: 0xe9b1a8,
        size: 0.027,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const heart = new THREE.Points(heartGeometry, heartMaterial);
      scene.add(heart);
      let visible = true,
        frame = 0,
        lastTime = 0,
        elapsed = 0;
      const render = (time: number) => {
        frame = 0;
        if (this.destroyed) return;
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        if (visible && !document.hidden) {
          elapsed += delta * (motion.matches ? 0.35 : 1);
          stars.rotation.y = elapsed * 0.016;
          heart.rotation.y = Math.sin(elapsed * 0.3) * 0.2;
          heart.rotation.z = Math.sin(elapsed * 0.2) * 0.035;
          heart.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.025);
        }
        renderer!.render(scene, camera);
        if (visible && !document.hidden) frame = requestAnimationFrame(render);
      };
      const wake = () => {
        lastTime = 0;
        if (!frame) frame = requestAnimationFrame(render);
      };
      const resize = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect();
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer!.setSize(width, height);
        wake();
      });
      resize.observe(host);
      const intersection = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) wake();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      intersection.observe(host);
      const visibility = () => {
        if (document.hidden && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else wake();
      };
      document.addEventListener("visibilitychange", visibility);
      this.cleanup = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        intersection.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        geometry.dispose();
        material.dispose();
        heartGeometry.dispose();
        heartMaterial.dispose();
        renderer!.dispose();
        renderer!.domElement.remove();
      };
      this.ready.set(true);
      wake();
    } catch {
      renderer?.dispose();
      // The static heart and all story content remain available without WebGL.
    }
  }
  ngOnDestroy() {
    this.destroyed = true;
    this.cleanup?.();
  }
}
