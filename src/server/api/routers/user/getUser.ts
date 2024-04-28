import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getUser = protectedProcedure
  .input(
    z.object({
      username: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        username: input.username,
      },
    });

    return user;
  });
