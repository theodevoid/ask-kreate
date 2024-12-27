import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";

export const useAnonymousAuth = () => {
  const [currentAnonymousUser, setCurrentAnonymousUser] = useState<User | null>(
    null,
  );

  const signInAnonymously = async () => {
    const { data: userData } = await supabase.auth.getUser();
    console.log("🚀 ~ signInAnonymously ~ userData:", userData);

    if (userData.user) {
      setCurrentAnonymousUser(userData.user);
      return;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    console.log("🚀 ~ signInAnonymously ~ error:", error);

    setCurrentAnonymousUser(data.user);
  };

  useEffect(() => {
    void signInAnonymously();
  }, []);

  return {
    user: currentAnonymousUser,
  };
};
