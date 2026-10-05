import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminData } from "./types";
import { downloadCsv, indiaDay, monthKey } from "./utils";

const shiftMonth = (month: string, offset: number) => { const date = new Date(`${month}-01T12:00:00Z`); date.setUTCMonth(date.getUTCMonth()+offset); return date.toISOString().slice(0,7); };

export default function AttendanceAdmin({ data, reload }: { data: AdminData; reload: () => Promise<void> }) {
  const [month, setMonth] = useState(indiaDay().slice(0,7));
  const [search, setSearch] = useState("");
  const monthRows = data.attendance.filter((row)=>monthKey(row.day)===month);
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const isCurrent = month===indiaDay().slice(0,7);
  const elapsed = isCurrent ? Number(indiaDay().slice(8)) : month < indiaDay().slice(0,7) ? daysInMonth : 0;
  const students = useMemo(()=>data.profiles.filter((item)=>`${item.full_name} ${item.email} ${item.phone}`.toLowerCase().includes(search.toLowerCase())),[data.profiles,search]);
  const mark = async (userId: string, day: string, present: boolean) => {
    const existing = data.attendance.find((row)=>row.user_id===userId&&row.day===day);
    if (present && !existing) { const { error } = await supabase.from("attendance").insert({user_id:userId,day}); if(error) return toast.error(error.message); }
    if (!present && existing) { const { error } = await supabase.from("attendance").delete().eq("id",existing.id); if(error) return toast.error(error.message); }
    toast.success("Attendance corrected"); await reload();
  };
  const presentCount = (id:string)=>monthRows.filter((row)=>row.user_id===id).length;
  const rate = data.profiles.length&&elapsed ? Math.round(monthRows.length/(data.profiles.length*elapsed)*100):0;
  const daily = Array.from({length:daysInMonth},(_,index)=>{const day=`${month}-${String(index+1).padStart(2,"0")}`;return {day:index+1,count:monthRows.filter((row)=>row.day===day).length};});
  const exportRows=()=>downloadCsv(`5am-attendance-${month}.csv`,[["Student","Email","Mobile","Present days","Tracked days","Rate"],...students.map((item)=>{const count=presentCount(item.id);return[item.full_name,item.email,item.phone,count,elapsed,elapsed?`${Math.round(count/elapsed*100)}%`:"0%"]})]);
  return <div className="admin-stack"><section className="admin-attendance-summary"><article><small>Present records</small><strong>{monthRows.length}</strong></article><article><small>Students tracked</small><strong>{new Set(monthRows.map((row)=>row.user_id)).size}</strong></article><article><small>Average rate</small><strong>{rate}%</strong></article><article><small>Tracked days</small><strong>{elapsed}</strong></article></section><section className="admin-panel"><div className="admin-panel-head"><div><small>Daily overview</small><h2>{new Date(`${month}-02`).toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</h2></div><div className="admin-month-nav"><Button variant="outline" size="icon" aria-label="Previous month" onClick={()=>setMonth(shiftMonth(month,-1))}><ChevronLeft/></Button><Button variant="outline" size="icon" aria-label="Next month" disabled={month>=indiaDay().slice(0,7)} onClick={()=>setMonth(shiftMonth(month,1))}><ChevronRight/></Button></div></div><div className="admin-attendance-bars">{daily.map((item)=><div key={item.day} title={`${item.count} present on day ${item.day}`}><span style={{height:`${data.profiles.length?Math.max(4,item.count/data.profiles.length*100):4}%`}}/><small>{item.day}</small></div>)}</div></section><div className="admin-toolbar"><label className="admin-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search students"/></label><Button variant="outline" onClick={exportRows}><Download/> Export month</Button></div><section className="admin-panel admin-table-panel"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Rate</TableHead><TableHead>Correct a date</TableHead></TableRow></TableHeader><TableBody>{students.map((item)=>{const count=presentCount(item.id);const percentage=elapsed?Math.round(count/elapsed*100):0;return <TableRow key={item.id}><TableCell><b>{item.full_name||"Student"}</b><small>{item.email}</small></TableCell><TableCell>{count} days</TableCell><TableCell>{Math.max(0,elapsed-count)} days</TableCell><TableCell><span className={`admin-status ${percentage>=75?"is-active":"is-inactive"}`}>{percentage}%</span></TableCell><TableCell><Input className="admin-date-input" type="date" min={`${month}-01`} max={`${month}-${String(Math.min(daysInMonth,elapsed||daysInMonth)).padStart(2,"0")}`} onChange={(event)=>{const day=event.target.value;if(!day)return;const present=Boolean(data.attendance.find((row)=>row.user_id===item.id&&row.day===day));if(confirm(`${present?"Remove":"Mark"} attendance for ${item.full_name||"this student"} on ${day}?`)) mark(item.id,day,!present);event.target.value="";}}/></TableCell></TableRow>})}</TableBody></Table></section></div>;
}