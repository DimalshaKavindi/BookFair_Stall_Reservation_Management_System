import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { getAll, getAvailable, getOne, updateOne } from "../controllers/stalls.controller";
import { body, param } from "express-validator";
import { validate } from "../middleware/validate";
import { employeeOnly } from "../middleware/roles";

const r = Router();

// Authenticated Users
r.get("/", authRequired, getAll);
r.get("/available", authRequired, getAvailable);
r.get("/:id", authRequired, param("id").isInt(), validate, getOne);

// Employee Only
r.put("/:id", authRequired, employeeOnly,
  param("id").isInt(),
  body("isAvailable").optional().isBoolean(),
  body("name").optional().notEmpty(),
  body("size").optional().isIn(["SMALL","MEDIUM","LARGE"]),
  validate,
  updateOne
);

export default r;
