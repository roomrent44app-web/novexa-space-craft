import type { AttendanceRow, PhysicalOrder, Profile, Subscription, UnifiedOrder } from "./types";

export const formatMoney = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
export const formatDate = (value: string | null) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
  : "—";
export const indiaDay = (date = new Date()) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
}).format(date);
export const monthKey = (value: string) => value.slice(0, 7);

export function buildOrders(profiles: Profile[], subscriptions: Subscription[], physicalOrders: PhysicalOrder[]): UnifiedOrder[] {
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  const plans: UnifiedOrder[] = subscriptions.map((subscription) => {
    const profile = profileMap.get(subscription.user_id);
    return {
      id: subscription.id,
      kind: "plan",
      orderNumber: subscription.razorpay_order_id,
      customerName: profile?.full_name || "Student",
      customerEmail: profile?.email || "",
      customerPhone: profile?.phone || "",
      item: subscription.plan_name,
      amountPaise: subscription.amount_paise,
      paymentStatus: subscription.status,
      fulfillmentStatus: subscription.fulfillment_status,
      createdAt: subscription.created_at,
      notes: subscription.admin_notes,
      source: subscription,
    };
  });
  const goods: UnifiedOrder[] = physicalOrders.map((order) => ({
    id: order.id,
    kind: "physical",
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    item: `${order.item_name}${order.quantity > 1 ? ` × ${order.quantity}` : ""}`,
    amountPaise: order.amount_paise,
    paymentStatus: order.payment_status,
    fulfillmentStatus: order.fulfillment_status,
    createdAt: order.created_at,
    notes: order.admin_notes,
    source: order,
  }));
  return [...plans, ...goods].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function attendanceForMonth(rows: AttendanceRow[], month: string) {
  return rows.filter((row) => monthKey(row.day) === month);
}

export function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}