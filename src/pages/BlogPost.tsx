import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCachedPosts, loadPosts } from "@/lib/blogCache";
import { useSeo } from "@/hooks/useSeo";

type Post = { title: string; excerpt: string; content: string; cover_url: string | null; created_at: string };

export default function BlogPost() {
  const { slug = "" } = useParams();
  const find = (list: Post[] | null) => list?.find((p) => (p as Post & { slug: string }).slug === slug);
  const [post, setPost] = useState<Post | null | undefined>(() => find(getCachedPosts()));
  useSeo({ title: post?.title ?? "Blog", description: post?.excerpt || "Read this article from the 5AM study community.", path: `/blog/${slug}` });
  useEffect(() => {
    setPost(find(getCachedPosts()));
    loadPosts().then((list) => setPost(find(list) ?? null));
  }, [slug]);
  return (
    <div className="cms-page">
      <article className="p-shell cms-article">
        <Link to="/blog" className="cms-back">← Back to Blog</Link>
        {post === undefined ? <p className="cms-empty">Loading…</p> : post === null ? <p className="cms-empty">This post was not found.</p> : <>
          <time>{new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time>
          <h1>{post.title}</h1>
          {post.cover_url && <img src={post.cover_url} alt={post.title} />}
          <div className="cms-content">{post.content.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
        </>}
      </article>
    </div>
  );
}
