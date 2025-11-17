import { Router } from "express";
import authRoutes from "./auth.routes";
import stallsRoutes from "./stalls.routes";
import reservationsRoutes from "./reservations.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/stalls", stallsRoutes);
router.use("/reservations", reservationsRoutes);

export default router;
