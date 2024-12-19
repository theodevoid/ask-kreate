import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";

export const useAnonymousAuth = () => {
  const [currentAnonymousUser, setCurrentAnonymousUser] = useState<User | null>(
    null,
  );

  const signInAnonymously = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (userData) {
      setCurrentAnonymousUser(userData.user);
      return;
    }

    const { data } = await supabase.auth.signInAnonymously();

    setCurrentAnonymousUser(data.user);
  };

  useEffect(() => {
    void signInAnonymously();
  }, []);

  return {
    user: currentAnonymousUser,
  };
};
