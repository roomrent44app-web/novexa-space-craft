ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS registration jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email, registration)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    COALESCE(NEW.email,''),
    COALESCE(NEW.raw_user_meta_data->'registration','{}'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, registration = EXCLUDED.registration;
  RETURN NEW;
END
$function$;