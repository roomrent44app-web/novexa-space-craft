import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { CONTACT } from "@/data/fiveam";

export default function Footer() {
  return <footer className="border-t bg-foreground text-primary-foreground">
    <div className="site-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1.4fr]">
      <div><Logo className="footer-logo" /><p className="mt-4 max-w-sm text-sm leading-6 opacity-75">Wake up with purpose, study with a community and build a better you—one morning at a time.</p></div>
      <div><h3 className="mb-4 text-lg">Quick Links</h3><div className="grid gap-2 text-sm opacity-80"><Link to="/plans">Plans</Link><Link to="/how-it-works">How it Works</Link><Link to="/about">About</Link><Link to="/faqs">FAQs</Link><Link to="/blog">Blog</Link><Link to="/gallery">Gallery</Link><Link to="/admin">Admin Panel</Link></div></div>
      <div><h3 className="mb-4 text-lg">Contact 5AM</h3><div className="grid gap-3 text-sm opacity-80"><a className="flex gap-2" href={`tel:${CONTACT.tel}`}><Phone className="h-4 w-4" />{CONTACT.mobile}</a><a className="flex gap-2" href={`mailto:${CONTACT.email}`}><Mail className="h-4 w-4" />{CONTACT.email}</a><p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{CONTACT.address}</p></div></div>
    </div>
    <div className="border-t border-primary-foreground/15"><div className="site-container flex flex-col justify-between gap-2 py-5 text-xs opacity-60 sm:flex-row"><span>© {new Date().getFullYear()} 5AM.co.in. All rights reserved.</span><span>Same Time. Better You.</span></div></div>
  </footer>;
}
