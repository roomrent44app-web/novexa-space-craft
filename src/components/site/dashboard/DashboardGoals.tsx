import { useCallback, useEffect, useState } from "react";
import { Check, ChartNoAxesColumn, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { istDateStr, istMonday } from "@/lib/dashboard";

const DAILY_DEFAULTS = ["Complete 3 study sessions", "Revise 1 chapter", "Solve 50 questions", "Read notes (1 hour)"];
const WEEKLY_DEFAULTS = ["Complete planned chapters", "Give 1 mock test", "Revise weak topics", "Maintain 80% attendance", "Stay consistent for 7 days"];

type Goal = { id: string; title: string; done: boolean };

function GoalsCard({ kind, title, badge, defaults, periodKey, userId }: {
  kind: "daily" | "weekly";
  title: string;
  badge: string;
  defaults: string[];
  periodKey: string;
  userId: string;
}) {
  const [goals, setGoals] = useState<Goal[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase.from("student_goals").select("id,title,done")
      .eq("user_id", userId).eq("kind", kind).eq("period_key", periodKey).order("created_at");
    let rows = (data ?? []) as Goal[];
    if (!rows.length) {
      const { data: seeded } = await supabase.from("student_goals")
        .insert(defaults.map((t) => ({ user_id: userId, kind, title: t, period_key: periodKey })))
        .select("id,title,done");
      rows = (seeded ?? []) as Goal[];
    }
    setGoals(rows);
  }, [userId, kind, periodKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const toggle = async (goal: Goal) => {
    setGoals((cur) => cur.map((g) => (g.id === goal.id ? { ...g, done: !g.done } : g)));
    await supabase.from("student_goals").update({ done: !goal.done }).eq("id", goal.id);
  };

  const done = goals.filter((g) => g.done).length;

  return (
    <section className={`dash-card dash-goals-${kind}`}>
      <header className="dash-card-head">
        <span className={`dash-chip chip-${kind === "daily" ? "pink" : "blue"}`}>
          {kind === "daily" ? <Target /> : <ChartNoAxesColumn />}
        </span>
        <div className="dash-card-name"><h3>{title}</h3></div>
        <span className="dash-badge">{badge}</span>
      </header>
      <p className="dash-goal-count"><b>{done}</b>/{goals.length} done</p>
      <ul className="dash-goal-list">
        {goals.map((goal) => (
          <li key={goal.id}>
            <button type="button" aria-pressed={goal.done} onClick={() => toggle(goal)}>
              <span className="dash-tick">{goal.done && <Check />}</span>
              <span>{goal.title}</span>
            </button>
          </li>
        ))}
        {!goals.length && <li className="dash-empty">Loading your goals…</li>}
      </ul>
    </section>
  );
}

export default function DashboardGoals({ userId }: { userId: string }) {
  return (
    <>
      <GoalsCard kind="daily" title="Daily Goals" badge="Today" defaults={DAILY_DEFAULTS} periodKey={istDateStr()} userId={userId} />
      <GoalsCard kind="weekly" title="Weekly Goals" badge="This Week" defaults={WEEKLY_DEFAULTS} periodKey={istMonday()} userId={userId} />
    </>
  );
}
