import { useLayoutEffect } from "react";

const PRELOAD_ID = "page-hero-image-preload";

export function useImagePreload(href: string, type = "image/avif") {
  useLayoutEffect(() => {
    let link = document.getElementById(PRELOAD_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = PRELOAD_ID;
      link.rel = "preload";
      link.as = "image";
      document.head.appendChild(link);
    }
    link.href = href;
    link.type = type;
    link.setAttribute("fetchpriority", "high");

    return () => link?.remove();
  }, [href, type]);
}