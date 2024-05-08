import { createTRPCRouter } from "~/server/api/trpc";
import { createQuestion } from "./createQuestion";
import { getQuestions } from "./getQuestions";

export const askRouter = createTRPCRouter({
  createQuestion,
  getQuestions,
});
