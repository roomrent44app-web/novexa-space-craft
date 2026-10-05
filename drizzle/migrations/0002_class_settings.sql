CREATE TABLE public.class_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  meet_link text NOT NULL DEFAULT '',
  class_time text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.class_settings TO authenticated;
GRANT ALL ON public.class_settings TO service_role;
ALTER TABLE public.class_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read class" ON public.class_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin inserts class" ON public.class_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates class" ON public.class_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));