import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { body } from "express-validator";
import { createReservation} from "../controllers/reservations.controller";
import { validate } from "../middleware/validate";

const r = Router();

r.post("/",
  authRequired,
  body("stallId").isInt(),
  validate,
  createReservation
);

export default r;
