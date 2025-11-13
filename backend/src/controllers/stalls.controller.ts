import { Request, Response } from "express";
import * as stallsService from "../services/stalls.service";

export async function getAll(_req: Request, res: Response) {
  const stalls = await stallsService.getAll();
  res.json({ success: true, stalls });
}


