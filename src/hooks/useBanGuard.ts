import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/** Signs out any student an admin has banned. */
export function useBanGuard() {
  useEffect(() => {
    const check = async (userId?: string) => {
      if (!userId) return;
      const { data } = await supabase.from("student_bans").select("reason").eq("user_id", userId).maybeSingle();
      if (data) {
        await supabase.auth.signOut();
        toast.error("Your account has been banned by 5AM for violating community rules.", { duration: 8000 });
      }
    };
    supabase.auth.getUser().then(({ data }) => check(data.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") setTimeout(() => check(session?.user.id), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
}
