import Card from "../../Card";
import prisma from "../../../lib/prismadb";

interface Props {
  params: {
    id: string;
  };
}

const Answer = async ({ params }: Props) => {
  const { id } = params;
  const latestTimeStamp = await prisma.hobby.findFirst({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });
  console.log(
    "🚀 ~ file: page.tsx:23 ~ Answer ~ latestTimeStamp:",
    latestTimeStamp
  );
  const hobbies = await prisma.hobby.findMany({
    where: {
      userId: id,
      // createdAt is the last date
      createdAt: latestTimeStamp?.createdAt,
    },
  });
  console.log("🚀 ~ file: page.tsx:30 ~ Answer ~ hobbies:", hobbies);
  return (
    <div className="container mx-auto my-4 space-y-4">
      <Card>
        {/* split content by bullets, if chars 1. 2. 3. 4. exist */}
        {hobbies.map((hobby, index) => {
          return (
            <p key={index} className="mb-4">
              {`${index + 1}.  ${hobby.content}`}
            </p>
          );
        })}
      </Card>
    </div>
  );
};

export default Answer;
