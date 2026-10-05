import { CalendarCheck, CircleDollarSign, Clock3, PackageCheck, ShoppingBag, UserRound, UsersRound, Video } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminData, AdminSection } from "./types";
import { buildOrders, formatDate, formatMoney, indiaDay, monthKey } from "./utils";

export default function DashboardOverview({ data, navigate }: { data: AdminData; navigate: (section: AdminSection) => void }) {
  const orders = buildOrders(data.profiles, data.subscriptions, data.physicalOrders);
  const now = new Date();
  const month = indiaDay(now).slice(0, 7);
  const paidPlans = data.subscriptions.filter((item) => item.status === "active");
  const paidGoods = data.physicalOrders.filter((item) => item.payment_status === "paid" && item.fulfillment_status !== "cancelled");
  const revenue = paidPlans.reduce((sum, item) => sum + item.amount_paise, 0) + paidGoods.reduce((sum, item) => sum + item.amount_paise, 0);
  const monthRevenue = [...paidPlans.map((item) => ({ amount: item.amount_paise, date: item.created_at })), ...paidGoods.map((item) => ({ amount: item.amount_paise, date: item.created_at }))]
    .filter((item) => monthKey(item.date) === month).reduce((sum, item) => sum + item.amount, 0);
  const active = data.subscriptions.filter((item) => item.status === "active" && item.expires_at && new Date(item.expires_at) > now);
  const expiring = active.filter((item) => item.expires_at && new Date(item.expires_at).getTime() - now.getTime() <= 3 * 86400000);
  const today = data.attendance.filter((item) => item.day === indiaDay()).length;
  const monthRows = data.attendance.filter((item) => monthKey(item.day) === month);
  const daysElapsed = Math.max(1, Number(indiaDay().slice(8)));
  const rate = data.profiles.length ? Math.round((monthRows.length / (data.profiles.length * daysElapsed)) * 100) : 0;
  const chart = Array.from({ length: daysElapsed }, (_, index) => {
    const day = `${month}-${String(index + 1).padStart(2, "0")}`;
    return { day: String(index + 1), present: data.attendance.filter((row) => row.day === day).length };
  });
  const profileMap = new Map(data.profiles.map((profile) => [profile.id, profile]));
  const cards = [
    ["Verified revenue", formatMoney(revenue), CircleDollarSign, "All paid orders"],
    ["This month", formatMoney(monthRevenue), PackageCheck, "Verified revenue"],
    ["Total orders", String(orders.length), ShoppingBag, `${orders.filter((order) => order.fulfillmentStatus === "pending").length} pending`],
    ["Students", String(data.profiles.length), UsersRound, `${active.length} active plans`],
    ["Today's attendance", String(today), CalendarCheck, `${rate}% monthly rate`],
    ["Expiring soon", String(expiring.length), Clock3, "Within 3 days"],
  ] as const;
  return <div className="admin-stack">
    <section className="admin-kpis">{cards.map(([label, value, Icon, detail]) => <article key={label} className="admin-kpi"><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></article>)}</section>
    <section className="admin-dashboard-grid">
      <article className="admin-panel admin-chart-panel"><div className="admin-panel-head"><div><small>Attendance trend</small><h2>This month</h2></div><button onClick={() => navigate("attendance")}>View report</button></div><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35}/><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Area type="monotone" dataKey="present" stroke="hsl(var(--primary))" fill="url(#attendanceFill)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div></article>
      <article className="admin-panel"><div className="admin-panel-head"><div><small>Quick actions</small><h2>Run 5AM</h2></div></div><div className="admin-quick-grid"><button onClick={() => navigate("orders")}><ShoppingBag/><span>Manage orders</span></button><button onClick={() => navigate("students")}><UserRound/><span>Find a student</span></button><button onClick={() => navigate("classes")}><Video/><span>Update class</span></button><button onClick={() => navigate("attendance")}><CalendarCheck/><span>Attendance</span></button></div></article>
    </section>
    <section className="admin-dashboard-grid equal">
      <article className="admin-panel"><div className="admin-panel-head"><div><small>Latest activity</small><h2>Recent orders</h2></div><button onClick={() => navigate("orders")}>All orders</button></div><div className="admin-compact-list">{orders.slice(0, 5).map((order) => <div key={`${order.kind}-${order.id}`}><span className={`admin-kind ${order.kind}`}>{order.kind === "plan" ? "Plan" : "Goods"}</span><div><b>{order.customerName}</b><small>{order.item} · {formatDate(order.createdAt)}</small></div><strong>{formatMoney(order.amountPaise)}</strong></div>)}{orders.length === 0 && <p className="admin-empty">No orders yet.</p>}</div></article>
      <article className="admin-panel"><div className="admin-panel-head"><div><small>Needs attention</small><h2>Plans expiring soon</h2></div><button onClick={() => navigate("students")}>All students</button></div><div className="admin-compact-list">{expiring.slice(0, 5).map((plan) => <div key={plan.id}><span className="admin-avatar">{(profileMap.get(plan.user_id)?.full_name || "S").charAt(0)}</span><div><b>{profileMap.get(plan.user_id)?.full_name || "Student"}</b><small>{plan.plan_name} · expires {formatDate(plan.expires_at)}</small></div></div>)}{expiring.length === 0 && <p className="admin-empty">No plans expire in the next three days.</p>}</div></article>
    </section>
  </div>;
}