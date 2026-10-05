import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { CONTACT, DESTINATIONS, SERVICES, STATS } from "@/data/travel";

const waLink = `https://wa.me/${CONTACT.whatsapp}?text=Hello%20${CONTACT.brand}%2C%20I%20would%20like%20to%20plan%20a%20trip`;

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <div className="border-b border-border bg-gradient-card">
        <div className="container-luxe flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Ready to plan your next holiday?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send us your dates and we will reply with an itinerary and clear pricing within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Plan My Trip <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="container-luxe grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-primary md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo className="h-12" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {CONTACT.brand} plans and books complete trips — guided tours, hotels, flights, transfers,
            experiences and visa paperwork — so you travel with every detail already handled.
          </p>

          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <a href={`tel:${CONTACT.tel}`} className="flex items-center gap-3 hover:text-primary">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> {CONTACT.phone1}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-primary">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> {CONTACT.email}
            </a>
          </div>

          <div className="mt-6 flex gap-3">
            {[
              { Icon: Facebook, label: `${CONTACT.brand} on Facebook` },
              { Icon: Instagram, label: `${CONTACT.brand} on Instagram` },
              { Icon: Linkedin, label: `${CONTACT.brand} on LinkedIn` },
              { Icon: Youtube, label: `${CONTACT.brand} on YouTube` },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Quick Links</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/services" className="hover:text-primary">Destinations</Link></li>
            <li><Link to="/services/tours" className="hover:text-primary">Packages</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Travel Journal</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">We Arrange</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link to={`/services/${s.slug}`} className="hover:text-primary">{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Get in Touch</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{CONTACT.address}</span></li>
            <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={`tel:${CONTACT.tel}`} className="hover:text-primary">{CONTACT.phone1}</a></li>
            <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={`mailto:${CONTACT.email}`} className="break-all hover:text-primary">{CONTACT.email}</a></li>
            <li className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{CONTACT.hours}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-luxe py-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Popular Destinations</p>
          <div className="flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <span key={d.name} className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-luxe flex flex-col justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} {CONTACT.brand}. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>{CONTACT.address}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
