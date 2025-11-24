// backend/src/routes/admin.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import { authRequired } from "../middleware/auth";
import { adminOnly } from "../middleware/roles";
import { validate } from "../middleware/validate";
import {
  createEmployee,
  createStall,
  listEmployees,
  listStalls
} from "../controllers/admin.controller";

const r = Router();
r.use(authRequired, adminOnly);

//Employees 

r.post(
  "/employees",
  body("businessName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("contactPerson").notEmpty(),
  body("phone").notEmpty(),
  body("address").notEmpty(),
  validate,
  createEmployee
);

r.get("/employees", listEmployees);

//Stalls

r.post(
  "/stalls",
  body("name").notEmpty(),
  body("size").isIn(["SMALL", "MEDIUM", "LARGE"]),
  body("dimensions").notEmpty(),
  body("location").notEmpty(),
  body("positionX").isInt(),
  body("positionY").isInt(),
  body("isAvailable").optional().isBoolean(),
  validate,
  createStall
);

r.get("/stalls", listStalls);


export default r;
