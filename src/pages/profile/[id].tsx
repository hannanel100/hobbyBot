// display hobbies saved to the db according to id
import Link from "next/link";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import Loader from "~/components/Loader";
import { ssgHelper } from "~/server/helpers/ssgHelper";

const ProfilePage: NextPage<{ id: string }> = ({ id }) => {
  const { data: user } = api.user.getBySession.useQuery();
  const { data: hobbies, isError, isLoading } = api.hobbies.getAll.useQuery();
  if (isLoading)
    return (
      <div className="grid h-full place-content-center overflow-hidden">
        <Loader size="lg" />
      </div>
    );
  if (isError) return <p>Error</p>;
  return (
    <div className="mx-auto md:max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">Profile Page</h1>
      <p>Hi {user?.name}! we are happy you`ve decided to join our community!</p>
      <p>
        {hobbies.length === 0
          ? "You currently have no hobbies! you can add some here:"
          : `You currently have ${hobbies.length} hobbies! you can check them out here: `}
        <Link
          href={"/hobbies/" + user?.id}
          className="cursor-pointer underline hover:underline sm:no-underline"
        >
          Hobbies
        </Link>
      </p>
      <p>This page is still a work in progress...</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = ssgHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.hobbies.getAll.prefetch();
  await ssg.user.getBySession.prefetch();
  console.log("ssg", ssg);
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

export default ProfilePage;
