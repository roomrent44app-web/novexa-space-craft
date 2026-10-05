CREATE TABLE public.nimble_call_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day date NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  response text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT ON public.nimble_call_log TO authenticated;
ALTER TABLE public.nimble_call_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read call log" ON public.nimble_call_log FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));