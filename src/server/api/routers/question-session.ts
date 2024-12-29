import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { supabaseDefaultClient } from "~/lib/supabase/client";
import { QuestionEvent } from "~/lib/supabase/events";

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

  updateSession: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(3, {
            message: "Title must be at least 3 characters.",
          })
          .optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        isActive: z.boolean().default(true).optional(),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { endDate, isActive, startDate, title, sessionId } = input;

      const questionSession = await db.questionSession.update({
        where: {
          id: sessionId,
          userId: user.id,
        },
        data: {
          endDate: endDate ?? Prisma.skip,
          startDate: startDate ?? Prisma.skip,
          title: title ?? Prisma.skip,
          isActive: isActive ?? Prisma.skip,
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
      orderBy: {
        createdAt: "desc",
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
          name: name ?? Prisma.skip,
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
      let orderQuestionsBy:
        | Prisma.QuestionOrderByWithRelationInput
        | Prisma.QuestionOrderByWithRelationInput[]
        | undefined = {};

      switch (input.sortBy) {
        case "popular":
          orderQuestionsBy = [{ isPinned: "desc" }, { upvotes: "desc" }];
          break;
        case "recent":
          orderQuestionsBy = [{ isPinned: "desc" }, { createdAt: "desc" }];
          break;
        default:
          orderQuestionsBy = [{ isPinned: "desc" }, { createdAt: "desc" }];
      }

      return await ctx.db.question.findMany({
        where: {
          questionSessionId: input.sessionId,
          isArchived: false,
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

  archiveQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId } = input;
      const { db, user } = ctx;

      await db.question.update({
        where: {
          questionSession: {
            userId: user.id,
          },
          id: questionId,
        },
        data: {
          isArchived: true,
        },
      });
    }),

  pinQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId } = input;
      const { db, user } = ctx;

      const pinnedQuestion = await db.question.update({
        where: {
          questionSession: {
            userId: user.id,
          },
          id: questionId,
        },
        data: {
          isPinned: true,
        },
      });

      await db.question.updateMany({
        where: {
          isPinned: true,
          questionSession: {
            userId: user.id,
          },
          NOT: {
            id: pinnedQuestion.id,
          },
        },
        data: {
          isPinned: false,
        },
      });

      const overlaySettings = await db.overlaySettings.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          key: true,
        },
      });

      const overlayChannel = supabaseDefaultClient.channel(
        `overlay:${overlaySettings?.key}`,
      );

      await overlayChannel.send({
        type: "broadcast",
        event: QuestionEvent.PINNED,
        payload: {
          questionId: pinnedQuestion.id,
        },
      });
    }),

  getPinnedQuestionByStreamKey: publicProcedure
    .input(
      z.object({
        streamKey: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { streamKey } = input;

      const overlaySettings = await db.overlaySettings.findUnique({
        where: {
          key: streamKey,
        },
      });

      if (!overlaySettings) return;

      const pinnedQuestion = await db.question.findFirst({
        where: {
          questionSession: {
            userId: overlaySettings.userId,
          },
          isPinned: true,
        },
      });

      return pinnedQuestion;
    }),
});
