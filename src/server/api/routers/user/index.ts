import { createTRPCRouter } from "~/server/api/trpc";
import { getUser } from "./getUser";

export const userRouter = createTRPCRouter({
  getUser,
});
