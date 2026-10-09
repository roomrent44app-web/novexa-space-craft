import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Stethoscope, GraduationCap, Heart, Users, Target, Sun } from "lucide-react";
import { getCachedPosts, loadPosts, subscribePosts } from "@/lib/blogCache";
import { useSeo } from "@/hooks/useSeo";
import { blogHeroWebp as blogHero } from "@/data/images";

type Post = { id: string; title: string; slug: string; excerpt: string; cover_url: string | null; created_at: string };

const CATS = ["All", "Study Tips", "Motivation", "Productivity", "Lifestyle"] as const;
type Cat = (typeof CATS)[number];

function categoryOf(p: Post): Cat {
  const t = `${p.title} ${p.excerpt}`.toLowerCase();
  if (/(goal|study|exam|revision|neet|focus)/.test(t)) return "Study Tips";
  if (/(consisten|motivat|discipline|mindset)/.test(t)) return "Motivation";
  if (/(productiv|time|routine|plan)/.test(t)) return "Productivity";
  return "Lifestyle";
}

const VALUES = [
  { icon: BookOpen, tone: "violet", title: "Real Experience", text: "We've been through the same journey as you." },
  { icon: Users, tone: "green", title: "Student First", text: "A community built for students, by students." },
  { icon: Target, tone: "rose", title: "Guidance & Support", text: "Practical, realistic and student-friendly approach." },
  { icon: Heart, tone: "red", title: "Their Mission", text: "To make studying consistent, structured and less lonely." },
];

export default function Blog() {
  useSeo({ title: "Blog", description: "Study tips, motivation and morning-routine ideas from the 5AM study community.", path: "/blog" });
  const [posts, setPosts] = useState<Post[] | null>(() => getCachedPosts());
  const [cat, setCat] = useState<Cat>("All");
  useEffect(() => {
    const off = subscribePosts(setPosts);
    loadPosts().then(setPosts);
    return off;
  }, []);
  const shown = useMemo(() => (posts ?? []).filter((p) => cat === "All" || categoryOf(p) === cat), [posts, cat]);

  return (
    <div className="bl-page">
      <div className="bl-shell">
        <section className="bl-hero" style={{ backgroundImage: `linear-gradient(90deg,hsl(20 60% 8% / .92),hsl(20 60% 8% / .55) 45%,transparent 75%),url(${blogHero})` }}>
          <h1>Blogs</h1>
          <p>Study tips, motivation and habits to help you become better every morning.</p>
        </section>

        <div className="bl-chips" role="tablist" aria-label="Blog categories">
          {CATS.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? "active" : ""} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {posts === null ? <p className="cms-empty">Loading…</p> : shown.length === 0 ? <p className="cms-empty">No blog posts here yet. Check back soon!</p> :
          <div className="bl-list">
            {shown.map((p) => (
              <Link to={`/blog/${p.slug}`} key={p.id} className="bl-card">
                <div className="bl-img">{p.cover_url && <img src={p.cover_url} alt={p.title} decoding="async" fetchPriority="high" />}</div>
                <div className="bl-body">
                  <time>{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="bl-more">Read more <ArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>}

        <section className="bl-founders">
          <div className="bl-f-left">
            <h2>Know About<br />Our Founders</h2>
            <h3>Dr. Avi Bindal &amp; Dr. Manya Gupta</h3>
            <ul className="bl-f-tags">
              <li><Stethoscope /> MBBS</li>
              <li><GraduationCap /> Doctors by Profession</li>
              <li><Heart className="red" /> Lifelong Learners</li>
            </ul>
            <p>We are Dr. Avi Bindal and Dr. Manya Gupta — a couple, both doctors, and passionate about education. We understand the challenges, distractions and stress that come with medical preparation because we have lived it ourselves.</p>
            <p>5AM.CO.IN is our way of giving back — a space where students can wake up, study together, stay consistent and become the best version of themselves, one morning at a time.</p>
            <Link to="/blog/founders-story" className="bl-f-btn">Read Our Full Story <ArrowRight /></Link>
          </div>
          <div className="bl-f-right">
            <div className="bl-f-deco"><Sun /><span>Same Students<br />Brighter Mornings ♡</span></div>
            {VALUES.map((v) => (
              <div className="bl-f-val" key={v.title}>
                <span className={`bl-f-ic ${v.tone}`}><v.icon /></span>
                <div><strong>{v.title}</strong><small>{v.text}</small></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
