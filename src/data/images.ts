// Single source for every bundled photo variant, so pages and the preloader share exact URLs.
import heroAvif from "@/assets/home-hero-ref.jpg?format=avif&width=1376&quality=70&imagetools";
import heroWebp from "@/assets/home-hero-ref.jpg?format=webp&width=1376&quality=76&imagetools";
import communityAvif from "@/assets/home-community-ref.jpg?format=avif&width=1264&quality=68&imagetools";
import communityWebp from "@/assets/home-community-ref.jpg?format=webp&width=1264&quality=74&imagetools";
import ctaAvif from "@/assets/home-cta-ref.jpg?format=avif&width=1600&quality=68&imagetools";
import ctaWebp from "@/assets/home-cta-ref.jpg?format=webp&width=1600&quality=74&imagetools";
import priyaAvif from "@/assets/avatar-priya.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
import priyaWebp from "@/assets/avatar-priya.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
import ananyaAvif from "@/assets/avatar-ananya.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
import ananyaWebp from "@/assets/avatar-ananya.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
import rohitAvif from "@/assets/avatar-rohit.jpg?format=avif&width=256&height=256&fit=cover&quality=68&imagetools";
import rohitWebp from "@/assets/avatar-rohit.jpg?format=webp&width=256&height=256&fit=cover&quality=74&imagetools";
import plansHeroAvif from "@/assets/plans-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
import plansHeroWebp from "@/assets/plans-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
import hiwHeroAvif from "@/assets/hiw-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
import hiwHeroWebp from "@/assets/hiw-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
import hiwCtaAvif from "@/assets/hiw-cta-clone.jpg?format=avif&width=1584&quality=68&imagetools";
import hiwCtaWebp from "@/assets/hiw-cta-clone.jpg?format=webp&width=1584&quality=74&imagetools";
import faqHeroAvif from "@/assets/faq-hero-clone.jpg?format=avif&width=1584&quality=70&imagetools";
import faqHeroWebp from "@/assets/faq-hero-clone.jpg?format=webp&width=1584&quality=76&imagetools";
import faqCtaAvif from "@/assets/faq-cta-clone.jpg?format=avif&width=1584&quality=68&imagetools";
import faqCtaWebp from "@/assets/faq-cta-clone.jpg?format=webp&width=1584&quality=74&imagetools";
import aboutHeroAvif from "@/assets/about-hero.jpg?format=avif&width=1600&quality=70&imagetools";
import aboutHeroWebp from "@/assets/about-hero.jpg?format=webp&width=1600&quality=76&imagetools";
import studentAvif from "@/assets/5am-student.jpg?format=avif&width=900&quality=68&imagetools";
import studentWebp from "@/assets/5am-student.jpg?format=webp&width=900&quality=74&imagetools";

export { heroAvif, heroWebp, communityAvif, communityWebp, ctaAvif, ctaWebp, priyaAvif, priyaWebp, ananyaAvif, ananyaWebp, rohitAvif, rohitWebp, plansHeroAvif, plansHeroWebp, hiwHeroAvif, hiwHeroWebp, hiwCtaAvif, hiwCtaWebp, faqHeroAvif, faqHeroWebp, faqCtaAvif, faqCtaWebp, aboutHeroAvif, aboutHeroWebp, studentAvif, studentWebp };

// Per-page images (AVIF first; browsers without AVIF skip those preloads automatically).
export const PAGE_IMAGES: Record<string, { avif: string[]; webp: string[] }> = {
  "/": { avif: [heroAvif, communityAvif, ctaAvif, priyaAvif, ananyaAvif, rohitAvif], webp: [heroWebp, communityWebp, ctaWebp, priyaWebp, ananyaWebp, rohitWebp] },
  "/plans": { avif: [plansHeroAvif], webp: [plansHeroWebp] },
  "/how-it-works": { avif: [hiwHeroAvif, hiwCtaAvif], webp: [hiwHeroWebp, hiwCtaWebp] },
  "/faqs": { avif: [faqHeroAvif, faqCtaAvif], webp: [faqHeroWebp, faqCtaWebp] },
  "/about": { avif: [aboutHeroAvif, studentAvif], webp: [aboutHeroWebp, studentWebp] },
};
