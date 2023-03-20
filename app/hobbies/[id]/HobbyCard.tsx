"use client";
import { useState } from "react";
type Props = {
  data: {
    title: string;
    content: string;
    date: string;
  };
};

const HobbyCard = ({ data }: Props) => {
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
        <p className="mb-4">{data.content.substring(0, 50)}...</p>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-teal-900 bg-opacity-50 dark:bg-teal-50 dark:bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div className=" mx-4 flex flex-col rounded-lg bg-teal-50 p-4 shadow-xl dark:bg-teal-900 md:mx-8 md:max-w-xl lg:mx-auto">
            <h2 className="mb-2 text-2xl font-bold">{data.title}</h2>
            <p className="mb-4 text-sm text-gray-500">{data.date}</p>
            <p className="mb-4">{data.content}</p>
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

export default HobbyCard;
