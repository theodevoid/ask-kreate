import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { customAlphabet } from "nanoid";

export const questionSessionRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, {
          message: "Title must be at least 3 characters.",
        }),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { endDate, isActive, startDate, title } = input;

      const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 9);
      const randomlyGeneratedCode = nanoid();

      const questionSession = await db.questionSession.create({
        data: {
          code: randomlyGeneratedCode,
          endDate,
          startDate,
          title,
          isActive,
          user: {
            connect: {
              userId: user.id,
            },
          },
        },
      });

      return questionSession;
    }),

  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const questionSessions = await db.questionSession.findMany({
      where: {
        userId: user.id,
      },
    });

    return questionSessions;
  }),
});
