import { PrismaClient } from "@prisma/client";
import { sendReservationEmail,sendCancellationEmail } from "../utils/email";
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

  
  const reservation = await prisma.$transaction(async (tx) => {
    const existingCanceled = await tx.reservation.findFirst({
      where: { userId, stallId, status: "CANCELLED" }
    });

    if (existingCanceled) {
      await tx.stall.update({
        where: { id: stallId },
        data: { isAvailable: false }
      });

      const updatedReservation = await tx.reservation.update({
        where: { id: existingCanceled.id },
        data: { status: "ACTIVE" }
      });

      return { created: updatedReservation, updatedStall: stall };
    } else {
      const updatedStall = await tx.stall.update({
        where: { id: stallId },
        data: { isAvailable: false }
      });
      const created = await tx.reservation.create({
        data: { userId, stallId: updatedStall.id }
      });
      return { created, updatedStall };
    }
  });


  const qrUrl = await generateAndUploadQr({
    reservationId: reservation.created.id,
    userId,
    stallName: reservation.updatedStall.name
  });

  const withQr = await prisma.reservation.update({
    where: { id: reservation.created.id },
    data: { qrCodeUrl: qrUrl }
  });


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

export function getAll() {
  return prisma.reservation.findMany({
    include: { stall: true, user: { select: { id: true, businessName: true, email: true,phone:true,contactPerson:true } } },
    orderBy: { id: "desc" }
  });
}

export async function cancel(id: number, userId: number) {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) throw { status: 404, message: "Reservation not found" };
  if (existing.userId !== userId) throw { status: 403, message: "Forbidden" };
  if (existing.status === "CANCELLED") return true;
  
  await prisma.$transaction(async (tx) => {
    await tx.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
    await tx.stall.update({ where: { id: existing.stallId }, data: { isAvailable: true } });
  });

  // Send cancellation email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await sendCancellationEmail({
      to: user.email,
      businessName: user.businessName,
      stallName: (await prisma.stall.findUnique({ where: { id: existing.stallId } }))?.name || ""
    });
  }
  
  return true;
}

export async function setGenres(id: number, genres: string[]) {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) throw { status: 404, message: "Reservation not found" };
  return prisma.reservation.update({ where: { id }, data: { literaryGenres: genres } });
}



