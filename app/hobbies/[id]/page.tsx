// display hobbies saved to the db according to id
import prisma from "../../../lib/prismadb";
import Hobby from "./Hobby";

const HobbiesPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const hobbies = await prisma.hobby.findMany({
    where: {
      userId: id,
    },
  });
  console.log("🚀 ~ file: page.tsx:10 ~ HobbiesPage ~ hobbies:", hobbies);
  return (
    <div className="border border-solid border-teal-50">
      <h1 className="text-3xl">Hobbies Page</h1>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id} className="flex gap-4">
            <Hobby hobby={hobby.content} />
            <span>Updated at: {hobby.createdAt.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HobbiesPage;
