import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(422).json({ success: false, message: "Validation error", details: result.array() });
}
