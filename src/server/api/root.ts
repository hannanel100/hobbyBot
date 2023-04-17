import { questions } from "./../../../prisma/data";
import { createTRPCRouter } from "~/server/api/trpc";
import { hobbiesRouter } from "~/server/api/routers/hobbies";
import { userRouter } from "~/server/api/routers/user";
import { questionsRouter } from "./routers/questions";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  hobbies: hobbiesRouter,
  user: userRouter,
  questions: questionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
