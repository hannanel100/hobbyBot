import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Loader from "~/components/Loader";

export const Greeting = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="mx-4 flex flex-col gap-8 sm:mx-auto md:max-w-2xl">
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
      {status === "authenticated" ? (
        <Button onClick={() => void router.push("/form")}>Start</Button>
      ) : status === "loading" ? (
        <Button disabled>
          <Loader size="sm" />
        </Button>
      ) : (
        <Button onClick={() => void signIn("google")}>Sign in</Button>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <main>
      {/* a form, that has 20 questions, each with 4 options to choose.  */}
      {/* explain what this app does, click start to start answering the questions */}
      {/* when you click start, the first question will appear */}
      <Greeting />
    </main>
  );
}
