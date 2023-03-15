"use client";
import { useRouter } from "next/navigation";

import Title from "./Title";

export const Greeting = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-xl">
        The app is designed to help users discover new hobbies and interests
        that suit their preferences and personalities. It uses artificial
        intelligence (AI) to analyze the users answers to a series of questions
        and recommend hobbies that match their interests and lifestyle. The AI
        algorithms take into account the users answers, previous hobbies, and
        provide personalized recommendations. Ultimately, the goal of the app is
        to help users find fulfilling and enjoyable hobbies that enrich their
        lives and provide a source of relaxation, creativity, and social
        engagement.
      </p>
      <button
        className="mx-auto flex justify-center rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => router.push("/form")}
      >
        Start
      </button>
    </div>
  );
};