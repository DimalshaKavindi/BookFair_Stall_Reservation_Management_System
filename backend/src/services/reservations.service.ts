import { PrismaClient } from "@prisma/client";
import { sendReservationEmail } from "../utils/email";
import { generateAndUploadQr } from "../utils/qr";

const prisma = new PrismaClient();
const MAX_STALLS_PER_USER = 3;

export async function create(userId: number, stallId: number) {
  const stall = await prisma.stall.findUnique({ where: { id: stallId } });
  if (!stall || !stall.isAvailable) throw { status: 400, message: "Stall not available" };

  const count = await prisma.reservation.count({
    where: { userId, status: "ACTIVE" }
  });
  if (count >= MAX_STALLS_PER_USER) {
    throw { status: 400, message: "You have reached the maximum of 3 active stalls" };
  }

  // Transaction only for database operations
  const reservation = await prisma.$transaction(async (tx) => {
    const updatedStall = await tx.stall.update({
      where: { id: stallId },
      data: { isAvailable: false }
    });
    const created = await tx.reservation.create({
      data: { userId, stallId: updatedStall.id }
    });
    return { created, updatedStall };
  });

  // Generate QR and update reservation outside transaction
  const qrUrl = await generateAndUploadQr({
    reservationId: reservation.created.id,
    userId,
    stallName: reservation.updatedStall.name
  });

  const withQr = await prisma.reservation.update({
    where: { id: reservation.created.id },
    data: { qrCodeUrl: qrUrl }
  });

  // Send email outside transaction
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await sendReservationEmail({
      to: user.email,
      businessName: user.businessName,
      stallName: reservation.updatedStall.name,
      qrUrl
    });
  }

  return withQr;
}

export function getForUser(userId: number) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { stall: true },
    orderBy: { id: "desc" }
  });
}
