import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function getAll() {
  return prisma.stall.findMany({ orderBy: { id: "asc" } });
}


