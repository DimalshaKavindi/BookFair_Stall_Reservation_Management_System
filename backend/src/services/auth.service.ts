import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";

const prisma = new PrismaClient();

export async function registerVendor(data: {
  email: string; password: string; businessName: string;
  contactPerson: string; phone: string; address: string;
}) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw { status: 409, message: "Email already registered" };
const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, password: hashed, role: "VENDOR" }
  });
  return sanitize(user);
}

function sanitize(u: any) {
  const { password, ...rest } = u;
  return rest;
}
