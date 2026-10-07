import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Circle, Crown, Flame, LogOut, Target, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import { addDays, greeting, istDateStr, istMonday } from "@/lib/dashboard";
import DashboardGoals from "@/components/site/dashboard/DashboardGoals";
import DashboardNotes from "@/components/site/dashboard/DashboardNotes";
import DashboardCommunity from "@/components/site/dashboard/DashboardCommunity";

type ActiveSub = {
  plan_name: string;
  duration_days: number;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
};

type StreakRow = { user_id: string; full_name: string; streak_days: number };

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StudentDashboard() {
  useSeo({ title: "Student Dashboard — 5AM", description: "Track your attendance, goals, wake-up streak, notes and the 5AM community.", path: "/dashboard" });
  const navigate = useNavigate();
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

  void navigate;

  // Keep the greeting current — re-render every minute.
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 60000); return () => clearInterval(t); }, []);

  const loadAll = useCallback(async () => {
    if (!user) return;
    const today = istDateStr();
    const weekStart = istMonday(today);
    const [profileResult, subResult, attendanceResult, streakResult] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("subscriptions").select("plan_name,duration_days,status,starts_at,expires_at")
        .eq("status", "active").gte("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1),
      supabase.from("attendance").select("day").eq("user_id", user.id).gte("day", weekStart).lte("day", addDays(weekStart, 6)),
      supabase.rpc("get_wakeup_streaks"),
    ]);
    if (profileResult.data) setName((profileResult.data as { full_name: string }).full_name ?? "");
    setActive((subResult.data?.[0] as ActiveSub | undefined) ?? null);
    setPresent(new Set((attendanceResult.data ?? []).map((r: { day: string }) => r.day)));
    setBoard((streakResult.data ?? []) as StreakRow[]);
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  if (!ready) return <main className="dash-page"><p className="dash-loading">Loading your dashboard…</p></main>;

  const greet = greeting();
  const firstName = (name || "Student").split(" ")[0];
  const today = istDateStr();
  const weekStart = istMonday(today);
  const weekDays = WEEK_LABELS.map((label, i) => {
    const key = addDays(weekStart, i);
    return { label, key, done: present.has(key), future: key > today };
  });
  const weekDone = weekDays.filter((d) => d.done).length;

  const planDay = active?.starts_at && active.expires_at
    ? Math.min(active.duration_days, Math.max(1, Math.floor((Date.now() - new Date(active.starts_at).getTime()) / 86400000) + 1))
    : 0;
  const planProgress = active ? Math.round((planDay / active.duration_days) * 100) : 0;
  const myStreak = user ? board.find((row) => row.user_id === user.id)?.streak_days ?? 0 : 0;
  const guestCard = (title: string, text: string) => <section className="dash-card">
    <header className="dash-card-head"><div className="dash-card-name"><h3>{title}</h3><small>{text}</small></div></header>
    <div className="dash-tracker-empty"><Link className="h-btn h-btn-orange" to="/account">Login to use</Link></div>
  </section>;
  const top5 = board.slice(0, 5);

  return <main className="dash-page" data-tick={tick}>
    <div className="dash-shell">

      <section className="dash-greet">
        <div className="dash-greet-text">
          <h1>{greet.label}, {firstName}! <span aria-hidden="true">{greet.icon}</span></h1>
          <p>“A better you, one morning at a time.”</p>
        </div>
        <div className="dash-greet-actions">
          {user ? <>
            <Link className="dash-greet-link" to="/account">My Plan &amp; Subscription</Link>
            <button className="dash-greet-link ghost" onClick={() => supabase.auth.signOut()}><LogOut /> Log out</button>
          </> : <>
            <Link className="dash-greet-link" to="/account">Login</Link>
            <Link className="dash-greet-link ghost" to="/account?mode=signup">Create Account</Link>
          </>}
        </div>
      </section>

      <div className="dash-grid">
        <section className="dash-card dash-week">
          <header className="dash-card-head">
            <span className="dash-chip chip-blue"><CalendarCheck /></span>
            <div className="dash-card-name"><h3>Your Attendance</h3><small>This Week</small></div>
            <Link className="dash-card-arrow" to="/account" aria-label="Open full attendance">›</Link>
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
            <div className="dash-card-name"><h3>{active ? `${active.duration_days} Days Tracker` : "Habit Tracker"}</h3><small>{active ? active.plan_name : "Build your habit"}</small></div>
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
              <p>Choose a plan to start your wake-up journey.</p>
              <Link className="h-btn h-btn-orange" to="/plans">See Plans</Link>
            </div>
          )}
        </section>

        {user ? <DashboardGoals userId={user.id} /> : <>{guestCard("Daily Goals", "Plan your study day")}{guestCard("Weekly Goals", "Plan your week")}</>}

        <section className="dash-card dash-streak">
          <header className="dash-card-head">
            <span className="dash-chip chip-orange"><Flame /></span>
            <div className="dash-card-name"><h3>Wake-up Streak</h3><small>Top wake-up streaks</small></div>
          </header>
          <p className="dash-streak-mine"><Flame /> <b>{myStreak}</b> day streak — keep it alive!</p>
          <ol className="dash-streak-list">
            {top5.map((row, i) => (
              <li key={row.user_id}>
                <span className={`dash-streak-avatar rank-${i + 1}`}>{row.full_name.charAt(0).toUpperCase()}</span>
                <div className="dash-streak-name">{i < 3 && <Crown className={`crown-${i + 1}`} />}<b>{row.full_name}</b></div>
                <span className="dash-streak-days">{row.streak_days} days</span>
              </li>
            ))}
            {!top5.length && <li className="dash-empty">Mark attendance daily to appear on the leaderboard!</li>}
          </ol>
        </section>

        {user ? <DashboardNotes userId={user.id} /> : guestCard("My Notes", "Save, organize and access your notes")}
      </div>

      {user ? <DashboardCommunity userId={user.id} displayName={name} /> : guestCard("Community", "Share your progress, doubts and stay motivated together.")}
    </div>
  </main>;
}
