import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function getAll() {
  return prisma.stall.findMany({ orderBy: { id: "asc" } });
}

export function getAvailable() {
  return prisma.stall.findMany({ where: { isAvailable: true }, orderBy: { id: "asc" } });
}

export async function getOne(id: number) {
  const stall = await prisma.stall.findUnique({ where: { id } });
  if (!stall) throw { status: 404, message: "Stall not found" };
  return stall;
}

export async function update(id: number, data: any) {
  await getOne(id);
  return prisma.stall.update({ where: { id }, data });
}
