import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";

export default function Account() {
  useSeo({ title: "My Account — 5AM", description: "Create your 5AM account or log in.", path: "/account" });
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(
    new URLSearchParams(window.location.search).get("mode") === "signup" ? "signup" : "login",
  );
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [cls, setCls] = useState<{ meet_link: string; class_time: string } | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle()
      .then(({ data }) => data && setProfile(data));
    supabase.from("class_settings").select("meet_link, class_time").eq("id", 1).maybeSingle()
      .then(({ data }) => setCls(data));
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { emailRedirectTo: window.location.origin + "/account", data: { full_name: form.name, phone: form.phone } },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Account created! Please check your email and click the confirmation link, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...profile });
    setMsg(error ? error.message : "Profile saved.");
    setBusy(false);
  };

  if (!ready) return <main className="adm-wrap"><p>Loading…</p></main>;

  return <main className="adm-wrap">
    <div className="adm-card">
      {user ? <>
        <h1 className="adm-title">My Account</h1>
        <p className="adm-sub">{user.email}</p>
        <div className="acc-class">
          <strong>Live Class</strong>
          {cls?.class_time && <span className="adm-sub">{cls.class_time}</span>}
          {cls?.meet_link
            ? <a className="h-btn h-btn-orange" href={cls.meet_link} target="_blank" rel="noreferrer">Join Class</a>
            : <span className="adm-sub">The class link will appear here soon.</span>}
        </div>
        <label className="adm-label">Full name<input className="adm-input" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} /></label>
        <label className="adm-label">Mobile<input className="adm-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></label>
        {msg && <p className="adm-sub">{msg}</p>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="h-btn h-btn-orange" disabled={busy} onClick={save}>Save</button>
          <button className="h-btn" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </> : <form onSubmit={submit}>
        <h1 className="adm-title">{mode === "login" ? "Login" : "Create Account"}</h1>
        {mode === "signup" && <>
          <label className="adm-label">Full name<input className="adm-input" required value={form.name} onChange={set("name")} /></label>
          <label className="adm-label">Mobile<input className="adm-input" type="tel" value={form.phone} onChange={set("phone")} /></label>
        </>}
        <label className="adm-label">Email<input className="adm-input" type="email" required value={form.email} onChange={set("email")} /></label>
        <label className="adm-label">Password<input className="adm-input" type="password" required minLength={6} value={form.password} onChange={set("password")} /></label>
        {msg && <p className="adm-sub">{msg}</p>}
        <button className="h-btn h-btn-orange" disabled={busy} type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
        <p className="adm-sub" style={{ marginTop: 14 }}>
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button type="button" style={{ color: "var(--primary-orange, #f4511e)", fontWeight: 700 }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }}>
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </p>
      </form>}
    </div>
  </main>;
}
