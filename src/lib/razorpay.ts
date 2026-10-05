import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => { open: () => void };
  }
}

const loadCheckout = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) { resolve(); return; }
  const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
  if (existing) {
    existing.addEventListener("load", () => resolve(), { once: true });
    existing.addEventListener("error", () => reject(new Error("Payment window could not load.")), { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.dataset.razorpayCheckout = "true";
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Payment window could not load."));
  document.head.appendChild(script);
});

const functionError = async (error: unknown, fallback: string) => {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json() as { error?: string };
      return body.error ?? fallback;
    } catch { return fallback; }
  }
  return error instanceof Error ? error.message : fallback;
};

export async function purchasePlan(planCode: string, customer: { name: string; email: string; phone: string }) {
  const [orderResult] = await Promise.all([
    supabase.functions.invoke("create-razorpay-order", { body: { planCode } }),
    loadCheckout(),
  ]);
  if (orderResult.error) throw new Error(await functionError(orderResult.error, "Could not start payment."));
  const order = orderResult.data as { orderId: string; amount: number; currency: string; keyId: string; planName: string };
  if (!window.Razorpay) throw new Error("Payment window could not load.");

  return new Promise<void>((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "5AM Study Community",
      description: order.planName,
      order_id: order.orderId,
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      theme: { color: "#f4511e" },
      handler: async (response) => {
        const result = await supabase.functions.invoke("verify-razorpay-payment", { body: response });
        if (result.error) { reject(new Error(await functionError(result.error, "Payment verification failed."))); return; }
        resolve();
      },
      modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
    });
    checkout.open();
  });
}
