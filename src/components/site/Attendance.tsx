import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const istToday = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
const pad = (n: number) => String(n).padStart(2, "0");

export default function Attendance({ userId }: { userId: string }) {
  const today = istToday();
  const [y0, m0] = today.split("-").map(Number);
  const [ym, setYm] = useState({ y: y0, m: m0 });
  const [days, setDays] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState("");

  const load = async () => {
    const start = `${ym.y}-${pad(ym.m)}-01`;
    const endD = new Date(Date.UTC(ym.y, ym.m, 0)).getUTCDate();
    const end = `${ym.y}-${pad(ym.m)}-${pad(endD)}`;
    const { data } = await supabase.from("attendance").select("day").eq("user_id", userId).gte("day", start).lte("day", end);
    setDays(new Set((data ?? []).map(r => r.day)));
  };
  useEffect(() => { load(); }, [ym, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const mark = async () => {
    // Let the server pick today's India date so a wrong phone clock can't block marking.
    const { error } = await supabase.from("attendance").insert({ user_id: userId });
    if (error && error.code !== "23505") { setMsg("Could not mark attendance. Please log in again and retry."); return; }
    setMsg("Attendance marked for today ✓");
    if (ym.y === y0 && ym.m === m0) load(); else setYm({ y: y0, m: m0 });
  };

  const total = new Date(Date.UTC(ym.y, ym.m, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(ym.y, ym.m - 1, 1)).getUTCDay();
  const isCurrent = ym.y === y0 && ym.m === m0;
  const elapsed = isCurrent ? Number(today.slice(8)) : total;
  const monthName = new Date(Date.UTC(ym.y, ym.m - 1, 1)).toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
  const shift = (d: number) => { const t = new Date(Date.UTC(ym.y, ym.m - 1 + d, 1)); setYm({ y: t.getUTCFullYear(), m: t.getUTCMonth() + 1 }); };
  const markedToday = days.has(today);

  return (
    <div className="att">
      <div className="att-head">
        <strong>My Attendance</strong>
        <button className="h-btn h-btn-orange" disabled={markedToday} onClick={mark}>{markedToday ? "Present Today ✓" : "Mark Today's Attendance"}</button>
      </div>
      {msg && <p className="adm-sub">{msg}</p>}
      <div className="att-nav">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <span>{monthName}</span>
        <button type="button" onClick={() => shift(1)} disabled={isCurrent} aria-label="Next month">›</button>
      </div>
      <div className="att-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="att-dow">{d}</span>)}
        {Array.from({ length: firstDow }).map((_, i) => <span key={"e" + i} />)}
        {Array.from({ length: total }).map((_, i) => {
          const key = `${ym.y}-${pad(ym.m)}-${pad(i + 1)}`;
          const on = days.has(key);
          const past = i + 1 <= elapsed;
          return <span key={key} className={`att-day ${on ? "on" : past ? "off" : ""}`}>{i + 1}</span>;
        })}
      </div>
      <p className="adm-sub"><b>{days.size}</b> present of {elapsed} days ({elapsed ? Math.round(days.size / elapsed * 100) : 0}%)</p>
    </div>
  );
}
