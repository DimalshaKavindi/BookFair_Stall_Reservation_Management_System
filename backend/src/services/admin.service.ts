import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type EmployeeInput = {
  email: string;
  password: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
};

export async function createEmployee(data: EmployeeInput) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw { status: 409, message: "Email already registered" };

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      businessName: data.businessName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      address: data.address,
      role: "EMPLOYEE",
    },
  });

  const { password, ...rest } = user;
  return rest;
}

export function listEmployees() {
  return prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: {
      id: true,
      email: true,
      businessName: true,
      contactPerson: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

type StallInput = {
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  dimensions: string;
  location: string;
  positionX: number;
  positionY: number;
  isAvailable?: boolean;
};

export async function createStall(data: StallInput) {
  const stall = await prisma.stall.create({
    data: {
      name: data.name,
      size: data.size,
      dimensions: data.dimensions,
      location: data.location,
      positionX: data.positionX,
      positionY: data.positionY,
      isAvailable: data.isAvailable ?? true,
    },
  });

  return stall;
}

export function listStalls() {
  return prisma.stall.findMany({
    orderBy: { id: "asc" },
  });
}






