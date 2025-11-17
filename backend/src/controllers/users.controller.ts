import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export async function getProfile(req: Request, res: Response) {
  const userId = (req as any).user.id as number;
  const user = await usersService.getById(userId);
  res.json({ success: true, user });
}

export async function updateProfile(req: Request, res: Response) {
  const userId = (req as any).user.id as number;
  const user = await usersService.update(userId, req.body);
  res.json({ success: true, user });
}
