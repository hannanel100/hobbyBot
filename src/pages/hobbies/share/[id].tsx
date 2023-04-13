// display hobbies saved to the db according to id
import type { GetStaticProps } from "next";
import { ssgHelper } from "~/server/helpers/ssgHelper";

import { useRouter } from "next/router";
import { useState } from "react";
import Loader from "~/components/Loader";
import { api } from "~/utils/api";
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
          {data.description?.substring(0, 50)}...
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
const ShareHobbiesPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const {
    data: hobbies,
    isLoading,
    isError,
  } = api.hobbies.getAllByUserId.useQuery({
    userId,
  });
  const { data: user } = api.user.getById.useQuery({ id: userId });
  if (isLoading) return <Loader size="lg" />;
  if (isError) void router.push("/error");

  return (
    <div className="mx-auto flex flex-col gap-8 md:max-w-2xl">
      <h1 className="text-2xl">{user?.name} shared his Hobbies with you!</h1>
      <ul className="grid auto-cols-max place-content-center  gap-4 sm:grid-cols-3">
        {hobbies?.map((hobby) => {
          // replace first : with - to separate title and content

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

export default ShareHobbiesPage;
