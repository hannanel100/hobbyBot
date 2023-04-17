import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { questions as data } from "./data";
// this function should seed the Question and Option tables with the data from data.ts
async function main() {
  for (const question of data) {
    await prisma.question.create({
      data: {
        question: question.question,
        options: {
          create: question.options.map((option) => {
            return {
              option: option,
            };
          }),
        },
      },
    });
  }
}

main()
  .then(async () => {
    console.log("Seeding complete");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
