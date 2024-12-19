import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const questionSession = await db.questionSession.findUnique({
        where: {
          id,
        },
        select: {
          code: true,
          title: true,
          isActive: true,
          startDate: true,
          endDate: true,
          estimatedQuestionCount: true,
          user: {
            select: {
              username: true,
            },
          },
          questions: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              isArchived: true,
              isPinned: true,
              name: true,
              userId: true,
            },
          },
        },
      });

      return questionSession;
    }),

  createQuestion: protectedProcedure
    .input(
      z.object({
        body: z.string().min(3).max(280),
        name: z.string().max(30).optional(),
        questionSessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { body, name, questionSessionId } = input;
      const { db, user } = ctx;

      await db.question.create({
        data: {
          body,
          name,
          userId: user.id,
          questionSessionId,
        },
      });
    }),
});
