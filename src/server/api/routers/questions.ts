import { TRPCError } from "@trpc/server";

import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
      console.log(
        "🚀 ~ file: questions.ts:40 ~ .query ~ randomSkip:",
        randomSkip
      );
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
      console.log(
        "🚀 ~ file: questions.ts:56 ~ .query ~ questions:",
        questions
      );
      console.log(
        "🚀 ~ file: questions.ts:60 ~ .query ~ questions.length:",
        questions.length
      );
      return questions;
    }),
});
