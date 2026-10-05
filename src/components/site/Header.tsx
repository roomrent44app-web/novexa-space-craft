import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { SERVICES, CONTACT } from "@/data/travel";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Destination", dropdown: true },
  { to: "/services/tours", label: "Package" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
         scrolled || open ? "border-b border-border bg-background/95 shadow-soft backdrop-blur-xl" : "bg-background"
      )}
    >
      <div className="container-luxe flex h-[74px] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <div key={l.to} className="group relative">
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )
                }
              >
                {l.label}
                {l.dropdown && <ChevronDown className="h-4 w-4" />}
              </NavLink>

              {l.dropdown && (
                <div className="invisible absolute left-1/2 top-full z-50 w-[620px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="grid max-h-[70vh] grid-cols-2 gap-1 overflow-auto rounded-2xl border border-border bg-popover p-3 shadow-elegant">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-primary"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <a href={`https://wa.me/${CONTACT.whatsapp}`} className="btn-primary hidden rounded-full px-5 py-2.5 lg:inline-flex">+91 97181 19119</a>

        <button className="p-2 text-foreground lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-luxe flex max-h-[75vh] flex-col gap-1 overflow-auto py-5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn("border-b border-border/60 py-3 text-sm", isActive ? "text-primary" : "text-muted-foreground")
                }
              >
                {l.label}
              </NavLink>
            ))}
             <Link to="/contact" className="btn-primary mt-4 justify-center">Plan My Trip</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
