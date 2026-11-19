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
    <div class="heart-satellites" aria-hidden="true">
      @for (satellite of satellites; track $index) { <span [style.--i]="$index">{{ $index % 2 ? '♡' : '♥' }}</span> }
    </div>
    <ng-content />
  `,
})
export class GalaxyComponent implements OnDestroy {
  @ViewChild("canvasHost", { static: true })
  canvasHost!: ElementRef<HTMLDivElement>;
  protected ready = signal(false);
  protected satellites = Array.from({ length: 10 });
  private destroyed = false;
  private cleanup?: () => void;
  private entrance?: IntersectionObserver;
  constructor() {
    afterNextRender(() => {
      this.entrance = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        this.entrance?.disconnect();
        void this.initialize();
      }, { rootMargin: "350px" });
      this.entrance.observe(this.canvasHost.nativeElement);
    });
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
      camera.position.z = 6.8;
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
      for (let i = 0; i < 2600; i++) {
        const t = Math.random() * Math.PI * 2;
        const shell = i < 1100 ? 0.98 + Math.random() * 0.04 : Math.sqrt(Math.random());
        const scale = 0.095 * shell;
        heartPositions.push(
          16 * Math.pow(Math.sin(t), 3) * scale,
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)) *
            scale +
            0.1,
          (Math.random() - 0.5) * 0.65 * Math.sqrt(1 - shell * shell / 1.1),
        );
      }
      const heartGeometry = new THREE.BufferGeometry();
      heartGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(heartPositions, 3),
      );
      const heartMaterial = new THREE.PointsMaterial({
        color: 0xff9fba,
        size: 0.034,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const heart = new THREE.Points(heartGeometry, heartMaterial);
      scene.add(heart);
      // A beveled glass heart gives the particle cloud real volume.
      const outline = new THREE.Shape();
      for (let i = 0; i <= 100; i++) {
        const t = i / 100 * Math.PI * 2;
        const x = 16 * Math.sin(t) ** 3 * 0.083;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 0.083 + 0.1;
        if (i === 0) outline.moveTo(x,y); else outline.lineTo(x,y);
      }
      const glassGeometry = new THREE.ExtrudeGeometry(outline, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.13, bevelSize: 0.09, bevelSegments: 3, steps: 1, curveSegments: 24 });
      glassGeometry.translate(0,0,-0.14);
      const glassMaterial = new THREE.MeshPhongMaterial({ color: 0xb52e60, emissive: 0x3c071d, shininess: 95, specular: 0xffdfdb, transparent: true, opacity: 0.65, depthWrite: false });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      scene.add(glass);
      scene.add(new THREE.AmbientLight(0xe5baca, 1.7));
      const light = new THREE.DirectionalLight(0xffe1bf, 3.5); light.position.set(-2,3,5); scene.add(light);
      const ringGeometry = new THREE.TorusGeometry(2.1, 0.006, 4, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xe7bb8c, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.set(1.05,0.15,0.2); scene.add(ring);
      const satelliteMaterial = new THREE.MeshPhongMaterial({ color: 0xf3adbb, emissive: 0x5b112a, shininess: 80, specular: 0xffe6ca });
      const smallHearts = new THREE.InstancedMesh(glassGeometry, satelliteMaterial, 9);
      smallHearts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const satellitePose = new THREE.Object3D();
      scene.add(smallHearts);
      let targetX = 0, targetY = 0;
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = host.getBoundingClientRect();
        targetX = (event.clientX - rect.left) / rect.width - 0.5;
        targetY = (event.clientY - rect.top) / rect.height - 0.5;
      };
      host.addEventListener("pointermove", pointer, { passive: true });
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
          heart.rotation.y = Math.sin(elapsed * 0.3) * 0.38 + targetX * 0.3;
          heart.rotation.z = Math.sin(elapsed * 0.2) * 0.035;
          heart.rotation.x = targetY * 0.15;
          heart.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.025);
          glass.rotation.copy(heart.rotation); glass.scale.copy(heart.scale);
          ring.rotation.z = elapsed * 0.09;
          for (let i = 0; i < 9; i++) {
            const angle = elapsed * 0.22 + i * Math.PI * 2 / 9;
            satellitePose.position.set(Math.cos(angle) * 2.05, Math.sin(angle) * 1.7, Math.sin(angle * 2) * 0.6);
            satellitePose.rotation.set(Math.sin(angle) * 0.2, angle * 0.7, Math.sin(angle) * 0.2);
            satellitePose.scale.setScalar(0.075 + (i % 3) * 0.018);
            satellitePose.updateMatrix();
            smallHearts.setMatrixAt(i, satellitePose.matrix);
          }
          smallHearts.instanceMatrix.needsUpdate = true;
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
        glassGeometry.dispose(); glassMaterial.dispose();
        ringGeometry.dispose(); ringMaterial.dispose();
        satelliteMaterial.dispose(); smallHearts.dispose();
        host.removeEventListener("pointermove", pointer);
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
    this.entrance?.disconnect();
    this.cleanup?.();
  }
}
