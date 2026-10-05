import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orderLink } from "@/data/fiveam";

const links = [
  ["/", "Home"], ["/plans", "Plans"], ["/how-it-works", "How it Works"], ["/about", "About"], ["/faqs", "FAQs"], ["/blog", "Blog"], ["/gallery", "Gallery"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="h-in site-header-row">
      <Logo />
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([to,label]) => <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => cn("nav-link", isActive && "active")}>{label}</NavLink>)}
      </nav>
      <a className="h-btn h-btn-orange header-cta" href={orderLink("Community Registration")} target="_blank" rel="noreferrer">Register to Community <ArrowRight /></a>
      <Button
        variant="ghost"
        size="icon"
        className="mobile-menu-trigger md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </Button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-navigation md:hidden" aria-label="Mobile navigation">
      {links.map(([to,label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className={({ isActive }) => cn("mobile-nav-link", isActive && "active")}>{label}</NavLink>)}
      <a className="h-btn h-btn-orange mobile-register" href={orderLink("Community Registration")} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Register to Community <ArrowRight /></a>
    </nav>}
  </header>;
}
