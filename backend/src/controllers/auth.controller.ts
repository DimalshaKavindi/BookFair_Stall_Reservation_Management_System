import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const user = await authService.registerVendor(req.body);
  res.status(201).json({ success: true, user });
}

export async function verify(_req: Request, res: Response) {
  res.json({ success: true });
}
