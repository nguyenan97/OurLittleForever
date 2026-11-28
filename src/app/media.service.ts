import { computed, inject, Injectable, signal } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

export interface Photo {
  id: string;
  category: "memory" | "portrait" | "letter";
  caption: string;
  date: string;
  position: string;
  width: number;
  height: number;
  src: string;
  thumbnail: string;
  variants: { width: number; webp: string; avif: string }[];
}
@Injectable({ providedIn: "root" })
export class MediaService {
  readonly photos = signal<Photo[]>([]);
  readonly active = signal<Photo | null>(null);
  readonly memories = computed(() =>
    this.photos().filter((p) => p.category === "memory"),
  );
  readonly portraits = computed(() =>
    this.photos().filter((p) => p.category === "portrait"),
  );
  constructor() {
    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) this.close();
    });
    fetch(new URL("media/manifest.json", document.baseURI), { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error("Media unavailable");
        return r.json();
      })
      .then((p: Photo[]) => this.photos.set(p.filter(photo => !['booth-strip', 'her-smile'].includes(photo.id))))
      .catch(() => {});
  }
  url(value: string) {
    return new URL(value.replace(/^\//, ""), document.baseURI).href;
  }
  open(id: string) {
    this.active.set(this.photos().find((p) => p.id === id) || null);
  }
  close() {
    this.active.set(null);
  }
  move(step: number) {
    const active = this.active();
    if (!active) return;
    const collection = this.photos().filter(
      (p) => p.category === active.category,
    );
    const index = collection.findIndex((p) => p.id === active.id);
    this.active.set(
      collection[(index + step + collection.length) % collection.length],
    );
  }
}
