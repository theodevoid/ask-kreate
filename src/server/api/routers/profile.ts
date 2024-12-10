import { generateFromEmail } from "unique-username-generator";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  createProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, user } = ctx;

    const profileExists = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profileExists) return;

    const generatedUsername = generateFromEmail(user.email!, 4);

    await db.profile.create({
      data: {
        email: user.email!,
        username: generatedUsername,
        userId: user.id,
      },
    });
  }),
});
