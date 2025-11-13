import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw { status: 404, message: "User not found" };
  const { password, ...rest } = user;
  return rest;
}

