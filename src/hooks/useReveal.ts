import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Mark elements above-the-fold as already visible so they don't flash.
    const all = document.querySelectorAll<HTMLElement>(".reveal");
    const vh = window.innerHeight || 800;
    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9) el.classList.add("is-visible");
    });

    // Now hide remaining .reveal items (CSS only kicks in once .js-ready is set).
    root.classList.add("js-ready");

    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
      .forEach((el) => io.observe(el));

    // Safety net: never leave content invisible.
    const t = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => el.classList.add("is-visible"));
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);
}
