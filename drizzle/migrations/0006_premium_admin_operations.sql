CREATE TYPE public.order_fulfillment_status AS ENUM ('pending', 'processing', 'delivered', 'cancelled');
CREATE TYPE public.class_link_mode AS ENUM ('temporary', 'monthly');

ALTER TABLE public.profiles
  ADD COLUMN email text NOT NULL DEFAULT '';

UPDATE public.profiles p
SET email = COALESCE(u.email, '')
FROM auth.users u
WHERE p.id = u.id AND p.email = '';

CREATE POLICY "Admins read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    COALESCE(NEW.email,'')
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END
$function$;

ALTER TABLE public.subscriptions
  ADD COLUMN fulfillment_status public.order_fulfillment_status NOT NULL DEFAULT 'pending',
  ADD COLUMN admin_notes text NOT NULL DEFAULT '',
  ADD COLUMN fulfilled_at timestamp with time zone,
  ADD COLUMN cancelled_at timestamp with time zone;

GRANT UPDATE ON public.subscriptions TO authenticated;

CREATE POLICY "Admins update subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.physical_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('5AM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text NOT NULL,
  customer_email text NOT NULL DEFAULT '',
  customer_phone text NOT NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  amount_paise integer NOT NULL CHECK (amount_paise >= 0),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status public.order_fulfillment_status NOT NULL DEFAULT 'pending',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  pincode text NOT NULL DEFAULT '',
  admin_notes text NOT NULL DEFAULT '',
  delivered_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.physical_orders TO authenticated;
GRANT ALL ON public.physical_orders TO service_role;
ALTER TABLE public.physical_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read physical orders" ON public.physical_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins create physical orders" ON public.physical_orders FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update physical orders" ON public.physical_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX physical_orders_created_idx ON public.physical_orders (created_at DESC);
CREATE INDEX physical_orders_status_idx ON public.physical_orders (fulfillment_status);

CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit log" ON public.admin_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins create audit log" ON public.admin_audit_log FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND actor_id = auth.uid());
CREATE INDEX admin_audit_created_idx ON public.admin_audit_log (created_at DESC);

ALTER TABLE public.class_settings
  ADD COLUMN temporary_meet_link text NOT NULL DEFAULT '',
  ADD COLUMN temporary_class_time text NOT NULL DEFAULT '',
  ADD COLUMN monthly_meet_link text NOT NULL DEFAULT '',
  ADD COLUMN monthly_class_time text NOT NULL DEFAULT '',
  ADD COLUMN active_link_mode public.class_link_mode NOT NULL DEFAULT 'monthly';

UPDATE public.class_settings
SET monthly_meet_link = meet_link,
    monthly_class_time = class_time
WHERE id = 1 AND monthly_meet_link = '';

CREATE POLICY "Admins manage attendance updates"
ON public.attendance
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins add attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins remove attendance"
ON public.attendance
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

GRANT UPDATE, DELETE ON public.attendance TO authenticated;

CREATE OR REPLACE FUNCTION public.audit_admin_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    INSERT INTO public.admin_audit_log (actor_id, action, target_type, target_id, details)
    VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object('changed_at', now())
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END
$function$;
REVOKE ALL ON FUNCTION public.audit_admin_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER audit_subscription_admin_change AFTER UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();
CREATE TRIGGER audit_physical_order_admin_change AFTER INSERT OR UPDATE ON public.physical_orders FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();
CREATE TRIGGER audit_profile_admin_change AFTER UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();
CREATE TRIGGER audit_attendance_admin_change AFTER INSERT OR UPDATE OR DELETE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();
CREATE TRIGGER audit_class_settings_admin_change AFTER UPDATE ON public.class_settings FOR EACH ROW EXECUTE FUNCTION public.audit_admin_change();