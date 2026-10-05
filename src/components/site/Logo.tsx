import { Link } from "react-router-dom";
import logoAvif from "@/assets/5am-logo.png?format=avif&width=240&quality=78&imagetools";
import logoWebp from "@/assets/5am-logo.png?format=webp&width=240&quality=82&imagetools";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`brand-logo ${className}`} aria-label="5AM.co.in home">
      <picture><source srcSet={logoAvif} type="image/avif" /><img src={logoWebp} alt="5AM.co.in" width={240} height={184} decoding="async" loading="eager" /></picture>
    </Link>
  );
}
