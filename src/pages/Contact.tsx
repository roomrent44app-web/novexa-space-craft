import PageHero from "@/components/site/PageHero";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useSeo, breadcrumbJsonLd } from "@/hooks/useSeo";
import { CONTACT } from "@/data/travel";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255),
  destination: z.string().trim().min(2, "Where would you like to go?").max(120),
  requirement: z.string().trim().min(10, "Tell us a little more").max(1000),
});

export default function Contact() {
  useSeo({
    title: "Contact Us",
    description: `Get in touch with ${CONTACT.brand} to plan your next trip. Call, email or WhatsApp us — we reply within 24 hours with an itinerary and clear pricing.`,
    path: "/contact",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "ContactPage", name: `Contact ${CONTACT.brand}` },
      breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]),
    ],
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", destination: "", requirement: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    const text = `New trip enquiry%0A%0AName: ${encodeURIComponent(form.name)}%0APhone: ${encodeURIComponent(form.phone)}%0AEmail: ${encodeURIComponent(form.email)}%0ADestination: ${encodeURIComponent(form.destination)}%0ADetails: ${encodeURIComponent(form.requirement)}`;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${text}`, "_blank");
    toast.success("Thank you! We'll send your itinerary within 24 hours.");
    setForm({ name: "", phone: "", email: "", destination: "", requirement: "" });
  };

  const field = "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none";
  const label = "text-xs uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <>
      <PageHero
        eyebrow="Plan My Trip"
        title="Tell us where you want to go"
        subtitle="Share a few details and our planners will send an itinerary with clear pricing within 24 hours."
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-16 lg:grid-cols-5">
          <form onSubmit={handle} className="reveal card-surface lg:col-span-3">
            <h2 className="text-2xl font-bold">Trip Enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">All fields required. We never share your details.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={label}>Name</label>
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Your full name" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={label}>Phone</label>
                <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="+91" />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className={label}>Email</label>
                <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} placeholder="you@email.com" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="destination" className={label}>Destination</label>
                <input id="destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className={field} placeholder="Maldives, Bali, Switzerland..." />
                {errors.destination && <p className="mt-1 text-xs text-destructive">{errors.destination}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="requirement" className={label}>Trip details</label>
                <textarea
                  id="requirement"
                  rows={4}
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                  className={`${field} resize-none`}
                  placeholder="Travel dates, number of travelers, budget range and anything you especially want to do..."
                />
                {errors.requirement && <p className="mt-1 text-xs text-destructive">{errors.requirement}</p>}
              </div>
            </div>

            <button type="submit" className="btn-primary mt-8">
              Send Enquiry <Send className="h-4 w-4" />
            </button>
          </form>

          <aside className="space-y-6 lg:col-span-2">
            <div className="reveal reveal-delay-1">
              <p className="eyebrow">Direct Lines</p>
              <h2 className="mt-4 text-xl font-bold">Talk to a planner</h2>
            </div>

            {[
              { icon: Phone, title: "Call", lines: [CONTACT.phone1], hrefs: [`tel:${CONTACT.tel}`] },
              { icon: Mail, title: "Email", lines: [CONTACT.email], hrefs: [`mailto:${CONTACT.email}`] },
              { icon: MapPin, title: "Office", lines: [CONTACT.address] },
              { icon: Clock, title: "Support", lines: [CONTACT.hours] },
            ].map((b, i) => (
              <div key={b.title} className={`card-surface reveal reveal-delay-${(i % 4) + 1} flex gap-4`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{b.title}</div>
                  <div className="mt-2 space-y-1">
                    {b.lines.map((l, j) =>
                      b.hrefs ? (
                        <a key={l} href={b.hrefs[j]} className="block break-words text-sm text-muted-foreground hover:text-primary">{l}</a>
                      ) : (
                        <div key={l} className="break-words text-sm text-muted-foreground">{l}</div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
