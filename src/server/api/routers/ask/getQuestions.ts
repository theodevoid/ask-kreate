import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const getQuestions = publicProcedure
  .input(
    z.object({
      cursor: z.string().cuid().optional(),
      limit: z.number().min(1).default(10),
      userId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { cursor, limit, userId } = input;
    const { db } = ctx;

    const questions = await db.question.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
      }),
      include: {
        askedBy: true,
      },
      where: {
        toUserId: userId,
        answeredAt: {
          not: null,
        },
        isArchived: false,
      },
      orderBy: {
        id: "desc",
      },
    });

    console.log(questions);

    const hasNext = questions.length > limit;
    let nextCursor = null;

    if (hasNext && questions.length !== limit) {
      questions.pop();
      nextCursor = questions[questions.length - 1]?.id;
    }

    return {
      data: questions,
      hasNext,
      nextCursor,
    };
  });
