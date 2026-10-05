// Single source for every bundled photo variant, so pages and the preloader share exact URLs.
export { default as heroAvif } from "@/assets/home-hero-ref.jpg?format=avif&width=1376&quality=70&imagetools";
export { default as heroWebp } from "@/assets/home-hero-ref.jpg?format=webp&width=1376&quality=76&imagetools";
export { default as communityAvif } from "@/assets/home-community-ref.jpg?format=avif&width=1264&quality=68&imagetools";
export { default as communityWebp } from "@/assets/home-community-ref.jpg?format=webp&width=1264&quality=74&imagetools";
export { default as ctaAvif } from "@/assets/home-cta-ref.jpg?format=avif&width=1600&quality=68&imagetools";
export { default as ctaWebp } from "@/assets/home-cta-ref.jpg?format=webp&width=1600&quality=74&imagetools";
export { default as priyaAvif } from "@/assets/avatar-priya.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
export { default as priyaWebp } from "@/assets/avatar-priya.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
export { default as ananyaAvif } from "@/assets/avatar-ananya.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
export { default as ananyaWebp } from "@/assets/avatar-ananya.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
export { default as rohitAvif } from "@/assets/avatar-rohit.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
export { default as rohitWebp } from "@/assets/avatar-rohit.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
export { default as plansHeroAvif } from "@/assets/plans-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
export { default as plansHeroWebp } from "@/assets/plans-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
export { default as hiwHeroAvif } from "@/assets/hiw-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
export { default as hiwHeroWebp } from "@/assets/hiw-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
export { default as hiwCtaAvif } from "@/assets/hiw-cta-clone.jpg?format=avif&width=1584&quality=68&imagetools";
export { default as hiwCtaWebp } from "@/assets/hiw-cta-clone.jpg?format=webp&width=1584&quality=74&imagetools";
export { default as faqHeroAvif } from "@/assets/faq-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
export { default as faqHeroWebp } from "@/assets/faq-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
export { default as faqCtaAvif } from "@/assets/faq-cta-clone.jpg?format=avif&width=1584&quality=68&imagetools";
export { default as faqCtaWebp } from "@/assets/faq-cta-clone.jpg?format=webp&width=1584&quality=74&imagetools";
export { default as aboutHeroAvif } from "@/assets/about-hero.jpg?format=avif&width=1600&quality=70&imagetools";
export { default as aboutHeroWebp } from "@/assets/about-hero.jpg?format=webp&width=1600&quality=76&imagetools";
export { default as studentAvif } from "@/assets/5am-student.jpg?format=avif&width=900&quality=68&imagetools";
export { default as studentWebp } from "@/assets/5am-student.jpg?format=webp&width=900&quality=74&imagetools";

import * as img from "./images";

// Per-page images (AVIF first; browsers without AVIF skip those preloads automatically).
export const PAGE_IMAGES: Record<string, { avif: string[]; webp: string[] }> = {
  "/": { avif: [img.heroAvif, img.communityAvif, img.ctaAvif, img.priyaAvif, img.ananyaAvif, img.rohitAvif], webp: [img.heroWebp, img.communityWebp, img.ctaWebp, img.priyaWebp, img.ananyaWebp, img.rohitWebp] },
  "/plans": { avif: [img.plansHeroAvif], webp: [img.plansHeroWebp] },
  "/how-it-works": { avif: [img.hiwHeroAvif, img.hiwCtaAvif], webp: [img.hiwHeroWebp, img.hiwCtaWebp] },
  "/faqs": { avif: [img.faqHeroAvif, img.faqCtaAvif], webp: [img.faqHeroWebp, img.faqCtaWebp] },
  "/about": { avif: [img.aboutHeroAvif, img.studentAvif], webp: [img.aboutHeroWebp, img.studentWebp] },
};
