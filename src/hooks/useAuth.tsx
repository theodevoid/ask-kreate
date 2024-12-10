import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "~/lib/supabase/client";
import { api } from "~/utils/api";

export const useAuth = () => {
  const router = useRouter();
  const createUser = api.profile.createProfile.useMutation({});

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        void router.replace("reset-password");
      }

      if (_event === "SIGNED_IN") {
        createUser.mutate();
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);
};
