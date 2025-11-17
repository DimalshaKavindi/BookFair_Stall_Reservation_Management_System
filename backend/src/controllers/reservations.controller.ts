import { Request, Response } from "express";
import * as reservationsService from "../services/reservations.service";

export async function createReservation(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id as number;
    const { stallId } = req.body;
    const reservation = await reservationsService.create(userId, stallId);
    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ success: false, message: "Failed to create reservation" });
  }
}
