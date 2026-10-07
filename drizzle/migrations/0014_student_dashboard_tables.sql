-- Student dashboard: goals, notes, community
CREATE TABLE public.student_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('daily','weekly')),
  title text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  period_key date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX student_goals_user_period_idx ON public.student_goals (user_id, kind, period_key);

CREATE TABLE public.student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled note',
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX student_notes_user_idx ON public.student_notes (user_id, created_at DESC);

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT 'Student',
  category text NOT NULL DEFAULT 'Progress' CHECK (category IN ('Progress','Doubts','Motivation','Study Tips')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX community_posts_created_idx ON public.community_posts (created_at DESC);

CREATE TABLE public.community_post_likes (
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_notes TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.community_posts TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.community_post_likes TO authenticated;
GRANT ALL ON public.student_goals TO service_role;
GRANT ALL ON public.student_notes TO service_role;
GRANT ALL ON public.community_posts TO service_role;
GRANT ALL ON public.community_post_likes TO service_role;

ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Goals are user scoped" ON public.student_goals
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Notes are user scoped" ON public.student_notes
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students read community posts" ON public.community_posts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students create own posts" ON public.community_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students delete own posts" ON public.community_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Students read likes" ON public.community_post_likes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students like as themselves" ON public.community_post_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students unlike own likes" ON public.community_post_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Wake-up streak leaderboard (cross-user, security definer)
CREATE OR REPLACE FUNCTION public.get_wakeup_streaks()
RETURNS TABLE (user_id uuid, full_name text, streak_days int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH ranked AS (
    SELECT a.user_id, a.day,
      a.day - (row_number() OVER (PARTITION BY a.user_id ORDER BY a.day))::int AS grp
    FROM public.attendance a
  ),
  streaks AS (
    SELECT user_id, grp, count(*)::int AS len, max(day) AS last_day
    FROM ranked GROUP BY user_id, grp
  )
  SELECT s.user_id, COALESCE(NULLIF(p.full_name, ''), 'Student'), s.len
  FROM streaks s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE s.last_day >= (now() AT TIME ZONE 'Asia/Kolkata')::date - 1
  ORDER BY s.len DESC
  LIMIT 8;
$$;

REVOKE EXECUTE ON FUNCTION public.get_wakeup_streaks() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_wakeup_streaks() TO authenticated;

COMMENT ON TABLE public.gallery_images IS 'DEPRECATED: gallery page removed from the site; table retained so no data is lost.';