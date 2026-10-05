import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";

type Post = { id: string; title: string; slug: string; excerpt: string; cover_url: string | null; created_at: string };

export default function Blog() {
  useSeo({ title: "Blog", description: "Study tips, motivation and morning-routine ideas from the 5AM study community.", path: "/blog" });
  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    supabase.from("blog_posts").select("id,title,slug,excerpt,cover_url,created_at").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, []);
  return (
    <div className="cms-page">
      <section className="cms-head"><div className="p-shell">
        <span className="p-eyebrow">5AM Blog</span>
        <h1>Stories for <em>Early Risers</em></h1>
        <p>Study tips, motivation and habits to help you become better every morning.</p>
      </div></section>
      <section className="p-shell cms-body">
        {posts === null ? <p className="cms-empty">Loading…</p> : posts.length === 0 ? <p className="cms-empty">No blog posts yet. Check back soon!</p> :
          <div className="cms-grid">
            {posts.map((p) => (
              <Link to={`/blog/${p.slug}`} key={p.id} className="cms-card">
                {p.cover_url && <img src={p.cover_url} alt={p.title} loading="lazy" />}
                <div><time>{new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                  <h2>{p.title}</h2><p>{p.excerpt}</p><span className="cms-more">Read more →</span></div>
              </Link>
            ))}
          </div>}
      </section>
    </div>
  );
}
