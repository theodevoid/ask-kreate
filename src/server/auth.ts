import { type GetServerSidePropsContext } from "next";
import { createSSRClient } from "~/lib/supabase/client";

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const supabaseServerClient = createSSRClient(ctx);

  const { data } = await supabaseServerClient.auth.getUser();

  if (data?.user) {
    return data.user;
  }
};
