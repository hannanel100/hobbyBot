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

function extractHobbies(response?: ChatCompletionResponseMessage): Hobby[] {
  const hobbies: Hobby[] = [];
  if (!response) {
    return [];
  }
  // split the response by newlines - each line is a hobby
  const hobbiesArray = response.content.split("\n");
  // remove empty lines
  hobbiesArray.map((hobby) => {
    const tempHobbyArray = hobby.split("-");
    // if the title includes a number followed by a period in the beginning, remove it, also trimming whitespace.
    let title: string | undefined;
    let description: string | undefined;
    if (tempHobbyArray.length > 0) {
      title = tempHobbyArray?.[0];
      description = tempHobbyArray?.[1]?.trim();
      if (title?.includes(".")) {
        title = title.split(".")[1]?.trim();
      } else {
      }
    }

    const hobbyObject: Hobby = {
      title: title ? title : "",
      description: description ? description : "",
    };
    // if the title and description are not empty, add the hobby to the hobbies array.
    if (hobbyObject.title && hobbyObject.description) {
      hobbies.push(hobbyObject);
    }
  });
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
            "you are helping this user to find a hobby, based on his answers to a series of questions. each hobby idea should be numbered and have a title followed by a - and a description. here is an example: 1. hiking - hiking is a great way to get outside and enjoy nature. 2. pottery - pottery is a great way to express your creativity. etc. ",
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
