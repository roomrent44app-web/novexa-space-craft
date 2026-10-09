import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarCheck, ChartNoAxesColumn, Check, ChevronRight, Pencil, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import { istDateStr, istMonday } from "@/lib/dashboard";

const DAILY_DEFAULTS = ["Complete study session", "Revise one chapter", "Solve 50 questions", "Read notes for 1 hour"];
const WEEKLY_DEFAULTS = ["Complete planned chapters", "Give 1 mock test", "Revise weak topics", "Maintain 80% attendance", "Stay consistent for 7 days"];

type Goal = { id: string; title: string; done: boolean };
type Kind = "daily" | "weekly";

// Guests see frontend-only sample goals so the planner looks alive (never saved to student records).
const SAMPLE: Record<Kind, Goal[]> = {
  daily: DAILY_DEFAULTS.map((title, i) => ({ id: `s-d-${i}`, title, done: false })),
  weekly: WEEKLY_DEFAULTS.map((title, i) => ({ id: `s-w-${i}`, title, done: i < 3 })),
};

const periodKeyOf = (kind: Kind) => (kind === "daily" ? istDateStr() : istMonday());

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function GoalsPlanner() {
  useSeo({ title: "Goals Planner — 5AM", description: "Plan your daily and weekly study goals and track how much you completed.", path: "/dashboard/goals" });
  const [params, setParams] = useSearchParams();
  const tab: Kind = params.get("tab") === "weekly" ? "weekly" : "daily";
  const setTab = (k: Kind) => setParams(k === "weekly" ? { tab: "weekly" } : {}, { replace: true });

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [goals, setGoals] = useState<Record<Kind, Goal[]>>({ daily: [], weekly: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => { setUser(u); setReady(true); });
  }, []);

  const load = useCallback(async (u: User | null) => {
    if (!u) { setGoals(SAMPLE); return; }
    const kinds: Kind[] = ["daily", "weekly"];
    const next: Record<Kind, Goal[]> = { daily: [], weekly: [] };
    for (const kind of kinds) {
      const periodKey = periodKeyOf(kind);
      const { data } = await supabase.from("student_goals").select("id,title,done")
        .eq("user_id", u.id).eq("kind", kind).eq("period_key", periodKey).order("created_at");
      let rows = (data ?? []) as Goal[];
      if (!rows.length) {
        const defaults = kind === "daily" ? DAILY_DEFAULTS : WEEKLY_DEFAULTS;
        const { data: seeded } = await supabase.from("student_goals")
          .insert(defaults.map((t) => ({ user_id: u.id, kind, title: t, period_key: periodKey })))
          .select("id,title,done");
        rows = (seeded ?? []) as Goal[];
      }
      next[kind] = rows;
    }
    setGoals(next);
  }, []);

  useEffect(() => { if (ready) load(user); }, [ready, user, load]);

  const toggle = async (goal: Goal) => {
    setGoals((cur) => ({ ...cur, [tab]: cur[tab].map((g) => (g.id === goal.id ? { ...g, done: !g.done } : g)) }));
    if (user) await supabase.from("student_goals").update({ done: !goal.done }).eq("id", goal.id);
  };

  const commitEdit = async () => {
    if (!editingId) return;
    const title = editText.trim();
    const goal = goals[tab].find((g) => g.id === editingId);
    setEditingId(null);
    if (!goal || !title || title === goal.title) return;
    setGoals((cur) => ({ ...cur, [tab]: cur[tab].map((g) => (g.id === goal.id ? { ...g, title } : g)) }));
    if (user) await supabase.from("student_goals").update({ title }).eq("id", goal.id);
  };

  const addGoal = async () => {
    const title = newText.trim();
    if (!title) return;
    setNewText("");
    if (user) {
      setBusy(true);
      const { data } = await supabase.from("student_goals")
        .insert({ user_id: user.id, kind: tab, title, period_key: periodKeyOf(tab) })
        .select("id,title,done");
      setBusy(false);
      if (data?.[0]) { setGoals((cur) => ({ ...cur, [tab]: [...cur[tab], data[0] as Goal] })); return; }
    }
    setGoals((cur) => ({ ...cur, [tab]: [...cur[tab], { id: `local-${Date.now()}`, title, done: false }] }));
  };

  const removeGoal = async (goal: Goal) => {
    setGoals((cur) => ({ ...cur, [tab]: cur[tab].filter((g) => g.id !== goal.id) }));
    if (user && !goal.id.startsWith("local-") && !goal.id.startsWith("s-")) {
      await supabase.from("student_goals").delete().eq("id", goal.id);
    }
  };

  const saveAll = async () => {
    await commitEdit();
    await addGoal();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const list = goals[tab];
  const other: Kind = tab === "daily" ? "weekly" : "daily";
  const olist = goals[other];
  const odone = olist.filter((g) => g.done).length;
  const ototal = olist.length;
  const pct = ototal ? Math.round((odone / ototal) * 100) : 0;
  const periodKey = periodKeyOf(tab);

  return <main className="dash-page">
    <div className="dash-shell gp-shell">
      <header className="gp-head">
        <span className="gp-chip"><Target /></span>
        <div><h1>Goals Planner</h1><p>Write your goals and stay accountable.</p></div>
      </header>

      {ready && !user && <p className="dash-sample-label gp-sample">Sample goals — <Link to="/account">login</Link> to save yours</p>}

      <div className="gp-tabs" role="tablist" aria-label="Goal period">
        <button type="button" role="tab" aria-selected={tab === "daily"} className={tab === "daily" ? "active is-daily" : ""} onClick={() => setTab("daily")}>Daily Goals</button>
        <button type="button" role="tab" aria-selected={tab === "weekly"} className={tab === "weekly" ? "active is-weekly" : ""} onClick={() => setTab("weekly")}>Weekly Goals</button>
      </div>

      <section className="dash-card gp-card">
        <header className="gp-card-head">
          <span className={`gp-icon ${tab === "daily" ? "gp-icon-daily" : "gp-icon-weekly"}`}><CalendarCheck /></span>
          <div className="gp-card-title">
            <h2>{tab === "daily" ? "Daily Goals" : "Weekly Goals"}</h2>
            <small>{tab === "daily" ? "Set your goals for today" : "Set your goals for this week"}</small>
          </div>
          <div className="gp-badge"><b>{tab === "daily" ? "Today" : "This Week"}</b><small>{fmtDate(periodKey)}</small></div>
        </header>

        <ul className="gp-list">
          {list.map((goal) => (
            <li key={goal.id} className={editingId === goal.id ? "is-editing" : ""}>
              {editingId === goal.id ? (
                <>
                  <span className="gp-circle" aria-hidden="true" />
                  <input
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    aria-label="Edit goal"
                  />
                  <Pencil className="gp-pen" aria-hidden="true" />
                </>
              ) : (
                <>
                  <button type="button" className="gp-circle-btn" aria-pressed={goal.done} aria-label={`Mark "${goal.title}" ${goal.done ? "not done" : "done"}`} onClick={() => toggle(goal)}>
                    <Check />
                  </button>
                  <span className="gp-title">{goal.title}</span>
                  <button type="button" className="gp-pen-btn" aria-label={`Edit "${goal.title}"`} onClick={() => { setEditingId(goal.id); setEditText(goal.title); }}>
                    <Pencil />
                  </button>
                  <button type="button" className="gp-del-btn" aria-label={`Delete "${goal.title}"`} onClick={() => removeGoal(goal)}>
                    <Trash2 />
                  </button>
                </>
              )}
            </li>
          ))}
          {!list.length && ready && <li className="gp-loading">Loading your goals…</li>}
        </ul>

        <div className="gp-add">
          <span className="gp-circle" aria-hidden="true" />
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGoal(); } }}
            placeholder="Add your own goal…"
            aria-label="Add your own goal"
          />
          <Pencil className="gp-pen" aria-hidden="true" />
        </div>

        <Button type="button" className="gp-save" onClick={saveAll} disabled={busy}>
          {saved ? "Saved ✓" : <>Save {tab === "daily" ? "Daily" : "Weekly"} Goals <ArrowRight /></>}
        </Button>
      </section>

      <section className="dash-card gp-progress">
        <div className="gp-progress-head">
          <span className="gp-icon gp-icon-weekly"><ChartNoAxesColumn /></span>
          <div className="gp-card-title">
            <h2>{other === "weekly" ? "This Week" : "Today"}</h2>
            <small>{ready ? `${odone} / ${ototal} goals completed` : "Loading…"}</small>
          </div>
          <button type="button" className="gp-progress-arrow" onClick={() => setTab(other)} aria-label={`Open ${other} goals`}>
            <ChevronRight />
          </button>
        </div>
        <div className="gp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${other} goals completion`}>
          <span className="gp-bar-track"><i style={{ width: `${pct}%` }} /></span>
          <b>{pct}%</b>
        </div>
        <button type="button" className="gp-switch" onClick={() => setTab(other)}>
          Switch to {other === "weekly" ? "Weekly" : "Daily"} Goals <ArrowRight />
        </button>
      </section>
    </div>
  </main>;
}
