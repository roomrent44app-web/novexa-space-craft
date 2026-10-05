import { Link, useParams } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import NotFound from "./NotFound";
import { useSeo, breadcrumbJsonLd } from "@/hooks/useSeo";
import { ARTICLES, CONTACT, SERVICES } from "@/data/travel";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = ARTICLES.find((a) => a.slug === slug);

  useSeo({
    title: post ? post.title : "Article Not Found",
    description: post ? post.excerpt : "This article could not be found.",
    path: `/blog/${slug}`,
    noindex: !post,
    jsonLd: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Organization", name: CONTACT.brand },
          },
          breadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!post) return <NotFound />;

  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=Hello%20${CONTACT.brand}%2C%20I%20read%20your%20article%20and%20would%20like%20to%20plan%20a%20trip`;
  const related = ARTICLES.filter((a) => a.slug !== post.slug);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={`${post.date} · ${post.readTime}`}
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container-luxe grid gap-14 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <div className="reveal overflow-hidden rounded-2xl border border-border">
              <img
                src={post.image}
                alt={post.title}
                width={1536}
                height={1024}
                loading="eager"
                decoding="async"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
            <div className="mt-10 space-y-6">
              {post.content.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">{p}</p>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="card-surface reveal">
              <h2 className="text-lg font-bold">Planning this trip?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We will put together an itinerary with stays, transfers and activities included.
              </p>
              <Link to="/contact" className="btn-primary mt-6 w-full justify-center">
                Plan My Trip <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full justify-center">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>

            <div className="card-surface reveal reveal-delay-1">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">More articles</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {related.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/blog/${a.slug}`} className="text-muted-foreground hover:text-primary">{a.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface reveal reveal-delay-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">We arrange</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="text-muted-foreground hover:text-primary">{s.title}</Link>
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
