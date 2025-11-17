import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw { status: 404, message: "User not found" };
  const { password, ...rest } = user;
  return rest;
}

export async function update(id: number, data: Partial<{
  businessName: string; contactPerson: string; phone: string; address: string;
}>) {
  const user = await prisma.user.update({ where: { id }, data });
  const { password, ...rest } = user;
  return rest;
}


