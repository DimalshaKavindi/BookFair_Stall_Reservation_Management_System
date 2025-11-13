import { Router } from "express";
import authRoutes from "./auth.routes";
import stallsRoutes from "./stalls.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/stalls", stallsRoutes);

export default router;
