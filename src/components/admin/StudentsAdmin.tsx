import { useMemo, useState } from "react";
import { Download, Search, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PURCHASE_PLANS } from "@/data/fiveam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSelect from "./AdminSelect";
import type { AdminData, Profile, SubscriptionStatus } from "./types";
import { downloadCsv, formatDate, formatMoney, indiaDay, monthKey } from "./utils";

export default function StudentsAdmin({ data, reload }: { data: AdminData; reload: () => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [student, setStudent] = useState<Profile | null>(null);
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [planCode, setPlanCode] = useState("21d-1099");
  const [notes, setNotes] = useState("");
  const month = indiaDay().slice(0, 7);
  const current = (userId: string) => data.subscriptions.find((item) => item.user_id === userId && item.status === "active" && item.expires_at && new Date(item.expires_at) > new Date());
  const filtered = useMemo(() => data.profiles.filter((item) => {
    const plan = current(item.id);
    return `${item.full_name} ${item.email} ${item.phone}`.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || (filter === "active" ? Boolean(plan) : !plan));
  }), [data.profiles, data.subscriptions, search, filter]);
  const open = (item: Profile) => { setStudent(item); setProfile({ full_name: item.full_name, phone: item.phone }); setNotes(""); };
  const saveProfile = async () => {
    if (!student) return;
    const { error } = await supabase.from("profiles").update({ ...profile, updated_at: new Date().toISOString() }).eq("id", student.id);
    if (error) toast.error(error.message); else { toast.success("Student details updated"); await reload(); }
  };
  const addPlan = async () => {
    if (!student) return;
    const plan = PURCHASE_PLANS.find((item) => item.code === planCode);
    if (!plan) return;
    const starts = new Date();
    const expires = new Date(starts.getTime() + plan.days * 86400000);
    const { error } = await supabase.from("subscriptions").insert({ user_id: student.id, plan_code: plan.code, plan_name: plan.name, duration_days: plan.days, amount_paise: plan.price * 100, status: "active", starts_at: starts.toISOString(), expires_at: expires.toISOString(), razorpay_order_id: `manual_${crypto.randomUUID()}`, source: "manual", fulfillment_status: "delivered", fulfilled_at: starts.toISOString(), admin_notes: notes.trim() });
    if (error) toast.error(error.message); else { toast.success("Student plan activated"); await reload(); }
  };
  const updatePlan = async (id: string, status: SubscriptionStatus, days = 0) => {
    const source = data.subscriptions.find((item) => item.id === id);
    const expiry = source?.expires_at ? new Date(source.expires_at) : new Date();
    if (days) expiry.setDate(expiry.getDate() + days);
    const { error } = await supabase.from("subscriptions").update({ status, expires_at: days ? expiry.toISOString() : source?.expires_at, cancelled_at: status === "cancelled" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(days ? "Plan extended" : "Plan status updated"); await reload(); }
  };
  const exportRows = () => downloadCsv("5am-students.csv", [["Name","Email","Phone","Joined","Plan","Expiry","Attendance this month"], ...filtered.map((item) => { const plan = current(item.id); return [item.full_name,item.email,item.phone,item.created_at,plan?.plan_name ?? "No active plan",plan?.expires_at ?? "",data.attendance.filter((row)=>row.user_id===item.id && monthKey(row.day)===month).length]; })]);
  return <div className="admin-stack"><div className="admin-toolbar"><label className="admin-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search name, email, or mobile" /></label><AdminSelect label="Student status" value={filter} onChange={setFilter} options={[{value:"all",label:"All students"},{value:"active",label:"Active plans"},{value:"inactive",label:"No active plan"}]}/><Button variant="outline" onClick={exportRows}><Download/> Export</Button></div>
    <section className="admin-panel admin-table-panel"><div className="admin-panel-head"><div><small>Student directory</small><h2>{filtered.length} registered students</h2></div></div><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Mobile</TableHead><TableHead>Joined</TableHead><TableHead>Current plan</TableHead><TableHead>Expiry</TableHead><TableHead>Attendance</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filtered.map((item)=>{const plan=current(item.id); const count=data.attendance.filter((row)=>row.user_id===item.id&&monthKey(row.day)===month).length; return <TableRow key={item.id}><TableCell><div className="admin-person"><span className="admin-avatar"><UserRound/></span><div><b>{item.full_name||"Student"}</b><small>{item.email}</small></div></div></TableCell><TableCell>{item.phone||"—"}</TableCell><TableCell>{formatDate(item.created_at)}</TableCell><TableCell><span className={`admin-status ${plan?"is-active":"is-inactive"}`}>{plan?.plan_name??"Inactive"}</span></TableCell><TableCell>{formatDate(plan?.expires_at??null)}</TableCell><TableCell>{count} days</TableCell><TableCell><Button variant="ghost" size="sm" onClick={()=>open(item)}>Manage</Button></TableCell></TableRow>})}</TableBody></Table></section>
    <Dialog open={Boolean(student)} onOpenChange={(value)=>!value&&setStudent(null)}><DialogContent className="admin-student-dialog"><DialogHeader><DialogTitle>{student?.full_name||"Student details"}</DialogTitle><DialogDescription>{student?.email} · Joined {formatDate(student?.created_at??null)}</DialogDescription></DialogHeader><div className="admin-student-grid"><section><h3>Profile</h3><label className="admin-field">Full name<Input value={profile.full_name} onChange={(event)=>setProfile({...profile,full_name:event.target.value})}/></label><label className="admin-field">Mobile<Input value={profile.phone} onChange={(event)=>setProfile({...profile,phone:event.target.value})}/></label><Button onClick={saveProfile}>Save profile</Button></section><section><h3>Activate plan</h3><label className="admin-field">Plan<AdminSelect label="Plan" value={planCode} onChange={setPlanCode} options={PURCHASE_PLANS.map((plan)=>({value:plan.code,label:`${plan.name} — ₹${plan.price}`}))}/></label><label className="admin-field">Reason or note<Textarea value={notes} onChange={(event)=>setNotes(event.target.value)} placeholder="Manual payment, goodwill extension, or other reason"/></label><Button onClick={addPlan}>Activate selected plan</Button></section></div><section className="admin-history"><h3>Plan history</h3>{data.subscriptions.filter((item)=>item.user_id===student?.id).map((plan)=><div key={plan.id}><div><b>{plan.plan_name}</b><small>{formatMoney(plan.amount_paise)} · {formatDate(plan.starts_at)} to {formatDate(plan.expires_at)}</small></div><span className={`admin-status payment-${plan.status}`}>{plan.status}</span><Button variant="outline" size="sm" onClick={()=>updatePlan(plan.id,plan.status,7)}>+7 days</Button>{plan.status==="active"&&<Button variant="destructive" size="sm" onClick={()=>updatePlan(plan.id,"cancelled")}>Cancel</Button>}</div>)}{data.subscriptions.every((item)=>item.user_id!==student?.id)&&<p className="admin-empty">No plan history.</p>}</section><DialogFooter><Button variant="outline" onClick={()=>setStudent(null)}>Close</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}