import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Employee account
  const empPass = await bcrypt.hash("employee123", 10);
  await prisma.user.upsert({
    where: { email: "organizer@bookfair.lk" },
    update: {},
    create: {
      email: "organizer@bookfair.lk",
      password: empPass,
      businessName: "Organizer",
      contactPerson: "Organizer",
      phone: "011-1234567",
      address: "BMICH",
      role: "EMPLOYEE"
    }
  });

  // Vendor demo
  const vendPass = await bcrypt.hash("vendor123", 10);
  await prisma.user.upsert({
    where: { email: "publisher@example.com" },
    update: {},
    create: {
      email: "publisher@example.com",
      password: vendPass,
      businessName: "Galaxy Books",
      contactPerson: "Ishara",
      phone: "077-0000000",
      address: "Colombo 7",
      role: "VENDOR"
    }
  });

  // Stalls A..Z (mix sizes) with simple grid positions
  const sizes = ["SMALL","MEDIUM","LARGE"] as const;
  const stalls = Array.from({ length: 26 }).map((_, i) => {
    const name = String.fromCharCode(65 + i); // A-Z
    const size = sizes[i % sizes.length];
    return {
      name,
      size,
      dimensions: size === "SMALL" ? "2x2m" : size === "MEDIUM" ? "3x3m" : "4x3m",
      location: "BMICH Hall A",
      isAvailable: true,
      positionX: (i % 13) * 40 + 20, // px for map
      positionY: Math.floor(i / 13) * 60 + 20
    };
  });

  for (const s of stalls) {
    await prisma.stall.upsert({ where: { name: s.name }, update: s, create: s });
  }
}

main()
  .then(async () => {
    console.log("Seed complete");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
