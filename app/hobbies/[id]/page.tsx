// display hobbies saved to the db according to id
import prisma from "../../../lib/prismadb";
const HobbiesPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const hobbies = await prisma.hobby.findMany({
    where: {
      userId: id,
    },
  });
  return (
    <div>
      <h1>Hobbies Page</h1>
      <p>id: {id}</p>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id}>{hobby.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default HobbiesPage;
