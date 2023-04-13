import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { z } from "zod";
import {
  Configuration,
  OpenAIApi,
  type ChatCompletionResponseMessage,
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
interface Hobby {
  title: string;
  description: string;
}

interface HobbiesResponse {
  hobbies: Hobby[];
}
function extractHobbies(response?: ChatCompletionResponseMessage): Hobby[] {
  if (!response) {
    return [];
  }

  const content = response.content;
  const startIndex = content.indexOf("{");

  const endIndex = content.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const hobbiesString = content.slice(startIndex, endIndex + 1);

  try {
    const hobbiesResponse = JSON.parse(hobbiesString) as HobbiesResponse;
    return hobbiesResponse.hobbies;
  } catch (e) {
    return [];
  }
}
async function getHobbiesFromOpenai({ prompt }: Prompt) {
  const openai = new OpenAIApi(configuration);
  try {
    const chatGPT = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are helping this user to find a hobby, based on his answers to a series of questions. return a javascript object with the hobbies property containing an array of objects that all have a title property and a description property. ",
        },
        { role: "user", content: prompt as unknown as string },
      ],
    });
    const chatGPTAnswer = chatGPT?.data?.choices[0]?.message;
    const answer = extractHobbies(chatGPTAnswer);
    return answer;
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
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          hobbies: {
            create: hobbies?.map((hobby) => {
              return {
                title: hobby.title,
                description: hobby.description,
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
  getAllByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hobbies = await ctx.prisma.hobby.findMany({
        where: { userId: input.userId },
      });
      return hobbies;
    }),
});
