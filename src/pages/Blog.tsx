import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { useSeo, breadcrumbJsonLd } from "@/hooks/useSeo";
import { ARTICLES } from "@/data/travel";

export default function Blog() {
  useSeo({
    title: "Travel Journal",
    description:
      "Destination guides, seasonal advice and practical travel tips written by our planners — from beach escapes to alpine rail journeys.",
    path: "/blog",
    jsonLd: breadcrumbJsonLd([{ name: "Blog", path: "/blog" }]),
  });

  return (
    <>
      <PageHero
        eyebrow="Travel Journal"
        title="Guides, tips and inspiration"
        subtitle="Practical advice from the routes we plan most — written to help you decide where and when to go."
        breadcrumbs={[{ name: "Blog", path: "/blog" }]}
      />

      <section className="py-20 md:py-24">
        <div className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <article key={a.slug} className={`reveal reveal-zoom reveal-delay-${(i % 3) + 1} card-glow group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft`}>
              <Link to={`/blog/${a.slug}`} className="overflow-hidden">
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
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{a.category}</p>
                <h2 className="mt-3 text-base font-bold">
                  <Link to={`/blog/${a.slug}`} className="hover:text-primary">{a.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.readTime}</p>
                <Link to={`/blog/${a.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
