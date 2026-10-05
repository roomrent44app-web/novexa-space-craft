import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock, MapPin, Star } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ServiceIcon from "@/components/site/ServiceIcon";
import SectionHeading from "@/components/site/SectionHeading";
import { useSeo, SITE_URL, breadcrumbJsonLd } from "@/hooks/useSeo";
import { SERVICES, TOURS } from "@/data/travel";

export default function Services() {
  useSeo({
    title: "Destinations & Services",
    description:
      "Explore what we arrange — guided tours, hotels, flights, airport transfers, visa processing and local experiences, all planned around your dates and budget.",
    path: "/services",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: `${SITE_URL}/services/${s.slug}`,
        })),
      },
      breadcrumbJsonLd([{ name: "Services", path: "/services" }]),
    ],
  });

  return (
    <>
      <PageHero
        eyebrow="What We Arrange"
        title="Tours, stays, flights and everything in between"
        subtitle="Pick the parts you need or hand us the whole trip — we plan, book and stay available while you travel."
        breadcrumbs={[{ name: "Services", path: "/services" }]}
      />

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article key={s.slug} className={`card-surface card-glow reveal reveal-zoom reveal-delay-${(i % 3) + 1} group flex flex-col`}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                <ServiceIcon name={s.icon} className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold">{s.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.short}</p>
              <Link to={`/services/${s.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Packages" title="Popular tour packages" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TOURS.map((t, i) => (
              <article key={t.slug} className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} card-glow group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft`}>
                <img
                  src={t.image}
                  alt={t.title}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
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

      <section className="py-24">
        <div className="container-luxe">
          <div className="reveal flex flex-col items-center gap-5 rounded-2xl border border-border bg-gradient-card p-10 text-center">
            <p className="text-lg font-semibold">Not sure where to go this year?</p>
            <Link to="/contact" className="btn-primary">Get a Free Itinerary <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
