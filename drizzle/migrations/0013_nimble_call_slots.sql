ALTER TABLE public.nimble_call_log ADD COLUMN IF NOT EXISTS slot text NOT NULL DEFAULT 'call_1';
DO $$ DECLARE c text; BEGIN
  SELECT conname INTO c FROM pg_constraint WHERE conrelid='public.nimble_call_log'::regclass AND contype='u';
  IF c IS NOT NULL THEN EXECUTE format('ALTER TABLE public.nimble_call_log DROP CONSTRAINT %I', c); END IF;
END $$;
ALTER TABLE public.nimble_call_log ADD CONSTRAINT nimble_call_log_user_day_slot_key UNIQUE (user_id, day, slot);