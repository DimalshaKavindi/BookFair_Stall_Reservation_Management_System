import { Request, Response } from "express";
import * as stallsService from "../services/stalls.service";

export async function getAll(_req: Request, res: Response) {
  const stalls = await stallsService.getAll();
  res.json({ success: true, stalls });
}

export async function getAvailable(_req: Request, res: Response) {
  const stalls = await stallsService.getAvailable();
  res.json({ success: true, stalls });
}

export async function getOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  const stall = await stallsService.getOne(id);
  res.json({ success: true, stall });
}

export async function updateOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await stallsService.update(id, req.body);
  res.json({ success: true, stall: updated });
}
