import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { body, param } from "express-validator";
import { createReservation, getUserReservations} from "../controllers/reservations.controller";
import { validate } from "../middleware/validate";

const r = Router();

r.post("/",
  authRequired,
  body("stallId").isInt(),
  validate,
  createReservation
);

r.get("/user/:userId",
  authRequired,
  param("userId").isInt(),
  validate,
  getUserReservations
);

export default r;
