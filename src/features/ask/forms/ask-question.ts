import { z } from "zod";

export const askQuestionFormSchema = z.object({
  body: z.string().min(1).max(280),
});

export type AskQuestionFormSchema = z.infer<typeof askQuestionFormSchema>;
