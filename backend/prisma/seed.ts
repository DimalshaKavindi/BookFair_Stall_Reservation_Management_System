import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@bookfair.lk" },
    update: {},
    create: {
      email: "admin@bookfair.lk",
      password: adminPass,
      businessName: "Bookfair Admin",
      contactPerson: "System Admin",
      phone: "011-0000000",
      address: "BMICH",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin seeded: admin@bookfair.lk / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });