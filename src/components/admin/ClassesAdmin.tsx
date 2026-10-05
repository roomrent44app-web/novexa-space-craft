import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Link2, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSelect from "./AdminSelect";

type ClassForm = {
  temporary_meet_link: string;
  temporary_class_time: string;
  monthly_meet_link: string;
  monthly_class_time: string;
  active_link_mode: "temporary" | "monthly";
};

const empty: ClassForm = { temporary_meet_link: "", temporary_class_time: "", monthly_meet_link: "", monthly_class_time: "", active_link_mode: "monthly" };

export default function ClassesAdmin() {
  const [form, setForm] = useState<ClassForm>(empty);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.from("class_settings").select("temporary_meet_link,temporary_class_time,monthly_meet_link,monthly_class_time,active_link_mode").eq("id", 1).maybeSingle()
      .then(({ data }) => { if (data) setForm(data); });
  }, []);
  const valid = (link: string) => !link || /^https:\/\/meet\.google\.com\/[a-z-]+(?:\?.*)?$/.test(link.trim());
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid(form.temporary_meet_link) || !valid(form.monthly_meet_link)) return toast.error("Please enter valid Google Meet links.");
    setBusy(true);
    const activeLink = form.active_link_mode === "temporary" ? form.temporary_meet_link : form.monthly_meet_link;
    const activeTime = form.active_link_mode === "temporary" ? form.temporary_class_time : form.monthly_class_time;
    const { error } = await supabase.from("class_settings").upsert({ id: 1, ...form, meet_link: activeLink.trim(), class_time: activeTime.trim(), updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Class links updated for students");
  };
  return <form className="admin-stack" onSubmit={save}>
    <section className="admin-class-live"><div><span><CheckCircle2 /></span><div><small>Currently live for students</small><h2>{form.active_link_mode === "temporary" ? "Temporary class link" : "Full month class link"}</h2><p>{(form.active_link_mode === "temporary" ? form.temporary_class_time : form.monthly_class_time) || "Schedule not added"}</p></div></div><AdminSelect label="Active class link" value={form.active_link_mode} onChange={(value) => setForm({ ...form, active_link_mode: value as ClassForm["active_link_mode"] })} options={[{value:"temporary",label:"Temporary link"},{value:"monthly",label:"Full month link"}]} /></section>
    <div className="admin-class-grid"><section className={`admin-panel admin-class-card ${form.active_link_mode === "temporary" ? "is-live" : ""}`}><span className="admin-class-icon"><TimerReset /></span><div><small>One-off access</small><h2>Temporary Link</h2><p>Use this link for a special class or short replacement session.</p></div><label className="admin-field"><span><Link2 /> Google Meet link</span><Input value={form.temporary_meet_link} onChange={(event) => setForm({...form,temporary_meet_link:event.target.value})} placeholder="https://meet.google.com/abc-defg-hij" /></label><label className="admin-field"><span><Clock3 /> Schedule or label</span><Input value={form.temporary_class_time} onChange={(event) => setForm({...form,temporary_class_time:event.target.value})} placeholder="Special class · Today 5:00 AM" /></label></section>
      <section className={`admin-panel admin-class-card ${form.active_link_mode === "monthly" ? "is-live" : ""}`}><span className="admin-class-icon"><CalendarDays /></span><div><small>Regular access</small><h2>Full Month Link</h2><p>Keep one stable link active for the complete monthly schedule.</p></div><label className="admin-field"><span><Link2 /> Google Meet link</span><Input value={form.monthly_meet_link} onChange={(event) => setForm({...form,monthly_meet_link:event.target.value})} placeholder="https://meet.google.com/abc-defg-hij" /></label><label className="admin-field"><span><Clock3 /> Schedule or label</span><Input value={form.monthly_class_time} onChange={(event) => setForm({...form,monthly_class_time:event.target.value})} placeholder="Daily · 5:00 AM" /></label></section></div>
    <Button className="admin-save-class" disabled={busy} type="submit">{busy ? "Saving…" : "Save and publish class settings"}</Button>
  </form>;
}