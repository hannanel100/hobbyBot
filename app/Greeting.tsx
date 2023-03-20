"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Button from "./Button";
import Card from "./Card";

import Title from "./Title";

export const Greeting = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <p className="text-center text-xl">
          The app is designed to help users discover new hobbies and interests
          that suit their preferences and personalities. It uses artificial
          intelligence (AI) to analyze the users answers to a series of
          questions and recommend hobbies that match their interests and
          lifestyle. The AI algorithms take into account the users answers,
          previous hobbies, and provide personalized recommendations.
          Ultimately, the goal of the app is to help users find fulfilling and
          enjoyable hobbies that enrich their lives and provide a source of
          relaxation, creativity, and social engagement.
        </p>
      </Card>
      <Button onClick={() => router.push("/form")}>Start</Button>
    </div>
  );
};
