CREATE OR REPLACE FUNCTION public.get_streak_rankings(_period text)
RETURNS TABLE(user_id uuid, full_name text, avatar_url text, days integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT a.user_id, COALESCE(NULLIF(p.full_name,''),'Student'), COALESCE(p.avatar_url,''), count(DISTINCT a.day)::int
  FROM public.attendance a
  JOIN public.profiles p ON p.id = a.user_id
  WHERE auth.uid() IS NOT NULL
    AND (_period <> 'week' OR a.day >= date_trunc('week', (now() AT TIME ZONE 'Asia/Kolkata'))::date)
  GROUP BY a.user_id, p.full_name, p.avatar_url
  ORDER BY 4 DESC, min(a.created_at) ASC
  LIMIT 10;
$function$;
REVOKE ALL ON FUNCTION public.get_streak_rankings(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_streak_rankings(text) TO authenticated;