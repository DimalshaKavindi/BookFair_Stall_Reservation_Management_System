import { Request, Response } from "express";
import * as reservationsService from "../services/reservations.service";

export async function createReservation(req: Request, res: Response) {

    const userId = (req as any).user.id as number;
    const { stallId } = req.body;
    const reservation = await reservationsService.create(userId, stallId);
    res.status(201).json({ success: true, reservation });
 
}

export async function getUserReservations(req: Request, res: Response) {
  const { userId } = req.params;
  const list = await reservationsService.getForUser(Number(userId));
  res.json({ success: true, reservations: list });
}

export async function getAllReservations(_req: Request, res: Response) {
  const list = await reservationsService.getAll();
  res.json({ success: true, reservations: list });
}

export async function cancelReservation(req: Request, res: Response) {
  const id = Number(req.params.id);
  const userId = (req as any).user.id as number;
  const ok = await reservationsService.cancel(id, userId);
  res.json({ success: ok });
}

export async function updateGenres(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { genres } = req.body as { genres: string[] };
  const reservation = await reservationsService.setGenres(id, genres);
  res.json({ success: true, reservation });
}




