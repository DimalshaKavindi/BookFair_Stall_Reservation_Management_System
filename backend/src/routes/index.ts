import { Router } from "express";
import authRoutes from "./auth.routes";
import stallsRoutes from "./stalls.routes";
import reservationsRoutes from "./reservations.routes";
import usersRoutes from "./users.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/stalls", stallsRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/users", usersRoutes);

export default router;
