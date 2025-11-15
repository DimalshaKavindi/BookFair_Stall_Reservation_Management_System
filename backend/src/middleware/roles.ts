import { NextFunction, Request, Response } from "express";
export function employeeOnly(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user?.role !== "EMPLOYEE")
    return res.status(403).json({ success: false, message: "Forbidden" });
  next();
}
