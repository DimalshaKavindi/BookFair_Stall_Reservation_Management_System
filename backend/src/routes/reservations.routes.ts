import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { body, param } from "express-validator";
import { createReservation, getUserReservations, getAllReservations, cancelReservation, updateGenres} from "../controllers/reservations.controller";
import { validate } from "../middleware/validate";
import { employeeOnly } from "../middleware/roles";

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

r.get("/",
  authRequired, employeeOnly,
  getAllReservations
);

r.delete("/:id",
  authRequired,
  param("id").isInt(),
  validate,
  cancelReservation
);

r.patch("/:id/genres",
  authRequired,
  param("id").isInt(),
  body("genres").isArray({ min: 0 }),
  validate,
  updateGenres
);




export default r;
