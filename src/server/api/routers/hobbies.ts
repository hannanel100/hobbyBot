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
  //  the response should contain a content property with a string that has a title followed by a - then a description.
  //  return a hobbies array with the type of Hobby[]
  //  the hobbies array should have the following structure:
  //  [
  //    {
  //      title: "hobby title",
  //      description: "hobby description",
  //
  //    },
  //  ]
  const hobbies: Hobby[] = [];
  if (!response) {
    return [];
  }
  const hobbyArray = response.content.split("\r");
  hobbyArray.forEach((hobby) => {
    const hobbyArray = hobby.split("-");
    console.log(
      "🚀 ~ file: hobbies.ts:48 ~ hobbyArray.forEach ~ hobbyArray:",
      hobbyArray
    );
    const hobbyObject: Hobby = {
      title: hobbyArray[0] ? hobbyArray[0] : "no title",
      description: hobbyArray[1] ? hobbyArray[1] : "no description",
    };
    hobbies.push(hobbyObject);
  });
  console.log(
    "🚀 ~ file: hobbies.ts:57 ~ hobbyArray.forEach ~ hobbies:",
    hobbies
  );
  return hobbies;
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
            "you are helping this user to find a hobby, based on his answers to a series of questions. each hobby idea should have a title followed by a - and a description. ",
        },
        { role: "user", content: prompt as unknown as string },
      ],
    });
    const chatGPTAnswer = chatGPT?.data?.choices[0]?.message;
    const answer = extractHobbies(chatGPTAnswer);
    console.log(
      "🚀 ~ file: hobbies.ts:73 ~ getHobbiesFromOpenai ~ answer:",
      answer
    );
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
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedHobby = await ctx.prisma.hobby.delete({
        where: { id: input.id },
      });
      return deletedHobby;
    }),
});
