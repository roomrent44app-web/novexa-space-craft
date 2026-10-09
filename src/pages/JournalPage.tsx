import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookHeart, ChevronLeft, ChevronRight, Pencil, Share2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { addDays, istDateStr } from "@/lib/dashboard";

type Entry = { day: string; mood: string; body: string; updated_at: string };
const MOODS = [
  { key: "happy", emoji: "😀", label: "Happy" },
  { key: "calm", emoji: "😌", label: "Calm" },
  { key: "neutral", emoji: "😐", label: "Neutral" },
  { key: "tired", emoji: "😟", label: "Tired" },
  { key: "motivated", emoji: "🤩", label: "Motivated" },
];
const moodOf = (k: string) => MOODS.find((m) => m.key === k);
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const wd = (d: string) => new Date(d + "T00:00:00Z").getUTCDay();

export default function JournalPage() {
  useSeo({ title: "My Journal — 5AM", description: "Your daily study journal and mood record.", path: "/dashboard/journal" });
  const today = istDateStr();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selected, setSelected] = useState(today);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user ? { id: data.user.id } : null); setReady(true); });
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    const [y, m] = month.split("-").map(Number);
    const end = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
    const { data } = await supabase.from("student_journal").select("day,mood,body,updated_at")
      .eq("user_id", user.id).gte("day", `${month}-01`).lte("day", end);
    const map: Record<string, Entry> = {};
    (data ?? []).forEach((e) => { map[e.day] = e; });
    setEntries(map);
  }, [user, month]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const e = entries[selected];
    setBody(e?.body ?? ""); setMood(e?.mood ?? ""); setMsg("");
  }, [selected, entries]);

  // week strip around selected
  const weekStart = addDays(selected, -wd(selected));
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // month calendar
  const cal = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const first = wd(`${month}-01`);
    return [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)];
  }, [month]);

  const months = useMemo(() => {
    const out: string[] = [];
    const [y, m] = today.slice(0, 7).split("-").map(Number);
    for (let i = 0; i < 12; i++) { const d = new Date(Date.UTC(y, m - 1 - i, 1)); out.push(d.toISOString().slice(0, 7)); }
    return out;
  }, [today]);
  const monthLabel = (k: string) => { const [y, m] = k.split("-").map(Number); return `${MONTHS[m - 1]} ${y}`; };

  const changeMonth = (k: string) => {
    setMonth(k);
    setSelected(k === today.slice(0, 7) ? today : `${k}-01`);
  };
  const pick = (d: string) => { if (d > today) return; setSelected(d); if (d.slice(0, 7) !== month) setMonth(d.slice(0, 7)); };

  const save = async () => {
    if (!user) return;
    if (!body.trim() && !mood) { setMsg("Kuch likhiye ya mood chuniye."); return; }
    setBusy(true);
    const { error } = await supabase.from("student_journal").upsert(
      { user_id: user.id, day: selected, mood, body: body.trim().slice(0, 500), updated_at: new Date().toISOString() },
      { onConflict: "user_id,day" },
    );
    setBusy(false);
    if (error) { setMsg("Could not save. Please try again."); return; }
    setMsg("Journal entry saved ✓");
    load();
  };

  const remove = async (day: string) => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("student_journal").delete().eq("user_id", user.id).eq("day", day);
    setBusy(false);
    if (error) { setMsg("Could not delete. Please try again."); return; }
    setMsg("Journal entry deleted");
    load();
  };

  const share = async (e: Entry) => {
    const text = `${WD[wd(e.day)]}, ${Number(e.day.slice(8))} ${MONTHS[Number(e.day.slice(5, 7)) - 1]} ${e.day.slice(0, 4)} — ${moodOf(e.mood)?.label ?? "Journal"}\n\n${e.body || "Mood only."}\n\n— My 5AM Journal`;
    try {
      if (navigator.share) { await navigator.share({ title: "My 5AM Journal", text }); return; }
      await navigator.clipboard.writeText(text);
      setMsg("Journal entry copied — paste it anywhere to share.");
    } catch { /* user cancelled */ }
  };

  const list = Object.values(entries).sort((a, b) => b.day.localeCompare(a.day) || b.updated_at.localeCompare(a.updated_at));
  const timeOf = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
  const future = selected > today;

  return (
    <div className="dash-page">
      <div className="dash-shell jr-shell">
        <div className="prog-top">
          <Link className="prog-back" to="/dashboard" aria-label="Back to dashboard"><ChevronLeft /> <b>My Journal</b></Link>
          <select className="prog-select" value={month} onChange={(e) => changeMonth(e.target.value)} aria-label="Select month">
            {months.map((k) => <option key={k} value={k}>{monthLabel(k)}</option>)}
          </select>
        </div>

        <div className="jr-week dash-card">
          <button type="button" aria-label="Previous week" onClick={() => pick(addDays(selected, -7))}><ChevronLeft /></button>
          {week.map((d) => (
            <button type="button" key={d} disabled={d > today} onClick={() => pick(d)} className={`jr-day${d === selected ? " is-sel" : ""}`}>
              <small>{WD[wd(d)]}</small><b>{Number(d.slice(8))}</b>
              <i className={entries[d] ? "has" : ""} />
            </button>
          ))}
          <button type="button" aria-label="Next week" disabled={addDays(weekStart, 7) > today} onClick={() => pick(addDays(selected, 7) > today ? today : addDays(selected, 7))}><ChevronRight /></button>
        </div>

        <section className="jr-card">
          <div className="jr-head">
            <span className="jr-icon"><BookHeart /></span>
            <div><h1>My Journal</h1><p>Write your thoughts, track your progress and stay motivated.</p></div>
          </div>
          {!ready ? null : !user ? (
            <div className="jr-guest">
              <p>Please log in to write your journal and save your daily mood.</p>
              <Button asChild><Link to="/account">Login / Sign Up</Link></Button>
            </div>
          ) : (
            <>
              <p className="jr-date">{Number(selected.slice(8))} {MONTHS[Number(selected.slice(5, 7)) - 1]} {selected.slice(0, 4)}{selected === today ? " · Today" : ""}</p>
              <div className="jr-text">
                <textarea maxLength={500} value={body} disabled={future} onChange={(e) => setBody(e.target.value)}
                  placeholder={"How was your day today?\nWrite about your study, mood, what you learned, challenges or anything..."} />
                <small>{body.length}/500</small>
              </div>
              <h2>How are you feeling today?</h2>
              <div className="jr-moods">
                {MOODS.map((m) => (
                  <button type="button" key={m.key} className={`jr-mood jr-${m.key}${mood === m.key ? " is-sel" : ""}`} onClick={() => setMood(m.key)} aria-pressed={mood === m.key}>
                    <span>{m.emoji}</span>{m.label}
                  </button>
                ))}
              </div>
              <div className="jr-actions">
                {msg && <span className="jr-msg">{msg}</span>}
                {entries[selected] && (
                  <Button type="button" variant="outline" className="jr-delete" onClick={() => remove(selected)} disabled={busy}>
                    <Trash2 /> Delete Entry
                  </Button>
                )}
                <Button className="jr-save" onClick={save} disabled={busy || future}>{busy ? "Saving..." : "Save Journal Entry"} <ArrowRight /></Button>
              </div>
            </>
          )}
        </section>

        {user && (
          <section className="dash-card jr-cal">
            <h2>{monthLabel(month)} — Monthly Record</h2>
            <div className="jr-cal-grid">
              {WD.map((w) => <small key={w}>{w}</small>)}
              {cal.map((d, i) => d ? (
                <button type="button" key={d} disabled={d > today} onClick={() => pick(d)}
                  className={`jr-cal-cell${d === selected ? " is-sel" : ""}${entries[d] ? " has" : ""}`}>
                  <b>{Number(d.slice(8))}</b><span>{entries[d] ? moodOf(entries[d].mood)?.emoji ?? "📝" : ""}</span>
                </button>
              ) : <span key={`e${i}`} />)}
            </div>
          </section>
        )}

        {user && (
          <section className="jr-entries">
            <h2>My Entries</h2>
            {list.length === 0 && <p className="jr-empty">Is mahine abhi koi entry nahi hai.</p>}
            {list.map((e) => (
              <div key={e.day} className="dash-card jr-entry" role="button" tabIndex={0} onClick={() => pick(e.day)} onKeyDown={(ev) => { if (ev.key === "Enter") pick(e.day); }}>
                <span className={`jr-entry-date${e.day === today ? " is-today" : ""}`}><b>{Number(e.day.slice(8))}</b>{MONTHS[Number(e.day.slice(5, 7)) - 1]}</span>
                <span className="jr-entry-body">
<b>{e.day === today ? "Today's Journal" : `${WD[wd(e.day)]}'s Journal`} {moodOf(e.mood) && <em>{moodOf(e.mood)!.emoji} {moodOf(e.mood)!.label}</em>}</b>
                  <small className="jr-entry-time">{WD[wd(e.day)]}, {Number(e.day.slice(8))} {MONTHS[Number(e.day.slice(5, 7)) - 1]} {e.day.slice(0, 4)} · {timeOf(e.updated_at)}</small>
                  <small>{e.body || "No text — mood only."}</small>
                </span>
                <button type="button" className="jr-entry-del" aria-label={`Delete journal entry of ${e.day}`} disabled={busy}
                  onClick={(ev) => { ev.stopPropagation(); remove(e.day); }}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
