import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSelect from "./AdminSelect";
import type { AdminData, FulfillmentStatus, UnifiedOrder } from "./types";
import { buildOrders, downloadCsv, formatDate, formatMoney } from "./utils";

const statuses = ["pending", "processing", "delivered", "cancelled"] as const;
const blank = { customer_name: "", customer_email: "", customer_phone: "", item_name: "", quantity: "1", amount: "", payment_status: "pending", address: "", city: "", state: "", pincode: "", admin_notes: "" };

export default function OrdersAdmin({ data, reload }: { data: AdminData; reload: () => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<UnifiedOrder | null>(null);
  const [notes, setNotes] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const orders = useMemo(() => buildOrders(data.profiles, data.subscriptions, data.physicalOrders), [data]);
  const filtered = orders.filter((order) => {
    const needle = search.toLowerCase();
    const matches = `${order.orderNumber} ${order.customerName} ${order.customerEmail} ${order.customerPhone} ${order.item}`.toLowerCase().includes(needle);
    return matches && (kind === "all" || order.kind === kind) && (status === "all" || order.fulfillmentStatus === status);
  });
  const updateStatus = async (order: UnifiedOrder, fulfillmentStatus: FulfillmentStatus) => {
    const table = order.kind === "plan" ? "subscriptions" : "physical_orders";
    const now = new Date().toISOString();
    const dates = order.kind === "plan"
      ? { fulfilled_at: fulfillmentStatus === "delivered" ? now : null, cancelled_at: fulfillmentStatus === "cancelled" ? now : null }
      : { delivered_at: fulfillmentStatus === "delivered" ? now : null, cancelled_at: fulfillmentStatus === "cancelled" ? now : null };
    const { error } = await supabase.from(table).update({ fulfillment_status: fulfillmentStatus, ...dates, updated_at: now }).eq("id", order.id);
    if (error) toast.error(error.message); else { toast.success("Order status updated"); await reload(); }
  };
  const saveNotes = async () => {
    if (!editing) return;
    const table = editing.kind === "plan" ? "subscriptions" : "physical_orders";
    const { error } = await supabase.from(table).update({ admin_notes: notes, updated_at: new Date().toISOString() }).eq("id", editing.id);
    if (error) toast.error(error.message); else { toast.success("Order notes saved"); setEditing(null); await reload(); }
  };
  const createOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from("physical_orders").insert({
      customer_name: form.customer_name.trim(), customer_email: form.customer_email.trim(), customer_phone: form.customer_phone.trim(), item_name: form.item_name.trim(), quantity: Number(form.quantity), amount_paise: Math.round(Number(form.amount) * 100), payment_status: form.payment_status, address: form.address.trim(), city: form.city.trim(), state: form.state.trim(), pincode: form.pincode.trim(), admin_notes: form.admin_notes.trim(),
    });
    if (error) toast.error(error.message); else { toast.success("Physical order created"); setForm(blank); setCreateOpen(false); await reload(); }
  };
  const exportRows = () => downloadCsv("5am-orders.csv", [["Type","Order","Customer","Email","Phone","Item","Amount","Payment","Status","Date"], ...filtered.map((order) => [order.kind, order.orderNumber, order.customerName, order.customerEmail, order.customerPhone, order.item, order.amountPaise / 100, order.paymentStatus, order.fulfillmentStatus, order.createdAt])]);
  return <div className="admin-stack">
    <div className="admin-toolbar"><label className="admin-search"><Search/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders or customers" /></label><AdminSelect label="Order type" value={kind} onChange={setKind} options={[{value:"all",label:"All order types"},{value:"plan",label:"Plan payments"},{value:"physical",label:"Physical orders"}]} /><AdminSelect label="Order status" value={status} onChange={setStatus} options={[{value:"all",label:"All statuses"}, ...statuses.map((item) => ({value:item,label:item.charAt(0).toUpperCase()+item.slice(1)}))]} /><Button variant="outline" onClick={exportRows}><Download/> Export</Button><Button onClick={() => setCreateOpen(true)}><Plus/> New order</Button></div>
    <section className="admin-panel admin-table-panel"><div className="admin-panel-head"><div><small>Unified order desk</small><h2>{filtered.length} orders</h2></div></div><Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Amount</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filtered.map((order) => <TableRow key={`${order.kind}-${order.id}`}><TableCell><b className="admin-order-id">{order.orderNumber}</b><span className={`admin-kind ${order.kind}`}>{order.kind === "plan" ? "Plan" : "Goods"}</span></TableCell><TableCell><b>{order.customerName}</b><small>{order.customerPhone || order.customerEmail}</small></TableCell><TableCell>{order.item}</TableCell><TableCell><b>{formatMoney(order.amountPaise)}</b></TableCell><TableCell><span className={`admin-status payment-${order.paymentStatus}`}>{order.paymentStatus}</span></TableCell><TableCell><AdminSelect label={`Status for ${order.orderNumber}`} value={order.fulfillmentStatus} onChange={(value) => updateStatus(order, value as FulfillmentStatus)} options={statuses.map((item) => ({value:item,label:item.charAt(0).toUpperCase()+item.slice(1)}))} /></TableCell><TableCell>{formatDate(order.createdAt)}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => { setEditing(order); setNotes(order.notes); }}>Details</Button></TableCell></TableRow>)}</TableBody></Table>{filtered.length === 0 && <p className="admin-empty">No orders match these filters.</p>}</section>
    <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}><DialogContent><DialogHeader><DialogTitle>{editing?.orderNumber}</DialogTitle><DialogDescription>{editing?.customerName} · {editing?.item}</DialogDescription></DialogHeader><label className="admin-field">Admin notes<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Delivery note, follow-up, or internal detail" /></label><DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveNotes}>Save notes</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent className="admin-order-dialog"><DialogHeader><DialogTitle>Create physical order</DialogTitle><DialogDescription>Add an offline or manually received physical order.</DialogDescription></DialogHeader><form className="admin-form-grid" onSubmit={createOrder}>{Object.entries({ customer_name:"Customer name", customer_email:"Email", customer_phone:"Mobile", item_name:"Item name", quantity:"Quantity", amount:"Amount (₹)", address:"Address", city:"City", state:"State", pincode:"Pincode" }).map(([key,label]) => <label className="admin-field" key={key}>{label}<Input required={["customer_name","customer_phone","item_name","amount"].includes(key)} type={["quantity","amount"].includes(key) ? "number" : key === "customer_email" ? "email" : "text"} min={key === "quantity" ? "1" : undefined} step={key === "amount" ? "0.01" : undefined} value={form[key as keyof typeof form]} onChange={(event) => setForm({...form,[key]:event.target.value})}/></label>)}<label className="admin-field">Payment<AdminSelect label="Payment status" value={form.payment_status} onChange={(value) => setForm({...form,payment_status:value})} options={["pending","paid","failed","refunded"].map((item)=>({value:item,label:item.charAt(0).toUpperCase()+item.slice(1)}))}/></label><label className="admin-field admin-span">Admin notes<Textarea value={form.admin_notes} onChange={(event)=>setForm({...form,admin_notes:event.target.value})}/></label><DialogFooter className="admin-span"><Button type="button" variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Button><Button type="submit">Create order</Button></DialogFooter></form></DialogContent></Dialog>
  </div>;
}