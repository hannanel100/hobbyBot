// display hobbies saved to the db according to id
import type { GetStaticProps } from "next";
import { ssgHelper } from "~/server/helpers/ssgHelper";

import { useRouter } from "next/router";
import { useState } from "react";
import Loader from "~/components/Loader";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";
import { type Hobby } from "@prisma/client";

type HobbyCardProps = {
  data: Hobby;
};
const HobbyCard = ({ data }: HobbyCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="rounded-lg border border-teal-700 p-4 shadow-xl">
        <h2
          className="mb-2 cursor-pointer text-2xl font-bold hover:underline"
          onClick={() => setIsOpen(true)}
        >
          {data.title}
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          {data.createdAt.toLocaleDateString()}
        </p>
        <p className="mb-4 first-letter:capitalize">
          {data.description.substring(0, 50)}...
        </p>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-teal-900 bg-opacity-50 dark:bg-teal-50 dark:bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div className=" mx-4 flex flex-col rounded-lg bg-teal-50 p-4 shadow-xl dark:bg-teal-900 md:mx-8 md:max-w-xl lg:mx-auto">
            <h2 className="mb-2 text-2xl font-bold">{data.title}</h2>
            <p className="mb-4 text-sm text-gray-400">
              {data.createdAt.toLocaleDateString()}
            </p>
            <p className="mb-4 first-letter:capitalize">{data.description}</p>
            <button
              className="tex cursor-pointer self-center rounded-lg bg-teal-500 px-4 py-2 text-white"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
const HobbiesPage = () => {
  const router = useRouter();
  console.log(router.query);
  const { data: hobbies, isLoading, isError } = api.hobbies.getAll.useQuery();
  const localUrlForShare = `http://localhost:3000/hobbies/share/${
    router.query.id as string
  }`;
  console.log(
    "🚀 ~ file: [id].tsx:64 ~ HobbiesPage ~ localUrlForShare:",
    localUrlForShare
  );
  const urlForShare = `${env.NEXT_PUBLIC_BASE_URL}/hobbies/share/${
    router.query.id as string
  }`;
  if (isLoading) return <Loader size="lg" />;
  if (isError) void router.push("/error");

  return (
    <div className="mx-8 flex flex-col gap-8 sm:mx-auto md:max-w-2xl">
      <div className="flex justify-between">
        <h1 className="text-2xl sm:text-3xl">Hobbies Page</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">Share your hobbies! </span>
          <WhatsappShareButton
            url={localUrlForShare}
            title={
              "Check out my hobbies I got from HobbyBot🤖, an Ai powered app to find you your next hobby"
            }
            separator="🏀🎸🎮🎹 🎻🎤 "
            blankTarget={true}
          >
            <WhatsappIcon size={20} round />
          </WhatsappShareButton>
          <FacebookShareButton
            url={localUrlForShare}
            quote={
              "Check out my hobbies I got from HobbyBot🤖, an Ai powered app to find you your next hobby"
            }
            hashtag="#hobbybot"
            blankTarget={true}
          >
            <FacebookIcon size={20} round />
          </FacebookShareButton>
          <LinkedinShareButton url={localUrlForShare} blankTarget={true}>
            <LinkedinIcon size={20} round />
          </LinkedinShareButton>
          <TwitterShareButton
            url={localUrlForShare}
            title={
              "Check out my hobbies I got from HobbyBot🤖, an Ai powered app to find you your next hobby"
            }
            hashtags={["hobbybot", "hobby"]}
            blankTarget={true}
          >
            <TwitterIcon size={20} round />
          </TwitterShareButton>
        </div>
      </div>
      <ul className="grid auto-cols-max place-content-center gap-4 sm:grid-cols-3">
        {hobbies?.map((hobby) => {
          return (
            <li key={hobby.id} className="flex gap-4">
              <HobbyCard data={hobby} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = ssgHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.hobbies.getAll.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default HobbiesPage;
