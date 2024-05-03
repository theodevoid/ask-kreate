import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const createQuestion = protectedProcedure
  .input(
    z.object({
      body: z.string().max(280, "body must be under 280 characters"),
      toUserId: z.string().cuid(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { body, toUserId } = input;
    const { session, db } = ctx;

    await db.question.create({
      data: {
        body,
        toUserId,
        askedByUserId: session.user.id,
      },
    });
  });
