import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { Bell, BookText, CalendarCheck, CheckCircle2, Circle, Crown, Flame, Plus, Search, Sun, Target, UsersRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/site/Logo";
import { dashboardAvif, dashboardWebp } from "@/data/images";
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
  const top5 = board.slice(0, 5);

  return <><header className="dash-topbar"><div className="dash-topbar-inner"><Logo /><div className="dash-topbar-actions"><Button variant="ghost" size="icon" asChild title="Browse study articles"><Link to="/blog" aria-label="Browse study articles"><Search /></Link></Button><Button variant="ghost" size="icon" asChild title="My account"><Link to="/account" aria-label="My account notifications"><Bell /><i /></Link></Button><Link className="dash-profile" to="/account" aria-label="Open my account">{user ? firstName.charAt(0) : <UserRound />}</Link></div></div></header><main className="dash-page" data-tick={tick}>
    <div className="dash-shell">

      <section className="dash-greet">
        <picture className="dash-banner-photo"><source srcSet={dashboardAvif} type="image/avif" /><img src={dashboardWebp} alt="Sunlit study desk with books, a plant and a 5AM mug" width={1536} height={512} loading="eager" /></picture>
        <div className="dash-greet-text">
          <h1>{greet.label}, {firstName}! <Sun aria-hidden="true" /></h1>
          <p>“A better you, one morning at a time.”</p>
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
            <div className="dash-card-name"><h3>{active ? `${active.duration_days} Days Tracker` : "21 Days Tracker"}</h3><small>Build your habit</small></div>
            <Link className="dash-card-arrow" to="/account" aria-label="View plan tracker">›</Link>
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
              <p className="dash-tracker-day">Day <b>0</b> / 21</p>
              <div className="dash-progress" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}><span /></div>
            </div>
          )}
        </section>

        <DashboardGoals userId={user?.id} />

        <section className="dash-card dash-streak">
          <header className="dash-card-head">
            <span className="dash-chip chip-orange"><Flame /></span>
            <div className="dash-card-name"><h3>Wake-up Streak</h3><small>Top wake-up streaks</small></div>
            <Link className="dash-card-arrow" to="/account" aria-label="View wake-up streak">›</Link>
          </header>
          <ol className="dash-streak-list" aria-label={`Your streak: ${myStreak} days`}>
            {top5.map((row, i) => (
              <li key={row.user_id}>
                <span className={`dash-streak-avatar rank-${i + 1}`}>{row.full_name.charAt(0).toUpperCase()}</span>
                <div className="dash-streak-name"><Crown className={`crown-${Math.min(i + 1, 3)}`} /><b>#{i + 1}</b></div>
                <span className="dash-streak-days">{row.streak_days} days</span>
              </li>
            ))}
            {!top5.length && [1,2,3,4,5].map((rank) => <li key={rank}><span className={`dash-streak-avatar rank-${rank}`}><UserRound /></span><div className="dash-streak-name"><Crown className={`crown-${Math.min(rank,3)}`} /><b>#{rank}</b></div><span className="dash-streak-days">—</span></li>)}
          </ol>
        </section>

        {user ? <DashboardNotes userId={user.id} /> : <section className="dash-card dash-notes"><header className="dash-card-head"><span className="dash-chip chip-pink"><BookText /></span><div className="dash-card-name"><h3>My Notes</h3><small>Save, organize and access your notes</small></div><Link className="dash-card-arrow" to="/account" aria-label="Open notes">›</Link></header><ul className="dash-note-list"><li className="dash-empty"><BookText /> No notes yet</li></ul><Button variant="secondary" className="dash-new-note" asChild><Link to="/account"><Plus />Create New Note</Link></Button></section>}
      </div>

      {user ? <DashboardCommunity userId={user.id} displayName={name} /> : <section className="dash-card dash-community"><header className="dash-card-head"><span className="dash-chip chip-orange"><UsersRound /></span><div className="dash-card-name"><h3>Community</h3><small>Share your progress, doubts and stay motivated together.</small></div><Button className="dash-post-btn" asChild><Link to="/account"><Plus />Post</Link></Button></header><div className="dash-cat-row">{["All","Progress","Doubts","Motivation","Study Tips"].map((category,i) => <Button key={category} variant="ghost" className={i === 0 ? "on" : ""} asChild><Link to="/account">{category}</Link></Button>)}</div><div className="dash-feed"><p className="dash-empty">No posts yet</p></div></section>}
    </div>
  </main></>;
}
