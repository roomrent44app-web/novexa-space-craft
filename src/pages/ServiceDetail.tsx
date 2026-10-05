import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ServiceIcon from "@/components/site/ServiceIcon";
import NotFound from "./NotFound";
import { useSeo, breadcrumbJsonLd } from "@/hooks/useSeo";
import { ARTICLES, CONTACT, SERVICES } from "@/data/travel";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);

  useSeo({
    title: service ? service.title : "Service Not Found",
    description: service ? service.short : "This page could not be found.",
    path: `/services/${slug}`,
    noindex: !service,
    jsonLd: service
      ? breadcrumbJsonLd([
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])
      : undefined,
  });

  if (!service) return <NotFound />;

  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=Hello%20${CONTACT.brand}%2C%20I%20need%20help%20with%20${encodeURIComponent(service.title)}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={service.title}
        subtitle={service.short}
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <ServiceIcon name={service.icon} className="h-5 w-5" />
            </span>
            <p className="reveal mt-6 text-lg text-muted-foreground">{service.intro}</p>

            <h2 className="mt-12 text-2xl font-bold">What's included</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.points.map((p, i) => (
                <li key={p} className={`reveal reveal-delay-${(i % 6) + 1} flex items-start gap-3 rounded-xl border border-border bg-gradient-card p-4 text-sm`}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="card-surface reveal">
              <h3 className="text-lg font-bold">Talk to a planner</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Share your dates and we will come back with options and clear pricing.
              </p>
              <Link to="/contact" className="btn-primary mt-6 w-full justify-center">
                Plan My Trip <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full justify-center">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>

            <div className="card-surface reveal reveal-delay-1">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Also available</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link to={`/services/${o.slug}`} className="text-muted-foreground hover:text-primary">{o.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface reveal reveal-delay-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">From the journal</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {ARTICLES.slice(0, 3).map((a) => (
                  <li key={a.slug}>
                    <Link to={`/blog/${a.slug}`} className="text-muted-foreground hover:text-primary">{a.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
