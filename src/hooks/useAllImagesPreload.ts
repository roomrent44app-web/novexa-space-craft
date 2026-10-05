import { useEffect } from "react";
import { PAGE_IMAGES } from "@/data/images";

// Tiny 1x1 AVIF used to detect format support once.
const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";

let avifSupport: Promise<boolean> | null = null;
function supportsAvif() {
  if (!avifSupport) {
    avifSupport = new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(probe.width > 0);
      probe.onerror = () => resolve(false);
      probe.src = AVIF_PROBE;
    });
  }
  return avifSupport;
}

// Keep references so loaded images stay decoded in memory.
const loaded = new Map<string, HTMLImageElement>();
function load(src: string, high: boolean) {
  if (loaded.has(src)) return;
  const image = new Image();
  image.decoding = "async";
  image.setAttribute("fetchpriority", high ? "high" : "low");
  image.src = src;
  loaded.set(src, image);
}

function whenIdle(fn: () => void) {
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (ric) ric(fn);
  else setTimeout(fn, 200);
}

let othersScheduled = false;

/** Loads every photo of the current page immediately, then every other page's photos in the background. */
export function useAllImagesPreload(pathname: string) {
  useEffect(() => {
    let cancelled = false;
    supportsAvif().then((avif) => {
      if (cancelled) return;
      const pick = (route: string) => (avif ? PAGE_IMAGES[route]?.avif : PAGE_IMAGES[route]?.webp) ?? [];
      pick(pathname).forEach((src) => load(src, true));

      if (othersScheduled) return;
      othersScheduled = true;
      const loadOthers = () =>
        whenIdle(() =>
          Object.keys(PAGE_IMAGES)
            .filter((route) => route !== pathname)
            .forEach((route) => pick(route).forEach((src) => load(src, false))),
        );
      if (document.readyState === "complete") loadOthers();
      else window.addEventListener("load", loadOthers, { once: true });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);
}
