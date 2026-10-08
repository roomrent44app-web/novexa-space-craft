DROP FUNCTION IF EXISTS public.get_wakeup_streaks();
CREATE FUNCTION public.get_wakeup_streaks()
RETURNS TABLE(user_id uuid, full_name text, streak_days integer, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  WITH ranked AS (
    SELECT a.user_id, a.day,
      a.day - (row_number() OVER (PARTITION BY a.user_id ORDER BY a.day))::int AS grp
    FROM public.attendance a
  ),
  streaks AS (
    SELECT user_id, grp, count(*)::int AS len, max(day) AS last_day
    FROM ranked GROUP BY user_id, grp
  )
  SELECT s.user_id, COALESCE(NULLIF(p.full_name, ''), 'Student'), s.len, COALESCE(p.avatar_url, '')
  FROM streaks s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE s.last_day >= (now() AT TIME ZONE 'Asia/Kolkata')::date - 1
  ORDER BY s.len DESC
  LIMIT 8;
$function$;
GRANT EXECUTE ON FUNCTION public.get_wakeup_streaks() TO authenticated, anon;
CREATE POLICY "Signed-in students view avatars" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');