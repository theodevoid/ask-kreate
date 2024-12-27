import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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

      await db.questionSession.update({
        where: {
          id: questionSessionId,
        },
        data: {
          estimatedQuestionCount: {
            increment: 1,
          },
        },
      });
    }),

  getQuestionsBySessionId: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        sortBy: z.enum(["popular", "recent"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      let orderQuestionsBy: Prisma.QuestionOrderByWithRelationInput = {};

      switch (input.sortBy) {
        case "popular":
          orderQuestionsBy = { upvotes: "desc" };
          break;
        case "recent":
          orderQuestionsBy = { createdAt: "desc" };
          break;
        default:
          orderQuestionsBy = { createdAt: "desc" };
      }

      return await ctx.db.question.findMany({
        where: {
          questionSessionId: input.sessionId,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          isArchived: true,
          isPinned: true,
          name: true,
          userId: true,
          upvotes: true,
          QuestionUpvotes: {
            where: {
              userId: ctx.user?.id ?? "",
            },
            select: {
              userId: true,
            },
          },
          questionSessionId: true,
        },
        orderBy: orderQuestionsBy,
      });
    }),

  removeUpvoteQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { questionId } = input;

      const questionIsUpvoted = await db.questionUpvotes.findUnique({
        where: {
          questionId_userId: {
            questionId,
            userId: user.id,
          },
        },
      });

      if (!questionIsUpvoted)
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "question is not upvoted yet",
        });

      await db.$transaction(async (tx) => {
        await tx.question.update({
          where: {
            id: questionId,
          },
          data: {
            upvotes: {
              decrement: 1,
            },
          },
        });

        await tx.questionUpvotes.delete({
          where: {
            questionId_userId: {
              questionId,
              userId: user.id,
            },
          },
        });
      });
    }),

  upvoteQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { questionId } = input;

      const questionIsUpvoted = await db.questionUpvotes.findUnique({
        where: {
          questionId_userId: {
            questionId,
            userId: user.id,
          },
        },
      });

      if (questionIsUpvoted)
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "question is already upvoted",
        });

      await db.$transaction(async (tx) => {
        await tx.question.update({
          where: {
            id: questionId,
          },
          data: {
            upvotes: {
              increment: 1,
            },
          },
        });

        await tx.questionUpvotes.create({
          data: {
            questionId,
            userId: user.id,
          },
        });
      });
    }),
});
