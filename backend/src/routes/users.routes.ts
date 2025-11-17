import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { getProfile, updateProfile } from "../controllers/users.controller";
import { body } from "express-validator";
import { validate } from "../middleware/validate";

const r = Router();
r.get("/profile", authRequired, getProfile);
r.put("/profile", authRequired,
  body("businessName").optional().notEmpty(),
  body("contactPerson").optional().notEmpty(),
  body("phone").optional().notEmpty(),
  body("address").optional().notEmpty(),
  validate,
  updateProfile
);
export default r;

