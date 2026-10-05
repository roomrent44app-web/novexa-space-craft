import { FormEvent, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, slugify } from "@/lib/media";
import { useSeo } from "@/hooks/useSeo";
import { toast } from "sonner";

type Post = { id: string; title: string; slug: string; excerpt: string; content: string; cover_url: string | null; published: boolean; created_at: string };
type Img = { id: string; url: string; caption: string };
const emptyPost = { id: "", title: "", excerpt: "", content: "", cover_url: null as string | null, published: true };

export default function Admin() {
  useSeo({ title: "Admin Panel", description: "5AM admin panel.", path: "/admin" });
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) return <div className="cms-page"><p className="cms-empty">Loading…</p></div>;
  if (!session) return <Login />;
  if (isAdmin === null) return <div className="cms-page"><p className="cms-empty">Loading…</p></div>;
  if (!isAdmin) return <div className="cms-page p-shell cms-body"><p className="cms-empty">This account is not an admin.</p><button className="adm-btn" onClick={() => supabase.auth.signOut()}>Sign out</button></div>;
  return <Dashboard email={session.user.email ?? ""} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) toast.error("Wrong email or password");
  };
  return (
    <div className="cms-page"><div className="p-shell cms-body">
      <form className="adm-login" onSubmit={submit}>
        <h1>Admin <em>Login</em></h1>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        <button className="adm-btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div></div>
  );
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<"blog" | "gallery">("blog");
  return (
    <div className="cms-page"><div className="p-shell cms-body">
      <div className="adm-top">
        <div><h1>Admin <em>Panel</em></h1><p>Signed in as {email}</p></div>
        <button className="adm-btn ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <div className="adm-tabs">
        <button className={tab === "blog" ? "on" : ""} onClick={() => setTab("blog")}>Blog Posts</button>
        <button className={tab === "gallery" ? "on" : ""} onClick={() => setTab("gallery")}>Gallery</button>
      </div>
      {tab === "blog" ? <BlogAdmin /> : <GalleryAdmin />}
    </div></div>
  );
}

function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyPost);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const load = () => supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => setPosts(data ?? []));
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      let cover_url = form.cover_url;
      if (file) cover_url = await uploadMedia(file, "blog");
      const row = { title: form.title, excerpt: form.excerpt, content: form.content, published: form.published, cover_url };
      const { error } = form.id
        ? await supabase.from("blog_posts").update({ ...row, updated_at: new Date().toISOString() }).eq("id", form.id)
        : await supabase.from("blog_posts").insert({ ...row, slug: `${slugify(form.title)}-${Date.now().toString(36)}` });
      if (error) throw error;
      toast.success(form.id ? "Post updated" : "Post published");
      setForm(emptyPost); setFile(null); (document.getElementById("adm-cover") as HTMLInputElement | null)?.value && ((document.getElementById("adm-cover") as HTMLInputElement).value = "");
      load();
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Post deleted"); load(); }
  };

  return (
    <div className="adm-grid">
      <form className="adm-card" onSubmit={save}>
        <h2>{form.id ? "Edit post" : "Write a new post"}</h2>
        <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Short intro<textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
        <label>Article text<textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Leave an empty line between paragraphs" /></label>
        <label>Cover image<input id="adm-cover" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
        {form.cover_url && !file && <img className="adm-thumb" src={form.cover_url} alt="" />}
        <label className="adm-check"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Show on website</label>
        <div className="adm-row"><button className="adm-btn" disabled={busy}>{busy ? "Saving…" : form.id ? "Save changes" : "Publish post"}</button>
          {form.id && <button type="button" className="adm-btn ghost" onClick={() => setForm(emptyPost)}>Cancel</button>}</div>
      </form>
      <div className="adm-card">
        <h2>All posts ({posts.length})</h2>
        {posts.length === 0 && <p className="cms-empty">No posts yet.</p>}
        <ul className="adm-list">{posts.map((p) => (
          <li key={p.id}>
            {p.cover_url ? <img src={p.cover_url} alt="" /> : <span className="adm-noimg" />}
            <div><b>{p.title}</b><small>{p.published ? "Live" : "Hidden"} · {new Date(p.created_at).toLocaleDateString("en-IN")}</small></div>
            <button className="adm-link" onClick={() => setForm({ id: p.id, title: p.title, excerpt: p.excerpt, content: p.content, cover_url: p.cover_url, published: p.published })}>Edit</button>
            <button className="adm-link danger" onClick={() => remove(p.id)}>Delete</button>
          </li>))}</ul>
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const [items, setItems] = useState<Img[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => supabase.from("gallery_images").select("id,url,caption").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const upload = async (e: FormEvent) => {
    e.preventDefault(); if (!files?.length) return; setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const url = await uploadMedia(f, "gallery");
        const { error } = await supabase.from("gallery_images").insert({ url, caption });
        if (error) throw error;
      }
      toast.success("Photos added to gallery");
      setCaption(""); setFiles(null); (e.target as HTMLFormElement).reset(); load();
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="adm-grid">
      <form className="adm-card" onSubmit={upload}>
        <h2>Add photos</h2>
        <label>Photos<input type="file" accept="image/*" multiple required onChange={(e) => setFiles(e.target.files)} /></label>
        <label>Caption (optional)<input value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
        <button className="adm-btn" disabled={busy}>{busy ? "Uploading…" : "Upload"}</button>
      </form>
      <div className="adm-card">
        <h2>Gallery ({items.length})</h2>
        {items.length === 0 && <p className="cms-empty">No photos yet.</p>}
        <div className="adm-photos">{items.map((i) => (
          <figure key={i.id}><img src={i.url} alt={i.caption} /><button className="adm-link danger" onClick={() => remove(i.id)}>Delete</button></figure>
        ))}</div>
      </div>
    </div>
  );
}
