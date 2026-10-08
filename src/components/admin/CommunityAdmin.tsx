import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, Search, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminData } from "./types";

type Post = { id: string; user_id: string; author_name: string; category: string; content: string; created_at: string };
type BanRow = { user_id: string; reason: string; created_at: string };

export default function CommunityAdmin({ data }: { data: AdminData }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bans, setBans] = useState<BanRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const profileMap = useMemo(() => new Map(data.profiles.map((p) => [p.id, p])), [data.profiles]);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, b] = await Promise.all([
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("student_bans").select("user_id,reason,created_at").order("created_at", { ascending: false }),
    ]);
    if (p.error || b.error) toast.error((p.error ?? b.error)!.message);
    setPosts((p.data as Post[]) ?? []); setBans((b.data as BanRow[]) ?? []); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const banned = new Set(bans.map((b) => b.user_id));
  const q = search.trim().toLowerCase();
  const rows = posts.filter((p) => !q || `${p.author_name} ${p.content} ${profileMap.get(p.user_id)?.email ?? ""}`.toLowerCase().includes(q));

  const removePost = async (post: Post) => {
    if (!confirm("Delete this comment permanently?")) return;
    await supabase.from("community_post_likes").delete().eq("post_id", post.id);
    const { error } = await supabase.from("community_posts").delete().eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("Comment deleted"); setPosts((list) => list.filter((x) => x.id !== post.id));
  };
  const ban = async (userId: string, name: string) => {
    const reason = prompt(`Ban ${name}? Enter a reason (optional):`, "Negative / inappropriate comments");
    if (reason === null) return;
    const { data: me } = await supabase.auth.getUser();
    const { error } = await supabase.from("student_bans").insert({ user_id: userId, reason: reason.slice(0, 300), banned_by: me.user!.id });
    if (error) return toast.error(error.message);
    if (confirm(`Also delete all comments by ${name}?`)) {
      const ids = posts.filter((p) => p.user_id === userId).map((p) => p.id);
      if (ids.length) { await supabase.from("community_post_likes").delete().in("post_id", ids); await supabase.from("community_posts").delete().in("id", ids); }
    }
    toast.success(`${name} is banned`); load();
  };
  const unban = async (userId: string) => {
    const { error } = await supabase.from("student_bans").delete().eq("user_id", userId);
    if (error) return toast.error(error.message);
    toast.success("Student unbanned"); load();
  };

  return <div className="admin-stack">
    <div className="admin-stat-grid">
      <div className="admin-stat"><small>Total comments</small><b>{posts.length}</b></div>
      <div className="admin-stat"><small>Commenting students</small><b>{new Set(posts.map((p) => p.user_id)).size}</b></div>
      <div className="admin-stat"><small>Banned students</small><b>{bans.length}</b></div>
    </div>
    <div className="admin-toolbar">
      <label className="admin-search"><Search /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search comment or student" /></label>
    </div>
    <section className="admin-panel admin-table-panel">
      <div className="admin-panel-head"><div><small>Community</small><h2>All student comments</h2></div></div>
      <Table>
        <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Comment</TableHead><TableHead>Category</TableHead><TableHead>Posted</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map((p) => {
          const prof = profileMap.get(p.user_id); const name = prof?.full_name || p.author_name || "Student";
          return <TableRow key={p.id}>
            <TableCell><div className="admin-person"><div><b>{name}</b><small>{prof?.email || p.user_id.slice(0, 8)}</small>{banned.has(p.user_id) && <span className="admin-status payment-failed">banned</span>}</div></div></TableCell>
            <TableCell style={{ maxWidth: 360, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{p.content}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>{new Date(p.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
            <TableCell><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button size="sm" variant="outline" onClick={() => removePost(p)}><Trash2 /> Delete</Button>
              {!banned.has(p.user_id) && <Button size="sm" variant="destructive" onClick={() => ban(p.user_id, name)}><Ban /> Ban</Button>}
            </div></TableCell>
          </TableRow>;
        })}{!rows.length && <TableRow><TableCell colSpan={5}><p className="admin-empty">{loading ? "Loading…" : "No comments found."}</p></TableCell></TableRow>}</TableBody>
      </Table>
    </section>
    <section className="admin-panel admin-table-panel">
      <div className="admin-panel-head"><div><small>Moderation</small><h2>Banned students</h2></div></div>
      <Table>
        <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Reason</TableHead><TableHead>Banned on</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
        <TableBody>{bans.map((b) => { const prof = profileMap.get(b.user_id); return <TableRow key={b.user_id}>
          <TableCell><div className="admin-person"><div><b>{prof?.full_name || "Student"}</b><small>{prof?.email || b.user_id.slice(0, 8)}</small></div></div></TableCell>
          <TableCell>{b.reason || "—"}</TableCell>
          <TableCell>{new Date(b.created_at).toLocaleDateString("en-IN")}</TableCell>
          <TableCell><Button size="sm" variant="outline" onClick={() => unban(b.user_id)}><UserCheck /> Unban</Button></TableCell>
        </TableRow>; })}{!bans.length && <TableRow><TableCell colSpan={4}><p className="admin-empty">No banned students.</p></TableCell></TableRow>}</TableBody>
      </Table>
    </section>
  </div>;
}
