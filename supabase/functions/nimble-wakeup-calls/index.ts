import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Fixed call times for every package (India time)
const SLOTS = [
  { slot: "call_1", label: "1st call - 4:55 am", min: 4 * 60 + 55 },
  { slot: "call_2", label: "2nd call - 5:10 am", min: 5 * 60 + 10 },
];
const WINDOW_MIN = 10;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const key = Deno.env.get("NIMBLE_API_KEY");
  if (!key) return json({ error: "NIMBLE_API_KEY missing" }, 500);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const ist = new Date(Date.now() + 330 * 60_000);
  const today = ist.toISOString().slice(0, 10);
  const weekday = DAYS[ist.getUTCDay()];
  const nowMin = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  const nowIso = new Date().toISOString();

  const current = SLOTS.find((s) => nowMin - s.min >= 0 && nowMin - s.min <= WINDOW_MIN);
  if (!current) return json({ sent: 0, note: "Not a call time" });

  const { data: subs, error } = await db
    .from("subscriptions")
    .select("user_id, plan_name, class_days, created_at")
    .eq("status", "active")
    .lte("starts_at", nowIso)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);

  const byUser = new Map<string, { plan_name: string; class_days: string[] }>();
  for (const s of subs ?? []) if (!byUser.has(s.user_id)) byUser.set(s.user_id, s);
  const ids = [...byUser.keys()];
  if (!ids.length) return json({ sent: 0 });

  const [{ data: profiles }, { data: logs }] = await Promise.all([
    db.from("profiles").select("id, full_name, phone, registration").in("id", ids),
    db.from("nimble_call_log").select("user_id").eq("day", today).eq("slot", current.slot).in("user_id", ids),
  ]);
  const done = new Set((logs ?? []).map((l) => l.user_id));
  const results: unknown[] = [];

  for (const p of profiles ?? []) {
    const sub = byUser.get(p.id)!;
    if (done.has(p.id)) continue;
    if (sub.class_days.length && !sub.class_days.includes(weekday)) continue;
    const reg = (p.registration ?? {}) as Record<string, string>;
    const digits = String(p.phone || reg.phone || "").replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) continue;

    const { error: lockErr } = await db.from("nimble_call_log").insert({ user_id: p.id, day: today, slot: current.slot, status: "sending" });
    if (lockErr) continue;

    const res = await fetch("https://nimblebiz.ai/api/v1/apps/leads", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: `+91${digits}`,
        name: p.full_name || "Student",
        details: [
          `current_city: ${reg.city_state ?? ""}`,
          `package_plan: ${sub.plan_name}`,
          `call_schedule: 1st call - 4:55 am, 2nd call - 5:10 am`,
          `this_call: ${current.label}`,
          `call_language: ${reg.call_language ?? "Both"}`,
          `study_goal: ${reg.study_goal ?? ""}`,
        ],
      }),
    });
    const body = (await res.text()).slice(0, 1000);
    if (!res.ok) console.error(`Nimble failed [${res.status}]: ${body}`);
    await db.from("nimble_call_log").update({ status: res.ok ? "sent" : `failed_${res.status}`, response: body })
      .eq("user_id", p.id).eq("day", today).eq("slot", current.slot);
    results.push({ user: p.id, slot: current.slot, status: res.status });
  }
  return json({ sent: results.length, slot: current.slot, results });
});
