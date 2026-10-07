import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orderLink } from "@/data/fiveam";
import { supabase } from "@/integrations/supabase/client";

const links = [
  ["/", "Home"], ["/plans", "Plans"], ["/how-it-works", "How it Works"], ["/about", "About"], ["/faqs", "FAQs"], ["/blog", "Blog"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(Boolean(session)));
    supabase.auth.getUser().then(({ data: { user } }) => setAuthed(Boolean(user)));
    return () => data.subscription.unsubscribe();
  }, []);
  return <header className="site-header">
    <div className="h-in site-header-row">
      <Logo />
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([to,label]) => <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => cn("nav-link", isActive && "active")}>{label}</NavLink>)}
      </nav>
      <div className="header-auth hidden md:flex">
        {authed ? (
          <Link to="/dashboard" className="nav-link header-signup">Student Dashboard</Link>
        ) : (<>
          <Link to="/account" className="nav-link">Login</Link>
          <Link to="/account?mode=signup" className="nav-link header-signup">Sign Up</Link>
        </>)}
      </div>
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
      {authed ? (
        <Link to="/dashboard" onClick={() => setOpen(false)} className="mobile-nav-link">Student Dashboard</Link>
      ) : (<>
        <Link to="/account" onClick={() => setOpen(false)} className="mobile-nav-link">Login</Link>
        <Link to="/account?mode=signup" onClick={() => setOpen(false)} className="mobile-nav-link">Create Account</Link>
      </>)}
      <a className="h-btn h-btn-orange mobile-register" href={orderLink("Community Registration")} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Register to Community <ArrowRight /></a>
    </nav>}
  </header>;
}
