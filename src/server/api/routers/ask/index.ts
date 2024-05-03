import { createTRPCRouter } from "~/server/api/trpc";
import { createQuestion } from "./createQuestion";

export const askRouter = createTRPCRouter({
  createQuestion,
});
