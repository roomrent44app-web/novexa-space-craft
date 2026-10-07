import { useCallback, useEffect, useState } from "react";
import { Heart, MessageSquarePlus, UsersRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/lib/dashboard";

const CATEGORIES = ["All", "Progress", "Doubts", "Motivation", "Study Tips"] as const;
const POST_CATEGORIES = CATEGORIES.slice(1) as unknown as string[];

type Post = {
  id: string;
  user_id: string;
  author_name: string;
  category: string;
  content: string;
  created_at: string;
  community_post_likes: { user_id: string }[];
};

export default function DashboardCommunity({ userId, displayName }: { userId: string; displayName: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [composing, setComposing] = useState(false);
  const [category, setCategory] = useState("Progress");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("community_posts")
      .select("id,user_id,author_name,category,content,created_at,community_post_likes(user_id)")
      .order("created_at", { ascending: false }).limit(30);
    setPosts((data ?? []) as unknown as Post[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("community_posts")
      .insert({ user_id: userId, author_name: displayName || "Student", category, content: text.trim() });
    setBusy(false);
    if (!error) { setText(""); setComposing(false); await load(); }
  };

  const toggleLike = async (post: Post) => {
    const liked = post.community_post_likes.some((l) => l.user_id === userId);
    setPosts((cur) => cur.map((p) => p.id !== post.id ? p : {
      ...p,
      community_post_likes: liked
        ? p.community_post_likes.filter((l) => l.user_id !== userId)
        : [...p.community_post_likes, { user_id: userId }],
    }));
    if (liked) await supabase.from("community_post_likes").delete().eq("post_id", post.id).eq("user_id", userId);
    else await supabase.from("community_post_likes").insert({ post_id: post.id, user_id: userId });
  };

  const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="dash-card dash-community">
      <header className="dash-card-head">
        <span className="dash-chip chip-orange"><UsersRound /></span>
        <div className="dash-card-name">
          <h3>Community</h3>
          <small>Share your progress, doubts and stay motivated together.</small>
        </div>
        <button type="button" className="h-btn h-btn-orange dash-post-btn" onClick={() => setComposing(!composing)}>
          <MessageSquarePlus /> {composing ? "Close" : "Post"}
        </button>
      </header>

      {composing && (
        <form className="dash-post-form" onSubmit={publish}>
          <select className="dash-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {POST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className="dash-input" rows={2} placeholder="Share something with the 5AM community…" required value={text} onChange={(e) => setText(e.target.value)} />
          <button className="h-btn h-btn-orange" type="submit" disabled={busy}>{busy ? "Posting…" : "Publish Post"}</button>
        </form>
      )}

      <div className="dash-cat-row" role="tablist" aria-label="Post categories">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={filter === c} className={filter === c ? "on" : ""} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <ul className="dash-feed">
        {visible.map((post) => {
          const liked = post.community_post_likes.some((l) => l.user_id === userId);
          return (
            <li key={post.id}>
              <span className="dash-feed-avatar">{post.author_name.charAt(0).toUpperCase()}</span>
              <div className="dash-feed-body">
                <div className="dash-feed-top"><b>{post.author_name}</b><small>{timeAgo(post.created_at)} · {post.category}</small></div>
                <p>{post.content}</p>
                <button type="button" className={liked ? "liked" : ""} aria-pressed={liked} onClick={() => toggleLike(post)}>
                  <Heart /> {post.community_post_likes.length}
                </button>
              </div>
            </li>
          );
        })}
        {!visible.length && <li className="dash-empty">No posts here yet — be the first to share!</li>}
      </ul>
    </section>
  );
}
