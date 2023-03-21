// display hobbies saved to the db according to id
import prisma from "../../../lib/prismadb";
import HobbyCard from "./HobbyCard";

const HobbiesPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const hobbies = await prisma.hobby.findMany({
    where: {
      userId: id,
    },
  });
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl">Hobbies Page</h1>
      <ul className="grid auto-cols-max place-content-center  gap-4 sm:grid-cols-3">
        {hobbies.map((hobby) => {
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
