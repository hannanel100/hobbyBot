import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const questionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.prisma.question.findMany();
    return questions;
  }),
  getRandomByNumberOfQuestions: publicProcedure
    .input(z.object({ max: z.number() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.prisma.question.findMany({
        take: input.max,
        orderBy: {
          id: "asc",
        },
      });
      return questions;
    }),
  getOptionsByQuestionId: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const options = await ctx.prisma.option.findMany({
        where: { questionId: input.questionId },
      });
      return options;
    }),
  getRandomQuestionsAndOptions: publicProcedure
    .input(z.object({ max: z.number() }))
    .query(async ({ ctx, input }) => {
      const randomSkip = Math.floor(Math.random() * 4);
      const questions = await ctx.prisma.question.findMany({
        select: {
          question: true,
          options: {
            select: {
              option: true,
            },
          },
        },
        skip: randomSkip,
        take: input.max,
      });
      return questions;
    }),
});
