import { supabase } from "@/integrations/supabase/client";

// Shared blog cache: fetched once at app start, kept in localStorage, and cover photos warmed,
// so /blog and every article open instantly without a loading state.
export type CachedPost = { id: string; title: string; slug: string; excerpt: string; content: string; cover_url: string | null; created_at: string };

const KEY = "5am-blog-cache-v1";
let posts: CachedPost[] | null = null;
let inflight: Promise<CachedPost[]> | null = null;
const listeners = new Set<(p: CachedPost[]) => void>();

try { const raw = localStorage.getItem(KEY); if (raw) posts = JSON.parse(raw); } catch { /* ignore */ }

const warm = (list: CachedPost[]) => list.forEach((p) => { if (p.cover_url) { const i = new Image(); i.decoding = "async"; i.src = p.cover_url; } });

export const getCachedPosts = () => posts;

export function loadPosts(): Promise<CachedPost[]> {
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase.from("blog_posts")
      .select("id,title,slug,excerpt,content,cover_url,created_at").eq("published", true).order("created_at", { ascending: false });
    if (error || !data) return posts ?? [];
    posts = data as CachedPost[];
    try { localStorage.setItem(KEY, JSON.stringify(posts)); } catch { /* quota */ }
    warm(posts);
    listeners.forEach((l) => l(posts!));
    return posts;
  })().finally(() => { setTimeout(() => { inflight = null; }, 30000); });
  return inflight;
}

export function subscribePosts(fn: (p: CachedPost[]) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

if (posts) warm(posts);
