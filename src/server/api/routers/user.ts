import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getBySession: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }),
});
