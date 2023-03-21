//api route to update the user hobbies

import { NextApiResponse, NextApiRequest } from "next";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";

export async function PATCH(req: NextApiRequest) {
  const session = await getServerSession();
  const res = NextResponse;
  if (!session) {
    res.json({ error: "Not authenticated" });
  }
  const { hobbies } = req.body;
  const user = await prisma.user.update({
    where: { id: session?.user?.id },
    data: { hobbies },
  });
  return res.json(user);
}
