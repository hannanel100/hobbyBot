import { NextResponse } from "next/server";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";
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
    console.log("🚀 ~ file: route.ts:28 ~ POST ~ chatGPT:", chatGPT);
    const chatGPTAnswer = chatGPT.data.choices[0].message;
    answer = chatGPTAnswer;
    console.log("🚀 ~ file: route.ts:8 ~ POST ~ answer:", answer);
  } catch (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ answer });
}
