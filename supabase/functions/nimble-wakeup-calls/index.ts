import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WINDOW_MIN = 30; // call if wake time passed within last 30 minutes

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const key = Deno.env.get("NIMBLE_API_KEY");
  if (!key) return json({ error: "NIMBLE_API_KEY missing" }, 500);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // India time
  const ist = new Date(Date.now() + 330 * 60_000);
  const today = ist.toISOString().slice(0, 10);
  const weekday = DAYS[ist.getUTCDay()];
  const nowMin = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  const nowIso = new Date().toISOString();

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
    db.from("nimble_call_log").select("user_id").eq("day", today).in("user_id", ids),
  ]);
  const done = new Set((logs ?? []).map((l) => l.user_id));
  const results: unknown[] = [];

  for (const p of profiles ?? []) {
    const sub = byUser.get(p.id)!;
    if (done.has(p.id)) continue;
    if (sub.class_days.length && !sub.class_days.includes(weekday)) continue;
    const reg = (p.registration ?? {}) as Record<string, string>;
    const m = /^(\d{1,2}):(\d{2})/.exec(reg.wake_time ?? "");
    if (!m) continue;
    const diff = nowMin - (Number(m[1]) * 60 + Number(m[2]));
    if (diff < 0 || diff > WINDOW_MIN) continue;
    const digits = String(p.phone || reg.phone || "").replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) continue;

    // Reserve today's slot first so a student is never called twice
    const { error: lockErr } = await db.from("nimble_call_log").insert({ user_id: p.id, day: today, status: "sending" });
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
          `wake_time: ${reg.wake_time}`,
          `call_language: ${reg.call_language ?? "Both"}`,
          `study_goal: ${reg.study_goal ?? ""}`,
        ],
      }),
    });
    const body = (await res.text()).slice(0, 1000);
    if (!res.ok) console.error(`Nimble failed [${res.status}]: ${body}`);
    await db.from("nimble_call_log").update({ status: res.ok ? "sent" : `failed_${res.status}`, response: body })
      .eq("user_id", p.id).eq("day", today);
    results.push({ user: p.id, status: res.status });
  }
  return json({ sent: results.length, results });
});
