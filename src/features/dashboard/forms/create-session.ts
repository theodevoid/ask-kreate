import { z } from "zod";

export const createSessionFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  isActive: z.boolean().default(true),
});

export type CreateSessionFormSchema = z.infer<typeof createSessionFormSchema>;
