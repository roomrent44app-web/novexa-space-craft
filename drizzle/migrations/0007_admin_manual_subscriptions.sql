ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'cancelled';

ALTER TABLE public.subscriptions
  ADD COLUMN source text NOT NULL DEFAULT 'razorpay' CHECK (source IN ('razorpay', 'manual'));

GRANT INSERT ON public.subscriptions TO authenticated;

CREATE POLICY "Admins create manual subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND source = 'manual'
  AND razorpay_order_id LIKE 'manual_%'
);