import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BarChart3, BookOpen, CalendarCheck, GraduationCap, Images, LogOut, Menu, Package, PanelLeftClose, Settings2, UsersRound, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";
import Logo from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersAdmin from "@/components/admin/OrdersAdmin";
import StudentsAdmin from "@/components/admin/StudentsAdmin";
import AttendanceAdmin from "@/components/admin/AttendanceAdmin";
import ClassesAdmin from "@/components/admin/ClassesAdmin";
import { BlogAdmin, GalleryAdmin } from "@/components/admin/ContentAdmin";
import type { AdminData, AdminSection } from "@/components/admin/types";

const sections = [
  { id: "dashboard", label: "Dashboard", Icon: BarChart3 },
  { id: "orders", label: "Orders", Icon: Package },
  { id: "students", label: "Students", Icon: UsersRound },
  { id: "attendance", label: "Attendance", Icon: CalendarCheck },
  { id: "classes", label: "Classes", Icon: GraduationCap },
  { id: "blog", label: "Blog", Icon: BookOpen },
  { id: "gallery", label: "Gallery", Icon: Images },
] as const;

const emptyData: AdminData = { profiles: [], subscriptions: [], physicalOrders: [], attendance: [] };

export default function Admin() {
  useSeo({ title: "5AM Admin Operations", description: "Secure 5AM administration panel.", path: "/admin" });
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    supabase.auth.getUser().then(({ data }) => { setSession(data.user ? ({ user: data.user } as Session) : null); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session?.user) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);
  if (!ready) return <AdminState text="Preparing your workspace…" />;
  if (!session) return <Login />;
  if (isAdmin === null) return <AdminState text="Checking secure access…" />;
  if (!isAdmin) return <AdminState text="This account does not have administrator access." action={<Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>} />;
  return <AdminWorkspace session={session} />;
}

function AdminState({ text, action }: { text: string; action?: React.ReactNode }) {
  return <main className="admin-auth"><Logo/><div className="admin-auth-card"><Settings2/><h1>5AM Admin</h1><p>{text}</p>{action}</div></main>;
}

function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); setBusy(false); if (error) toast.error("Wrong email or password"); };
  return <main className="admin-auth"><Logo/><form className="admin-auth-card" onSubmit={submit}><span className="admin-auth-icon"><Settings2/></span><div><small>Secure operations</small><h1>Welcome back</h1><p>Sign in to manage 5AM students, classes, orders, and content.</p></div><label className="admin-field">Email<input required type="email" value={email} onChange={(event)=>setEmail(event.target.value)} autoComplete="username"/></label><label className="admin-field">Password<input required type="password" value={password} onChange={(event)=>setPassword(event.target.value)} autoComplete="current-password"/></label><Button disabled={busy}>{busy?"Signing in…":"Sign in to admin"}</Button></form></main>;
}

function AdminWorkspace({ session }: { session: Session }) {
  const [section,setSection]=useState<AdminSection>("dashboard"); const [mobileOpen,setMobileOpen]=useState(false); const [collapsed,setCollapsed]=useState(false); const [data,setData]=useState<AdminData>(emptyData); const [loading,setLoading]=useState(true);
  const reload=useCallback(async()=>{setLoading(true);const[profiles,subscriptions,physicalOrders,attendance]=await Promise.all([supabase.from("profiles").select("*").order("created_at",{ascending:false}),supabase.from("subscriptions").select("*").order("created_at",{ascending:false}),supabase.from("physical_orders").select("*").order("created_at",{ascending:false}),supabase.from("attendance").select("*").order("day",{ascending:false})]);const error=profiles.error??subscriptions.error??physicalOrders.error??attendance.error;if(error)toast.error(error.message);setData({profiles:profiles.data??[],subscriptions:subscriptions.data??[],physicalOrders:physicalOrders.data??[],attendance:attendance.data??[]});setLoading(false)},[]);
  useEffect(()=>{reload()},[reload]);
  const navigate=(next:AdminSection)=>{setSection(next);setMobileOpen(false)}; const current=sections.find((item)=>item.id===section);
  return <main className={`admin-app ${collapsed?"is-collapsed":""}`}><aside className={`admin-sidebar ${mobileOpen?"is-open":""}`}><div className="admin-brand"><Logo/><button aria-label="Close navigation" onClick={()=>setMobileOpen(false)}><X/></button></div><nav aria-label="Admin navigation">{sections.map(({id,label,Icon})=><button key={id} className={section===id?"is-active":""} onClick={()=>navigate(id)} title={collapsed?label:undefined}><Icon/><span>{label}</span>{id==="orders"&&data.subscriptions.filter((item)=>item.fulfillment_status==="pending").length>0&&<b>{data.subscriptions.filter((item)=>item.fulfillment_status==="pending").length}</b>}</button>)}</nav><div className="admin-sidebar-foot"><div><span>{(session.user.email??"A").charAt(0).toUpperCase()}</span><p><b>Administrator</b><small>{session.user.email}</small></p></div><button aria-label="Sign out" title="Sign out" onClick={()=>supabase.auth.signOut()}><LogOut/></button></div></aside>{mobileOpen&&<button className="admin-sidebar-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}<section className="admin-main"><header className="admin-topbar"><div><button className="admin-mobile-menu" aria-label="Open navigation" onClick={()=>setMobileOpen(true)}><Menu/></button><button className="admin-collapse" aria-label={collapsed?"Expand navigation":"Collapse navigation"} onClick={()=>setCollapsed(!collapsed)}><PanelLeftClose/></button><div><small>5AM Operations</small><h1>{current?.label}</h1></div></div><span className="admin-live"><i/> Live workspace</span></header><div className="admin-content">{loading?<div className="admin-loader"><span/><p>Loading {current?.label.toLowerCase()}…</p></div>:<Section section={section} data={data} reload={reload} navigate={navigate}/>}</div></section></main>;
}

function Section({section,data,reload,navigate}:{section:AdminSection;data:AdminData;reload:()=>Promise<void>;navigate:(section:AdminSection)=>void}) {
  if(section==="dashboard")return <DashboardOverview data={data} navigate={navigate}/>;
  if(section==="orders")return <OrdersAdmin data={data} reload={reload}/>;
  if(section==="students")return <StudentsAdmin data={data} reload={reload}/>;
  if(section==="attendance")return <AttendanceAdmin data={data} reload={reload}/>;
  if(section==="classes")return <ClassesAdmin/>;
  if(section==="blog")return <BlogAdmin/>;
  return <GalleryAdmin/>;
}