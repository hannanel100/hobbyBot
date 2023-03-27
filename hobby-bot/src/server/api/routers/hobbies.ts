import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { z } from "zod";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const configuration = new Configuration({
  apiKey: env.OPENAPI_KEY,
});
type Prompt = {
  prompt: z.ZodString | string;
};

async function getHobbiesFromOpenai({ prompt }: Prompt) {
  const openai = new OpenAIApi(configuration);
  let answer: string | undefined | ChatCompletionResponseMessage = "";
  try {
    const chatGPT = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are helping this user to find a hobby, based on his answers to a series of questions. ",
        },
        { role: "user", content: prompt as unknown as string },
      ],
    });
    const chatGPTAnswer = chatGPT?.data?.choices[0]?.message;
    answer = chatGPTAnswer;
    let regex = /\d+\./; // matches any digit followed by a period
    let hobbiesArray = answer?.content?.split(regex).slice(1);
    return hobbiesArray;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error getting hobbies from OpenAI",
    });
  }
}
export const hobbiesRouter = createTRPCRouter({
  post: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const hobbies = await getHobbiesFromOpenai({ prompt: input.prompt });
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          hobbies: {
            create: hobbies?.map((hobby) => {
              return {
                content: hobby,
              };
            }),
          },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const hobbies = await ctx.prisma.hobby.findMany({
      where: { userId: ctx.session.user.id },
    });
    return hobbies;
  }),
});
