import type { Database } from "@/integrations/supabase/types";

export type AdminSection = "dashboard" | "orders" | "students" | "attendance" | "classes" | "blog" | "gallery";
export type FulfillmentStatus = Database["public"]["Enums"]["order_fulfillment_status"];
export type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AttendanceRow = Database["public"]["Tables"]["attendance"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type PhysicalOrder = Database["public"]["Tables"]["physical_orders"]["Row"];

export type UnifiedOrder = {
  id: string;
  kind: "plan" | "physical";
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  item: string;
  amountPaise: number;
  paymentStatus: string;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  notes: string;
  source: Subscription | PhysicalOrder;
};

export type AdminData = {
  profiles: Profile[];
  subscriptions: Subscription[];
  physicalOrders: PhysicalOrder[];
  attendance: AttendanceRow[];
};