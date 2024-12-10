import { z } from "zod";

export const loginUserFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginUserFormSchema = z.infer<typeof loginUserFormSchema>;
