import { type User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";
import { api } from "~/utils/api";

export const useAuth = () => {
  const router = useRouter();
  const createUser = api.profile.createProfile.useMutation({});

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userData = session.user;

        setCurrentUser(userData);

        if (_event === "PASSWORD_RECOVERY") {
          void router.replace("reset-password");
        }

        if (_event === "SIGNED_IN") {
          createUser.mutate();
        }
      } else {
        setCurrentUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  return {
    user: currentUser,
    isLoading,
  };
};
