import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { CalendarClock, CheckCircle2, Clock3, CreditCard, LayoutDashboard, LogOut, RefreshCw, UserRound, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Attendance from "@/components/site/Attendance";
import SignupWizard from "@/components/site/SignupWizard";
import { PURCHASE_PLANS } from "@/data/fiveam";
import { purchasePlan } from "@/lib/razorpay";
import { fallbackName, greeting } from "@/lib/dashboard";
import { useSeo } from "@/hooks/useSeo";

type Subscription = {
  id: string;
  plan_code: string;
  plan_name: string;
  duration_days: number;
  amount_paise: number;
  status: "pending" | "active" | "expired" | "failed" | "cancelled";
  starts_at: string | null;
  expires_at: string | null;
  class_days: string[];
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDate = (value: string | null) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
  : "—";

const fnError = async (error: unknown, fallback: string) => {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json() as { error?: string };
      return body.error ?? fallback;
    } catch { return fallback; }
  }
  return error instanceof Error ? error.message : fallback;
};

export default function Account() {
  useSeo({ title: "Student Panel — 5AM", description: "Manage your 5AM plan, class access and attendance.", path: "/account" });
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [cls, setCls] = useState<{ meet_link: string; class_time: string; temporary_meet_link: string; temporary_class_time: string; monthly_meet_link: string; monthly_class_time: string; active_link_mode: "temporary" | "monthly" } | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(params.get("plan") ?? "21d-699");
  const [classDays, setClassDays] = useState<string[]>([]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
    const [profileResult, classResult, subscriptionResult, attendanceResult] = await Promise.all([
      supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
      supabase.from("class_settings").select("meet_link,class_time,temporary_meet_link,temporary_class_time,monthly_meet_link,monthly_class_time,active_link_mode").eq("id", 1).maybeSingle(),
      supabase.from("subscriptions").select("id,plan_code,plan_name,duration_days,amount_paise,status,starts_at,expires_at,class_days").order("created_at", { ascending: false }),
      supabase.from("attendance").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("day", monthStart),
    ]);
      if (profileResult.data) {
        const p = profileResult.data as { full_name: string; phone: string };
        setProfile({ full_name: (p.full_name ?? "").trim() || fallbackName(user), phone: p.phone ?? "" });
      }
    setCls(classResult.data);
    setSubscriptions((subscriptionResult.data ?? []) as Subscription[]);
    setAttendanceCount(attendanceResult.count ?? 0);
  }, [user]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const active = subscriptions.find((item) => item.status === "active" && item.expires_at && new Date(item.expires_at).getTime() > Date.now());
  const latest = active ?? subscriptions[0];
  const daysLeft = active?.expires_at ? Math.max(0, Math.ceil((new Date(active.expires_at).getTime() - Date.now()) / 86400000)) : 0;
  const trialUsed = subscriptions.some((s) => s.plan_code === "trial-3d");
  const selected = PURCHASE_PLANS.find((plan) => plan.code === selectedPlan) ?? PURCHASE_PLANS[PURCHASE_PLANS.length - 1];
  const needsDays = selected.days < 7;
  const toggleDay = (d: string) => setClassDays((cur) => cur.includes(d) ? cur.filter((x) => x !== d) : cur.length >= selected.days ? cur : [...cur, d]);
  const activeClassLink = cls?.active_link_mode === "temporary" ? cls.temporary_meet_link : cls?.monthly_meet_link;
  const activeClassTime = cls?.active_link_mode === "temporary" ? cls.temporary_class_time : cls?.monthly_class_time;

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMsg("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { emailRedirectTo: window.location.origin + "/account", data: { full_name: form.name, phone: form.phone } },
      });
      setMsg(error ? error.message : data.session ? "Account created. Welcome to your student panel!" : "Account created! You can log in now.");
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

  const pay = async () => {
    if (!user || !selected) return;
    if (needsDays && classDays.length !== selected.days) { setMsg(`Please select exactly ${selected.days} class days.`); return; }
    setBusy(true); setMsg("");
    try {
      if (selected.code === "trial-3d") {
        if (trialUsed) throw new Error("The free trial can be used only once per account.");
        const { data, error } = await supabase.functions.invoke("activate-free-trial", { body: { classDays } });
        if (error) throw new Error(await fnError(error, "Could not start the free trial. Please try again."));
        if (data?.error) throw new Error(data.error);
        setMsg("Your 3 Days Free Trial is active!");
      } else {
        await purchasePlan(selected.code, { name: profile.full_name, email: user.email ?? "", phone: profile.phone }, needsDays ? classDays : []);
        setMsg("Payment successful. Your plan is active!");
      }
      await loadDashboard();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Plan could not be activated.");
    }
    setBusy(false);
  };

  if (!ready) return <main className="account-page"><p>Loading…</p></main>;
  if (!user && mode === "signup") return <main className="adm-wrap"><div className="adm-card"><SignupWizard onLogin={() => { setMode("login"); setMsg(""); }} /></div></main>;
  if (!user) return <main className="adm-wrap"><div className="adm-card"><form onSubmit={submit}>
    <h1 className="adm-title">{mode === "login" ? "Student Login" : "Create Account"}</h1>
    <p className="adm-sub">Log in to join class, track attendance and manage your plan.</p>
    {mode === "signup" && <>
      <label className="adm-label">Full name<input className="adm-input" required value={form.name} onChange={set("name")} /></label>
      <label className="adm-label">Mobile<input className="adm-input" type="tel" value={form.phone} onChange={set("phone")} /></label>
    </>}
    <label className="adm-label">Email<input className="adm-input" type="email" required value={form.email} onChange={set("email")} /></label>
    <label className="adm-label">Password<input className="adm-input" type="password" required minLength={6} value={form.password} onChange={set("password")} /></label>
    {msg && <p className="adm-sub">{msg}</p>}
    <button className="h-btn h-btn-orange" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}</button>
    <p className="adm-sub">{mode === "login" ? "New here? " : "Already have an account? "}<button className="acc-text-btn" type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }}>{mode === "login" ? "Create account" : "Login"}</button></p>
  </form></div></main>;

  return <main className="account-page"><div className="account-shell">
    <header className="account-head"><div><span className="p-eyebrow light">Student Panel</span><h1>{greeting().label}, {profile.full_name || "Student"} <span aria-hidden="true">{greeting().icon}</span></h1><p>{user.email}</p></div><div className="account-head-actions"><Link className="h-btn h-btn-orange" to="/dashboard"><LayoutDashboard /> Open Dashboard</Link><button className="account-logout" onClick={() => supabase.auth.signOut()}><LogOut /> Log out</button></div></header>

    <section className="account-summary" aria-label="Dashboard summary">
      <article><span><CreditCard /></span><div><small>Current plan</small><strong>{active?.plan_name ?? "No active plan"}</strong></div></article>
      <article><span><CalendarClock /></span><div><small>Plan expires</small><strong>{active ? formatDate(active.expires_at) : "Choose a plan"}</strong></div></article>
      <article><span><Clock3 /></span><div><small>Days remaining</small><strong>{active ? `${daysLeft} days` : "0 days"}</strong></div></article>
      <article><span><CheckCircle2 /></span><div><small>This month</small><strong>{attendanceCount} days present</strong></div></article>
    </section>

    <div className="account-grid">
      <section className="account-card account-plan">
        <div className="account-card-title"><div><small>Subscription</small><h2>{active ? "Your plan is active" : latest?.status === "pending" ? "Payment pending" : "Choose your plan"}</h2></div><span className={`account-status ${active ? "active" : ""}`}>{active ? "Active" : latest?.status === "pending" ? "Pending" : "Inactive"}</span></div>
        {active && <div className="account-plan-details"><div><small>Started</small><b>{formatDate(active.starts_at)}</b></div><div><small>Expires</small><b>{formatDate(active.expires_at)}</b></div><div><small>Paid</small><b>₹{(active.amount_paise / 100).toLocaleString("en-IN")}</b></div></div>}
        <label className="account-select">{active && daysLeft > 3 ? "Buy another plan" : active ? "Renew your plan" : "Select a plan"}<select value={selectedPlan} onChange={(event) => { setSelectedPlan(event.target.value); setClassDays([]); }}>{PURCHASE_PLANS.map((plan) => <option key={plan.code} value={plan.code}>{plan.name} — {plan.price ? `₹${plan.price.toLocaleString("en-IN")}` : "Free"}</option>)}</select></label>
        {needsDays && <div className="class-days"><p>Choose your {selected.days} class days in a week <b>({classDays.length}/{selected.days})</b></p><div className="class-days-grid">{WEEK_DAYS.map((d) => <button type="button" key={d} aria-pressed={classDays.includes(d)} className={classDays.includes(d) ? "on" : ""} disabled={!classDays.includes(d) && classDays.length >= selected.days} onClick={() => toggleDay(d)}>{d}</button>)}</div></div>}
        {active?.class_days?.length ? <p className="adm-sub">Your class days: <b>{active.class_days.join(", ")}</b></p> : null}
        <button className="h-btn h-btn-orange" onClick={pay} disabled={busy}><CreditCard /> {busy ? "Please wait…" : selected.code === "trial-3d" ? "Start Free Trial" : `Pay ₹${selected?.price.toLocaleString("en-IN")}`}</button>
        {msg && <p className="adm-sub">{msg}</p>}
      </section>

      <section className="account-card account-class"><span className="account-class-icon"><Video /></span><small>{cls?.active_link_mode === "temporary" ? "Temporary Live Class" : "Full Month Live Class"}</small><h2>Join the 5AM Study Room</h2>{activeClassTime && <p>{activeClassTime}</p>}{activeClassLink ? <a className="h-btn h-btn-orange" href={activeClassLink} target="_blank" rel="noreferrer">Join Class <Video /></a> : <p>The class link will appear here soon.</p>}</section>
    </div>

    <Attendance userId={user.id} />

    <section className="account-card account-profile"><div className="account-card-title"><div><small>My details</small><h2>Profile</h2></div><UserRound /></div><div className="account-profile-grid"><label className="adm-label">Full name<input className="adm-input" value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} /></label><label className="adm-label">Mobile<input className="adm-input" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label></div><button className="h-btn account-save" disabled={busy} onClick={save}><RefreshCw /> Save Details</button></section>
  </div></main>;
}