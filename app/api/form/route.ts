import { NextResponse } from "next/server";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Hobby } from "@prisma/client";
type Prompt = {
  prompt: string;
};
console.log(process.env.OPENAPI_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAPI_KEY,
});
const openai = new OpenAIApi(configuration);
export async function POST(request: Request) {
  const { prompt } = await request.json();
  const session = await getServerSession(authOptions);

  let answer: string | undefined | ChatCompletionResponseMessage = "";
  console.log("🚀 ~ file: route.ts:8 ~ POST ~ res:", prompt);
  try {
    const chatGPT = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are helping this user to find a hobby, based on his answers to a series of questions. ",
        },
        { role: "user", content: prompt },
      ],
    });
    const chatGPTAnswer = chatGPT.data.choices[0].message;
    answer = chatGPTAnswer;
    let regex = /\d+\./; // matches any digit followed by a period
    let hobbiesArray = answer?.content?.split(regex).slice(1);

    const user = await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        hobbies: {
          create: hobbiesArray?.map((hobby) => {
            return {
              content: hobby,
            };
          }),
        },
      },
    });
    console.log("🚀 ~ file: route.ts:54 ~ POST ~ user:", user);
    console.log("🚀 ~ file: route.ts:8 ~ POST ~ answer:", answer);
  } catch (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ answer });
}
