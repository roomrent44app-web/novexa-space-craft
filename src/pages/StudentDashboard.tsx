import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Circle, Crown, Flame, Sun, Target } from "lucide-react";

import { dashboardAvif, dashboardWebp, dashboardStudentsWebp } from "@/data/images";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import { addDays, fallbackName, greeting, istDateStr, istMonday } from "@/lib/dashboard";
import DashboardGoals from "@/components/site/dashboard/DashboardGoals";
import DashboardCommunity from "@/components/site/dashboard/DashboardCommunity";

import { DASHBOARD_PREVIEW } from "@/data/dashboardPreview";
import DashboardPreviewCommunity from "@/components/site/dashboard/DashboardPreviewCommunity";

type ActiveSub = {
  plan_name: string;
  duration_days: number;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
};

type StreakRow = { user_id: string; full_name: string; streak_days: number; avatar_url?: string; photo?: string };

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StudentDashboard() {
  useSeo({ title: "Student Dashboard — 5AM", description: "Track your attendance, goals, wake-up streak, notes and the 5AM community.", path: "/dashboard" });
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [active, setActive] = useState<ActiveSub | null>(null);
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [board, setBoard] = useState<StreakRow[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getUser().then(({ data: { user: u } }) => { setUser(u); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  // Keep the greeting current — re-render every minute.
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 60000); return () => clearInterval(t); }, []);

  const loadAll = useCallback(async () => {
    if (!user) return;
    const today = istDateStr();
    const weekStart = istMonday(today);
    const [profileResult, subResult, attendanceResult, streakResult] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("subscriptions").select("plan_name,duration_days,status,starts_at,expires_at")
        .eq("user_id", user.id).eq("status", "active").gte("expires_at", new Date().toISOString())
        .order("duration_days", { ascending: false }).order("created_at", { ascending: false }).limit(1),
      supabase.from("attendance").select("day").eq("user_id", user.id).gte("day", weekStart).lte("day", addDays(weekStart, 6)),
      supabase.rpc("get_wakeup_streaks"),
    ]);
    const fromProfile = ((profileResult.data as { full_name: string } | null)?.full_name ?? "").trim();
    setName(fromProfile || fallbackName(user));
    setActive((subResult.data?.[0] as ActiveSub | undefined) ?? null);
    setPresent(new Set((attendanceResult.data ?? []).map((r: { day: string }) => r.day)));
    const rows = (streakResult.data ?? []) as StreakRow[];
    setBoard(rows);
    const paths = rows.map((r) => r.avatar_url).filter((p): p is string => !!p);
    if (paths.length) {
      supabase.storage.from("avatars").createSignedUrls(paths, 3600).then(({ data: signed }) => {
        const map = new Map((signed ?? []).map((x) => [x.path, x.signedUrl]));
        setBoard(rows.map((r) => ({ ...r, photo: r.avatar_url ? map.get(r.avatar_url) ?? undefined : undefined })));
      });
    }
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  if (!ready) return <main className="dash-page"><p className="dash-loading">Loading your dashboard…</p></main>;

  const greet = greeting();
  const isPreview = !user;
  const firstName = isPreview ? "student" : (name || "Student").split(" ")[0];
  const today = istDateStr();
  const weekStart = istMonday(today);
  const weekDays = WEEK_LABELS.map((label, i) => {
    const key = addDays(weekStart, i);
    return { label, key, done: isPreview ? DASHBOARD_PREVIEW.attendance[i] : present.has(key), future: isPreview ? i === 5 : key > today };
  });
  const weekDone = weekDays.filter((d) => d.done).length;

  const planDay = active?.starts_at && active.expires_at
    ? Math.min(active.duration_days, Math.max(1, Math.floor((Date.now() - new Date(active.starts_at).getTime()) / 86400000) + 1))
    : 0;
  const planProgress = active ? Math.round((planDay / active.duration_days) * 100) : 0;
  const myStreak = user ? board.find((row) => row.user_id === user.id)?.streak_days ?? 0 : 0;
  const top5 = (isPreview ? DASHBOARD_PREVIEW.streaks : board).slice(0, 5);

  return <main className="dash-page" data-tick={tick}>
    <div className="dash-shell">

      <section className="dash-greet">
        <picture className="dash-banner-photo"><source srcSet={dashboardAvif} type="image/avif" /><img src={dashboardWebp} alt="Sunlit study desk with books, a plant and a 5AM mug" width={1536} height={512} loading="eager" /></picture>
        <div className="dash-greet-text">
          <h1>{greet.label}, {firstName}! <Sun aria-hidden="true" /></h1>
          <p>“A better you, one morning at a time.”</p>
        </div>
      </section>

      {isPreview && <span className="dash-sample-label">Sample dashboard</span>}
      <div className="dash-grid">
        <section className="dash-card dash-week">
          <header className="dash-card-head">
            <span className="dash-chip chip-blue"><CalendarCheck /></span>
            <div className="dash-card-name"><h3>Your Attendance</h3><small>This Week</small></div>
            <Link className="dash-card-arrow" to="/dashboard/progress" aria-label="Open full attendance">›</Link>
          </header>
          <p className="dash-week-count"><b>{weekDone}</b> / 7 <span>Days Present</span></p>
          <div className="dash-week-row">
            {weekDays.map((d) => (
              <span key={d.key} className="dash-week-day">
                {d.done ? <CheckCircle2 className="on" /> : d.future ? <Circle className="future" /> : <Circle className="off" />}
                <small>{d.label}</small>
              </span>
            ))}
          </div>
        </section>

        <section className="dash-card dash-tracker">
          <header className="dash-card-head">
            <span className="dash-chip chip-green"><Target /></span>
            <div className="dash-card-name"><h3>{active ? `${active.duration_days} Days Tracker` : "21 Days Tracker"}</h3><small>Build your habit</small></div>
            <Link className="dash-card-arrow" to="/dashboard/progress" aria-label="View plan tracker">›</Link>
          </header>
          {active ? (
            <>
              <p className="dash-tracker-day">Day <b>{planDay}</b> / {active.duration_days}</p>
              <div className="dash-progress" role="progressbar" aria-valuenow={planProgress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${planProgress}%` }} />
              </div>
            </>
          ) : (
            <div className="dash-tracker-empty">
              <p className="dash-tracker-day">Day <b>{isPreview ? DASHBOARD_PREVIEW.planDay : 0}</b> / 21</p>
              <div className="dash-progress" role="progressbar" aria-label="Habit progress" aria-valuenow={isPreview ? 38 : 0} aria-valuemin={0} aria-valuemax={100}>{isPreview && <span className="dash-preview-progress" />}</div>
            </div>
          )}
        </section>

        <DashboardGoals userId={user?.id} />

        <section className="dash-card dash-streak">
          <header className="dash-card-head">
            <span className="dash-chip chip-orange"><Flame /></span>
            <div className="dash-card-name"><h3>Wake-up Streak</h3><small>Top wake-up streaks</small></div>
            <Link className="dash-card-arrow" to="/dashboard/streak" aria-label="View wake-up streak">›</Link>
          </header>
          <ol className="dash-streak-list" aria-label={`Your streak: ${myStreak} days`}>
            {top5.map((row, i) => (
              <li key={row.user_id}>
                <span className={`dash-streak-avatar rank-${i + 1} ${isPreview ? `dash-portrait portrait-${i + 1}` : ""}`}>{isPreview ? <img src={dashboardStudentsWebp} alt={`${row.full_name} — sample portrait`} loading="lazy" width={1000} height={333} /> : ("photo" in row && row.photo) ? <img src={String(row.photo)} alt={row.full_name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : row.full_name.charAt(0).toUpperCase()}</span>
                <div className="dash-streak-name"><Crown className={`crown-${Math.min(i + 1, 3)}`} /><b>#{i + 1}</b></div>
                <span className="dash-streak-days">{row.streak_days} days</span>
              </li>
            ))}
            {!top5.length && [1,2,3,4,5].map((rank) => <li key={rank}><span className={`dash-streak-avatar rank-${rank}`}><span>—</span></span><div className="dash-streak-name"><Crown className={`crown-${Math.min(rank,3)}`} /><b>#{rank}</b></div><span className="dash-streak-days">—</span></li>)}
          </ol>
        </section>

        <Link to="/dashboard/journal" className="dash-card dash-journal-link"><span className="dash-chip chip-pink" aria-hidden="true">📔</span><span className="dash-card-name"><h3>My Journal</h3><small>Write daily thoughts and track your mood</small></span><span className="dash-card-arrow" aria-hidden="true">›</span></Link>
      </div>

      {user ? <DashboardCommunity userId={user.id} displayName={name} /> : <DashboardPreviewCommunity />}
    </div>
  </main>;
}
