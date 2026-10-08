CREATE TABLE public.student_bans (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL DEFAULT '',
  banned_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.student_bans TO authenticated;
GRANT ALL ON public.student_bans TO service_role;
ALTER TABLE public.student_bans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and self read bans" ON public.student_bans FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins ban students" ON public.student_bans FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND banned_by = auth.uid());
CREATE POLICY "Admins unban students" ON public.student_bans FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.is_banned(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.student_bans WHERE user_id = _user_id) $$;

CREATE POLICY "Admins delete any post" ON public.community_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY "Students create own posts" ON public.community_posts;
CREATE POLICY "Students create own posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND NOT public.is_banned(auth.uid()));
CREATE POLICY "Admins delete any like" ON public.community_post_likes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));