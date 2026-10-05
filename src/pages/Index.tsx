import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock, MapPin, MessageCircle, Quote, Star } from "lucide-react";
import Layout from "@/components/site/Layout";
import SectionHeading from "@/components/site/SectionHeading";
import ServiceIcon from "@/components/site/ServiceIcon";
import SearchPanel from "@/components/site/SearchPanel";
import hero from "@/assets/travel/hero-mountains.jpg";
import { useSeo } from "@/hooks/useSeo";
import {
  ARTICLES,
  BENEFITS,
  CONTACT,
  DESTINATIONS,
  FAQS,
  GALLERY,
  OFFERS,
  POPULAR_SEARCHES,
  SERVICES,
  VISAS,
  STATS,
  TESTIMONIALS,
  TOURS,
} from "@/data/travel";

const waLink = `https://wa.me/${CONTACT.whatsapp}?text=Hello%20${CONTACT.brand}%2C%20I%20would%20like%20to%20plan%20a%20trip`;

export default function Index() {
  useSeo({
    title: `${CONTACT.brand} — Tours, Hotels, Flights & Visa Support`,
    description:
      "Plan your next holiday with handpicked tours, trusted hotels, flights, transfers, visa support and local experiences — with 24/7 trip support from real travel planners.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });

  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[560px] overflow-hidden pt-[74px] md:min-h-[640px]">
          <img
            src={hero}
            alt="Mountain lake landscape at sunrise"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/45" aria-hidden="true" />

          <div className="container-luxe relative flex min-h-[486px] flex-col items-center justify-center py-20 text-center md:min-h-[566px]">
            <p className="reveal inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Travel with confidence
            </p>
            <h1 className="heading-display reveal reveal-delay-1 mt-6 max-w-4xl text-background">
              Find your next journey and let us handle every detail
            </h1>
            <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-base text-background/90 md:text-lg">
              Tours, stays, flights, transfers, experiences and visas — planned by people who have
              travelled the routes themselves.
            </p>
            <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-background">
              <span className="inline-flex items-center gap-2">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                  ))}
                </span>
                4.9 average rating
              </span>
              <span>12,000+ happy travelers</span>
            </div>
          </div>
        </div>

        <div className="container-luxe relative z-10 -mt-16 md:-mt-20">
          <div className="reveal">
            <SearchPanel />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="What We Arrange"
            title="Everything your trip needs"
            subtitle="One team for the whole journey — from the first flight search to the last transfer home."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <article key={s.slug} className={`card-surface card-glow reveal reveal-zoom reveal-delay-${(i % 3) + 1} group flex flex-col`}>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                  <ServiceIcon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.short}</p>
                <Link to={`/services/${s.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Discounts & Offers"
            title="Current deals worth booking early"
            subtitle="Seasonal savings on the destinations our travelers ask for most."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((o, i) => (
              <article
                key={o.title}
                className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} card-glow group relative overflow-hidden rounded-2xl border border-border`}
              >
                <img
                  src={o.image}
                  alt={o.title}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                  <h3 className="text-lg font-bold">{o.title}</h3>
                  <p className="mt-2 text-sm text-background/85">{o.desc}</p>
                  <Link to="/services/tours" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-background">
                    {o.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLING TOURS */}
      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Best Selling"
            title="Popular tour packages"
            subtitle="Our most requested itineraries this season, with flexible dates and customisable stays."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TOURS.map((t, i) => (
              <article key={t.slug} className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} card-glow group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft`}>
                <div className="relative overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.title}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary">
                    {t.tags[0]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {t.place}
                  </p>
                  <h3 className="mt-3 text-lg font-bold">{t.title}</h3>
                  <p className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />{t.days}</span>
                    <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />{t.rating}</span>
                  </p>
                  <div className="mt-6 flex flex-1 items-end justify-between">
                    <p className="text-sm text-muted-foreground">
                      From <span className="text-xl font-extrabold text-foreground">{t.price}</span>
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Enquire <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Why Travel With Us" title="Planning you can rely on" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className={`card-surface card-glow reveal reveal-zoom reveal-delay-${(i % 4) + 1} group`}>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/25 bg-primary/5 text-primary transition-transform duration-500 group-hover:scale-110">
                  <ServiceIcon name={b.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Top Destinations"
            title="Where our travelers are going"
            subtitle="Beaches, mountains and cities we know inside out — pick one and we will build the rest."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d, i) => (
              <Link
                key={d.name}
                to="/services/tours"
                className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} group relative block overflow-hidden rounded-2xl border border-border`}
              >
                <img
                  src={d.image}
                  alt={`Travel to ${d.name}`}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-foreground/75 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-5 left-5 text-background">
                  <span className="block text-lg font-bold">{d.name}</span>
                  <span className="text-xs text-background/85">{d.tours} tours available</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VISA */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Visa Available"
            title="Visa help for the countries you want to see"
            subtitle="We prepare your documents, flag common mistakes and follow the application to a decision."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VISAS.map((v, i) => (
              <Link
                key={v.country}
                to="/services/visa"
                className={`card-surface card-glow reveal reveal-zoom reveal-delay-${(i % 3) + 1} group flex items-center justify-between gap-4`}
              >
                <span>
                  <span className="block text-base font-bold">{v.country}</span>
                  <span className="text-sm text-muted-foreground">{v.note}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Reviews" title="What our travelers say" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.name} className={`card-surface card-glow reveal reveal-zoom reveal-delay-${(i % 3) + 1}`}>
                <Quote className="h-7 w-7 text-primary/40" aria-hidden="true" />
                <p className="mt-4 text-base font-bold">{t.title}</p>
                <blockquote className="mt-3 text-sm text-muted-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.trip}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Gallery" title="Moments from recent trips" />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((img, i) => (
              <div key={i} className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} overflow-hidden rounded-xl border border-border`}>
                <img
                  src={img}
                  alt="Traveler photo from one of our trips"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SEARCHES */}
      <section className="py-16">
        <div className="container-luxe">
          <SectionHeading eyebrow="Popular Search" title="What travelers are looking for" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {POPULAR_SEARCHES.map((p) => (
              <Link
                key={p}
                to="/contact"
                className="reveal rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Travel Journal" title="Guides and inspiration" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <article key={a.slug} className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} card-glow group overflow-hidden rounded-2xl border border-border bg-background shadow-soft`}>
                <Link to={`/blog/${a.slug}`} className="block overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{a.category}</p>
                  <h3 className="mt-3 text-base font-bold">
                    <Link to={`/blog/${a.slug}`} className="hover:text-primary">{a.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.readTime}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface/50 py-16">
        <div className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal reveal-zoom reveal-delay-${(i % 4) + 1} text-center`}>
              <p className="text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="FAQs" title="Good to know before you book" />
          <div className="mx-auto mt-14 grid max-w-3xl gap-4">
            {FAQS.map((f, i) => (
              <details key={f.q} className={`card-surface card-glow reveal reveal-delay-${(i % 4) + 1} group`}>
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
                  {f.q}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-luxe">
          <div className="reveal reveal-zoom rounded-3xl border border-border bg-gradient-hero p-10 text-center md:p-16">
            <h2 className="heading-section">Ready to plan your next trip?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tell us where you want to go and we will send a day-by-day itinerary with clear pricing.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">Plan My Trip <ArrowRight className="h-4 w-4" /></Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
