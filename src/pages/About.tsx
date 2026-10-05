import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import ServiceIcon from "@/components/site/ServiceIcon";
import { useSeo, breadcrumbJsonLd } from "@/hooks/useSeo";
import { BENEFITS, CONTACT, STATS } from "@/data/travel";

export default function About() {
  useSeo({
    title: "About Us",
    description: `${CONTACT.brand} is a travel planning team arranging tours, hotels, flights, transfers, experiences and visa support for travelers who want the details handled properly.`,
    path: "/about",
    jsonLd: breadcrumbJsonLd([{ name: "About", path: "/about" }]),
  });

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A small team that plans trips properly"
        subtitle="We started because too many holidays are sold as packages and left to chance. Every itinerary we send is built route by route, with the stays and transfers checked before you see a price."
        breadcrumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          <div className="card-surface reveal">
            <h2 className="text-2xl font-bold">What we do</h2>
            <p className="mt-4 text-muted-foreground">
              We plan and book complete trips — tours, hotels, flights, ground transport, activities
              and visa paperwork — so you have one point of contact instead of five.
            </p>
          </div>
          <div className="card-surface reveal reveal-delay-1">
            <h2 className="text-2xl font-bold">How we work</h2>
            <p className="mt-4 text-muted-foreground">
              You tell us the dates, the budget and the pace you enjoy. We send an itinerary with
              everything priced clearly, adjust it until it fits, and stay reachable while you travel.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Our Promise" title="What you can expect from us" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className={`card-surface reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ServiceIcon name={b.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal reveal-delay-${(i % 4) + 1} rounded-2xl border border-border bg-gradient-card p-8 text-center`}>
              <p className="text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxe">
          <div className="reveal rounded-3xl border border-border bg-gradient-hero p-10 text-center md:p-16">
            <h2 className="heading-section">Let's plan something worth remembering.</h2>
            <Link to="/contact" className="btn-primary mt-8">Plan My Trip <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
