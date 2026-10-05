import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSelect from "./AdminSelect";
import type { AdminData } from "./types";
import { downloadCsv, formatDate, formatMoney, indiaDay } from "./utils";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlansAdmin({ data }: { data: AdminData }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const profileMap = useMemo(() => new Map(data.profiles.map((item) => [item.id, item])), [data.profiles]);

  const rows = useMemo(() => data.subscriptions
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .filter((item) => {
      const profile = profileMap.get(item.user_id);
      const text = `${profile?.full_name ?? ""} ${profile?.email ?? ""} ${profile?.phone ?? ""} ${item.plan_name}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
      return filter === "all" || item.status === filter;
    }), [data.subscriptions, profileMap, search, filter]);

  const planCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of data.subscriptions) counts.set(item.plan_name, (counts.get(item.plan_name) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [data.subscriptions]);

  const dayCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of data.subscriptions) for (const day of item.class_days ?? []) counts.set(day, (counts.get(day) ?? 0) + 1);
    return DAY_ORDER.map((day) => [day, counts.get(day) ?? 0] as const);
  }, [data.subscriptions]);

  const studentCount = new Set(data.subscriptions.map((item) => item.user_id)).size;
  const activeCount = data.subscriptions.filter((item) => item.status === "active").length;

  const exportRows = () => downloadCsv("5am-plan-choices.csv", [
    ["Student", "Email", "Mobile", "Plan", "Class days", "Amount", "Status", "Starts", "Expires"],
    ...rows.map((item) => {
      const profile = profileMap.get(item.user_id);
      return [
        profile?.full_name ?? "Student",
        profile?.email ?? "",
        profile?.phone ?? "",
        item.plan_name,
        (item.class_days ?? []).join(" ") || "All days",
        formatMoney(item.amount_paise),
        item.status,
        formatDate(item.starts_at),
        formatDate(item.expires_at),
      ];
    }),
  ]);

  return <div className="admin-stack">
    <div className="admin-stat-grid">
      <div className="admin-stat"><small>Plans taken</small><b>{data.subscriptions.length}</b></div>
      <div className="admin-stat"><small>Students with plans</small><b>{studentCount}</b></div>
      <div className="admin-stat"><small>Active right now</small><b>{activeCount}</b></div>
      {planCounts.slice(0, 2).map(([name, count]) => <div key={name} className="admin-stat"><small>{name}</small><b>{count}</b></div>)}
    </div>
    <div className="admin-toolbar">
      <label className="admin-search"><Search/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or plan" /></label>
      <AdminSelect label="Plan status" value={filter} onChange={setFilter} options={[{ value: "all", label: "All plans" }, { value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "expired", label: "Expired" }, { value: "cancelled", label: "Cancelled" }, { value: "failed", label: "Failed" }]} />
      <Button variant="outline" onClick={exportRows}><Download /> Export</Button>
    </div>
    <section className="admin-panel admin-table-panel">
      <div className="admin-panel-head"><div><small>Plan selections</small><h2>Which plan and class days each student chose</h2></div></div>
      <Table>
        <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Plan</TableHead><TableHead>Class days</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Starts</TableHead><TableHead>Expires</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map((item) => {
          const profile = profileMap.get(item.user_id);
          const days = item.class_days ?? [];
          return <TableRow key={item.id}>
            <TableCell><div className="admin-person"><div><b>{profile?.full_name || "Student"}</b><small>{profile?.email || item.user_id.slice(0, 8)}</small></div></div></TableCell>
            <TableCell><b>{item.plan_name}</b></TableCell>
            <TableCell>{days.length ? <span className="admin-days">{days.slice().sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)).map((day) => <span key={day} className="admin-day-chip">{day}</span>)}</span> : "All days"}</TableCell>
            <TableCell>{formatMoney(item.amount_paise)}</TableCell>
            <TableCell><span className={`admin-status payment-${item.status}`}>{item.status}</span></TableCell>
            <TableCell>{formatDate(item.starts_at)}</TableCell>
            <TableCell>{formatDate(item.expires_at)}</TableCell>
          </TableRow>;
        })}{!rows.length && <TableRow><TableCell colSpan={7}><p className="admin-empty">No plan records match.</p></TableCell></TableRow>}</TableBody>
      </Table>
    </section>
    <div className="admin-two-col">
      <section className="admin-panel"><div className="admin-panel-head"><div><small>Plan popularity</small><h2>Plans taken by students</h2></div></div>{planCounts.map(([name, count]) => <div key={name} className="admin-meter-row"><span>{name}</span><div className="admin-meter"><i style={{ width: `${Math.round((count / Math.max(1, data.subscriptions.length)) * 100)}%` }} /></div><b>{count}</b></div>)}{!planCounts.length && <p className="admin-empty">No plans yet.</p>}</section>
      <section className="admin-panel"><div className="admin-panel-head"><div><small>Class day choices</small><h2>How many students picked each day</h2></div></div>{dayCounts.map(([day, count]) => <div key={day} className="admin-meter-row"><span>{day}</span><div className="admin-meter"><i style={{ width: `${Math.round((count / Math.max(1, studentCount)) * 100)}%` }} /></div><b>{count}</b></div>)}</section>
    </div>
  </div>;
}
