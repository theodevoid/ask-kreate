import { z } from "zod";

export const askQuestionFormSchema = z.object({
  body: z.string().min(3).max(280),
  name: z.string().max(30).optional(),
});

export type AskQuestionFormSchema = z.infer<typeof askQuestionFormSchema>;
