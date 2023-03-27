// display hobbies saved to the db according to id
import Router, { useRouter } from "next/router";
import { useState } from "react";
import Loader from "~/components/Loader";
import { api } from "~/utils/api";
type HobbyCardProps = {
  data: {
    title?: string;
    content?: string;
    date?: string;
  };
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
        <p className="mb-4 text-sm text-gray-500">{data.date}</p>
        <p className="mb-4 first-letter:capitalize">
          {data.content?.substring(0, 50)}...
        </p>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-teal-900 bg-opacity-50 dark:bg-teal-50 dark:bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div className=" mx-4 flex flex-col rounded-lg bg-teal-50 p-4 shadow-xl dark:bg-teal-900 md:mx-8 md:max-w-xl lg:mx-auto">
            <h2 className="mb-2 text-2xl font-bold">{data.title}</h2>
            <p className="mb-4 text-sm text-gray-500">{data.date}</p>
            <p className="mb-4 first-letter:capitalize">{data.content}</p>
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
const HobbiesPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: hobbies, isLoading, isError } = api.hobbies.getAll.useQuery();
  if (isLoading) return <Loader size="lg" />;
  if (isError) router.push("/error");

  return (
    <div className="mx-auto flex flex-col gap-8 md:max-w-2xl">
      <h1 className="text-3xl">Hobbies Page</h1>
      <ul className="grid auto-cols-max place-content-center  gap-4 sm:grid-cols-3">
        {hobbies?.map((hobby) => {
          const data = {
            title: hobby.content.split("-")[0],
            content: hobby.content.split("-")[1],
            date: hobby.createdAt.toLocaleString(),
          };

          return (
            <li key={hobby.id} className="flex gap-4">
              <HobbyCard data={data} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HobbiesPage;
