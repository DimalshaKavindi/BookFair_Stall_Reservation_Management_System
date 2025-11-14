import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || undefined
  });
}
