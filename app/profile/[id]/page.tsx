// display hobbies saved to the db according to id
import Link from "next/link";
import prisma from "../../../lib/prismadb";
const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const hobbies = await prisma.hobby.findMany({
    where: {
      userId: id,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p>Hi {user?.name}, we are happy you`ve decided to join our community!</p>
      <p>
        You currently have {hobbies.length} hobbies! you can check them out
        here:{" "}
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

export default ProfilePage;
