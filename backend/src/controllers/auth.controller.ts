import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const user = await authService.registerVendor(req.body);
  res.status(201).json({ success: true, user });
}

export async function loginVendor(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password, "VENDOR");
  res.json({ success: true, ...result });
}

export async function loginEmployee(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password, "EMPLOYEE");
  res.json({ success: true, ...result });
}

export async function verify(_req: Request, res: Response) {
  res.json({ success: true });
}
