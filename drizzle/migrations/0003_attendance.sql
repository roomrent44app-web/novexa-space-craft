CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Kolkata')::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT, INSERT ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own attendance" ON public.attendance FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users mark own attendance today" ON public.attendance FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND day = ((now() AT TIME ZONE 'Asia/Kolkata')::date));