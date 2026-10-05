CREATE TYPE public.subscription_status AS ENUM ('pending', 'active', 'expired', 'failed');

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_code text NOT NULL,
  plan_name text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  amount_paise integer NOT NULL CHECK (amount_paise > 0),
  status public.subscription_status NOT NULL DEFAULT 'pending',
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX subscriptions_user_expiry_idx ON public.subscriptions (user_id, expires_at DESC);
CREATE INDEX subscriptions_status_idx ON public.subscriptions (status);