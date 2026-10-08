import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import { DASHBOARD_PREVIEW } from "@/data/dashboardPreview";
import { dashboardStudentsWebp } from "@/data/images";

type Row = { user_id: string; full_name: string; avatar_url: string; days: number; photo?: string };
type Period = "all" | "week";

export default function RankersStreak() {
  useSeo({ title: "Rankers Streak — 5AM", description: "Top 5AM students ranked by attendance.", path: "/dashboard/streak" });
  const [period, setPeriod] = useState<Period>("all");
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);
  useEffect(() => {
    if (userId === undefined) return;
    if (!userId) { setLoading(false); return; }
    let live = true; setLoading(true);
    supabase.rpc("get_streak_rankings", { _period: period }).then(async ({ data }) => {
      const list = (data ?? []) as Row[];
      const paths = list.map((r) => r.avatar_url).filter(Boolean);
      if (paths.length) {
        const { data: signed } = await supabase.storage.from("avatars").createSignedUrls(paths, 3600);
        const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
        list.forEach((r) => { r.photo = r.avatar_url ? map.get(r.avatar_url) ?? undefined : undefined; });
      }
      if (live) { setRows(list); setLoading(false); }
    });
    return () => { live = false; };
  }, [userId, period]);

  const isPreview = userId === null;
  const shown: (Row & { sampleIdx?: number })[] = isPreview
    ? DASHBOARD_PREVIEW.streaks.map((s, i) => ({ user_id: s.user_id, full_name: s.full_name, avatar_url: "", days: period === "all" ? s.streak_days : Math.min(7, 7 - i), sampleIdx: i + 1 }))
    : rows;

  return <div className="rk-shell">
    <header className="rk-head">
      <Link to="/dashboard" aria-label="Back to dashboard" className="rk-back"><ArrowLeft /></Link>
      <Crown className="rk-crown" />
      <div><h1>Rankers Streak</h1><p>Top members with the highest study streaks.</p></div>
    </header>
    <div className="rk-tabs" role="tablist">
      {(["all", "week"] as Period[]).map((p) => <button key={p} role="tab" aria-selected={period === p} className={period === p ? "is-active" : ""} onClick={() => setPeriod(p)}>{p === "all" ? "All" : "This Week"}</button>)}
    </div>
    {isPreview && <p className="rk-note">Sample ranking — <Link to="/account">login</Link> to see real student ranks.</p>}
    <ol className="rk-list">
      {shown.map((r, i) => <li key={r.user_id} className={`rk-row ${i === 0 ? "is-first" : ""} ${r.user_id === userId ? "is-me" : ""}`}>
        <span className={`rk-rank rank-${i + 1}`}>{i < 3 && <Crown />}<b>{i + 1}</b></span>
        <span className={`rk-avatar ${r.sampleIdx ? `dash-portrait portrait-${r.sampleIdx}` : ""}`}>
          {r.sampleIdx ? <img src={dashboardStudentsWebp} alt="" /> : r.photo ? <img src={r.photo} alt={r.full_name} /> : r.full_name.charAt(0).toUpperCase()}
        </span>
        <span className="rk-name">{r.full_name}{r.user_id === userId && <small> (You)</small>}</span>
        <span className="rk-days">{r.days} {r.days === 1 ? "day" : "days"}</span>
      </li>)}
    </ol>
    {!isPreview && !loading && !rows.length && <p className="rk-note">No attendance yet {period === "week" ? "this week" : ""}. Tick your attendance to enter the ranking!</p>}
    {loading && !isPreview && <p className="rk-note">Loading ranking…</p>}
  </div>;
}
