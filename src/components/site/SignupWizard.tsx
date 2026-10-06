import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type Field = { key: string; label: string; type?: "text" | "tel" | "email" | "number" | "time" | "password" | "textarea" | "select"; options?: string[]; optional?: boolean };

const STEPS: { title: string; fields: Field[] }[] = [
  { title: "Basic Details", fields: [
    { key: "full_name", label: "Full Name" },
    { key: "phone", label: "WhatsApp Number", type: "tel" },
    { key: "email", label: "Email ID", type: "email" },
    { key: "password", label: "Create Password (min 6)", type: "password" },
    { key: "age", label: "Age", type: "number" },
    { key: "city_state", label: "City / State" },
  ]},
  { title: "Study Details", fields: [
    { key: "student_type", label: "Are you a student of", type: "select", options: ["School", "College", "NEET", "UPSC", "Other"] },
    { key: "preparing_for", label: "What are you preparing/studying for?" },
    { key: "class_year", label: "Current Class / Year" },
    { key: "study_goal", label: "Main Study Goal" },
  ]},
  { title: "Wake-Up Call", fields: [
    { key: "wake_time", label: "Preferred wake-up time", type: "time" },
    { key: "call_days", label: "How many days do you want wake-up calls?", type: "number" },
    { key: "call_language", label: "Preferred call language", type: "select", options: ["Hindi", "English", "Both"] },
    { key: "backup_whatsapp", label: "Backup WhatsApp number (optional)", type: "tel", optional: true },
  ]},
  { title: "Community Details", fields: [
    { key: "heard_from", label: "How did you hear about 5AM.CO.IN?" },
    { key: "why_join", label: "Why do you want to join the 5 AM Study Community?", type: "textarea" },
    { key: "goal_30_days", label: "Your biggest study goal for the next 30 days?", type: "textarea" },
  ]},
];

const phone = z.string().trim().regex(/^[+]?\d{10,13}$/, "Enter a valid number");
const stepSchemas = [
  z.object({ full_name: z.string().trim().min(2, "Enter your name").max(100), phone, email: z.string().trim().email("Enter a valid email").max(255), password: z.string().min(6, "Password must be at least 6 characters").max(72), age: z.coerce.number().int().min(5, "Enter a valid age").max(100, "Enter a valid age"), city_state: z.string().trim().min(2, "Required").max(100) }),
  z.object({ student_type: z.string().min(1, "Choose one"), preparing_for: z.string().trim().min(2, "Required").max(150), class_year: z.string().trim().min(1, "Required").max(50), study_goal: z.string().trim().min(2, "Required").max(300) }),
  z.object({ wake_time: z.string().min(1, "Choose a time"), call_days: z.coerce.number().int().min(1, "Enter days").max(365), call_language: z.string().min(1, "Choose one"), backup_whatsapp: z.union([z.literal(""), phone]) }),
  z.object({ heard_from: z.string().trim().min(2, "Required").max(150), why_join: z.string().trim().min(2, "Required").max(500), goal_30_days: z.string().trim().min(2, "Required").max(500) }),
];

export default function SignupWizard({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({ call_language: "Both" });
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const last = STEPS.length; // agreement step index

  const validate = () => {
    if (step === last) {
      if (!agree1 || !agree2) { setMsg("Please accept both agreements to continue."); return false; }
      return true;
    }
    const r = stepSchemas[step].safeParse(data);
    if (r.success) { setErrors({}); return true; }
    const e: Record<string, string> = {};
    r.error.issues.forEach((i) => { e[String(i.path[0])] = i.message; });
    setErrors(e); return false;
  };

  const next = async (ev: React.FormEvent) => {
    ev.preventDefault(); setMsg("");
    if (!validate()) return;
    if (step < last) { setStep(step + 1); return; }
    setBusy(true);
    const { password, email, full_name, phone: ph, ...rest } = data;
    const registration = { ...rest, agreed_whatsapp: true, agreed_responsibility: true, submitted_at: new Date().toISOString() };
    const { data: res, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: window.location.origin + "/account", data: { full_name: full_name.trim(), phone: ph.trim(), registration } },
    });
    setBusy(false);
    if (error) {
      const m = error.message || "";
      let friendly = m;
      if (/already registered|already exists/i.test(m)) friendly = "This email already has an account. Please log in instead, or go Back to step 1 and use another email.";
      else if (/weak|pwned|leaked|known/i.test(m)) friendly = "This password is too common or has appeared in a data leak. Please go Back to step 1 and choose a stronger password (mix letters, numbers and symbols).";
      else if (/password/i.test(m)) friendly = `Password problem: ${m} Please go Back to step 1 and change it.`;
      else if (/email/i.test(m)) friendly = `Email problem: ${m} Please go Back to step 1 and fix it.`;
      setMsg(friendly);
      return;
    }
    setMsg(res.session ? "Account created. Welcome to 5AM!" : "Account created! You can log in now.");
  };

  const input = (f: Field) => {
    const common = { className: "adm-input", value: data[f.key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setData({ ...data, [f.key]: e.target.value }) };
    if (f.type === "textarea") return <textarea rows={3} {...common} />;
    if (f.type === "select") return <select {...common}><option value="">Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>;
    return <input type={f.type ?? "text"} {...common} />;
  };

  return <form onSubmit={next} noValidate>
    <h1 className="adm-title">Create Account</h1>
    <p className="adm-sub">Step {step + 1} of {last + 1} — {step < last ? STEPS[step].title : "Agreement"}</p>
    <div className="signup-progress" aria-hidden><span style={{ width: `${((step + 1) / (last + 1)) * 100}%` }} /></div>
    {step < last ? STEPS[step].fields.map((f) => <label key={f.key} className="adm-label">{f.label}{input(f)}{errors[f.key] && <small className="signup-error">{errors[f.key]}</small>}</label>) : <>
      <label className="signup-check"><input type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)} /> I agree to receive wake-up calls and community updates on WhatsApp.</label>
      <label className="signup-check"><input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} /> I understand that the wake-up call is a support feature and I am responsible for attending my study session.</label>
    </>}
    {msg && <p className="adm-sub">{msg}</p>}
    <div className="signup-actions">
      {step > 0 && <button type="button" className="h-btn" onClick={() => { setStep(step - 1); setMsg(""); }}>Back</button>}
      <button className="h-btn h-btn-orange" disabled={busy} type="submit">{busy ? "Please wait…" : step < last ? "Next" : "Create Account"}</button>
    </div>
    <p className="adm-sub">Already have an account? <button className="acc-text-btn" type="button" onClick={onLogin}>Login</button></p>
  </form>;
}
