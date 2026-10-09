import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { CalendarCheck, CalendarDays, Check, ChevronLeft, ChevronRight, Sprout, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import { addDays, istDateStr, istMonday } from "@/lib/dashboard";
import { DASHBOARD_PREVIEW } from "@/data/dashboardPreview";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type Sub = { duration_days: number; starts_at: string | null };

export default function DashboardProgress() {
  useSeo({ title: "My Progress — 5AM", description: "Your weekly attendance and plan tracker.", path: "/dashboard/progress" });
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [days, setDays] = useState<Set<string>>(new Set());
  const [sub, setSub] = useState<Sub | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => { setUser(u); setReady(true); });
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    const [a, s] = await Promise.all([
      supabase.from("attendance").select("day").eq("user_id", user.id).gte("day", addDays(istDateStr(), -120)),
      supabase.from("subscriptions").select("duration_days,starts_at").eq("user_id", user.id).eq("status", "active")
        .gte("expires_at", new Date().toISOString()).order("duration_days", { ascending: false }).order("created_at", { ascending: false }).limit(1),
    ]);
    setDays(new Set((a.data ?? []).map((r: { day: string }) => r.day)));
    setSub((s.data?.[0] as Sub | undefined) ?? null);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (!ready) return <main className="dash-page"><p className="dash-loading">Loading…</p></main>;

  const preview = !user;
  const today = istDateStr();
  const weekStart = addDays(istMonday(today), weekOffset * -7);
  const week = WEEK.map((label, i) => {
    const key = addDays(weekStart, i);
    return { label, key, done: preview ? DASHBOARD_PREVIEW.attendance[i] : days.has(key), future: preview ? i === 5 : key > today };
  });
  const weekDone = week.filter((d) => d.done).length;

  const total = preview ? 21 : sub?.duration_days ?? 21;
  const start = sub?.starts_at ? new Date(new Date(sub.starts_at).getTime() + 330 * 60000).toISOString().slice(0, 10) : null;
  const tracker = Array.from({ length: total }, (_, i) => {
    if (preview) return i < DASHBOARD_PREVIEW.planDay;
    return start ? days.has(addDays(start, i)) : false;
  });
  const doneCount = tracker.filter(Boolean).length;
  const dayNum = preview ? DASHBOARD_PREVIEW.planDay : start ? Math.min(total, Math.max(1, Math.round((Date.parse(today) - Date.parse(start)) / 86400000) + 1)) : 0;
  const pct = Math.round((doneCount / total) * 100);
  const markedToday = days.has(today);

  const markToday = async () => {
    if (!user) return;
    setBusy(true); setMsg("");
    const { error } = await supabase.from("attendance").insert({ user_id: user.id });
    setBusy(false);
    setMsg(error && !error.message.includes("duplicate") ? "Could not mark attendance. Please try again." : "Great! Today's attendance is marked ✅");
    load();
  };

  return <main className="dash-page">
    <div className="dash-shell prog-shell">
      <div className="prog-top">
        <Link to="/dashboard" className="prog-back"><ChevronLeft />Dashboard</Link>
        <label className="prog-select"><CalendarDays />
          <select value={weekOffset} onChange={(e) => setWeekOffset(Number(e.target.value))} aria-label="Choose week">
            <option value={0}>This Week</option><option value={1}>Last Week</option><option value={2}>2 Weeks Ago</option>
          </select>
        </label>
      </div>
      {preview && <span className="dash-sample-label">Sample progress — <Link to="/account">login</Link> to see yours</span>}

      <section className="dash-card prog-card">
        <header className="prog-head">
          <span className="prog-icon prog-blue"><CalendarCheck /></span>
          <div><h1>Your Attendance</h1><small>{weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Last Week" : "2 Weeks Ago"}</small></div>
          <div className="prog-badge"><b>{weekDone} / 7</b><small>Days Present</small></div>
        </header>
        <div className="prog-grid">
          {week.map((d) => <div key={d.key} className="prog-cell">
            <span className={`prog-dot ${d.done ? "is-done" : d.future ? "is-future" : ""}`}>{d.done && <Check />}</span>
            <small>{d.label}</small>
          </div>)}
        </div>
        {user && weekOffset === 0 && <div className="prog-mark">
          <Button onClick={markToday} disabled={busy || markedToday}>{markedToday ? "Today marked ✓" : busy ? "Marking…" : "Tick today's attendance"}</Button>
          {msg && <p>{msg}</p>}
        </div>}

        <hr className="prog-sep" />

        <header className="prog-head">
          <span className="prog-icon prog-green"><Target /></span>
          <div><h2>{total} Days Tracker</h2><small>Build your habit • Stay consistent</small></div>
          <div className="prog-badge"><b>Day {dayNum} / {total}</b></div>
        </header>
        <div className="prog-bar"><span><i style={{ width: `${pct}%` }} /></span><b>{pct}%</b></div>
        <div className="prog-grid">
          {tracker.map((done, i) => <div key={i} className="prog-cell">
            <span className={`prog-dot ${done ? "is-done" : ""}`}>{done && <Check />}</span>
            <small>{i + 1}</small>
          </div>)}
        </div>
        {!preview && !sub && <p className="prog-note">No active plan yet. <Link to="/account">Choose a plan</Link> to start your tracker.</p>}

        <Link to={user ? "/account" : "/plans"} className="prog-keep">
          <span className="prog-sprout"><Sprout /></span>
          <div><b>Keep going!</b><small>You're {Math.max(0, total - doneCount)} days away from completing your {total} days.</small></div>
          <ChevronRight />
        </Link>
      </section>
    </div>
  </main>;
}
