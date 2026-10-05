import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orderLink } from "@/data/fiveam";

const links = [
  ["/", "Home"], ["/plans", "Plans"], ["/how-it-works", "How it Works"], ["/about", "About"], ["/faqs", "FAQs"],
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
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="site-container flex flex-col border-t py-3 md:hidden">{links.map(([to,label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className="border-b py-3 text-sm font-bold">{label}</NavLink>)}</nav>}
  </header>;
}
