import { Router } from "express";
import { body } from "express-validator";
import { register, verify } from "../controllers/auth.controller";
import { authRequired } from "../middleware/auth";

const r = Router();

r.post("/register",
  body("businessName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("contactPerson").notEmpty(),
  body("phone").notEmpty(),
  body("address").notEmpty(),
  register
);

r.get("/verify", authRequired, verify);
export default r;

