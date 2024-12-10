import axios from "axios";
import { env } from "~/env";
import { supabase } from "./supabase/client";

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();

  config.headers.Authorization = "Bearer " + session.data.session?.access_token;

  return config;
});
