import { Router } from "express";
import { body } from "express-validator";
import { register, verify, loginVendor, loginEmployee  } from "../controllers/auth.controller";
import { authRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";

const r = Router();

r.post("/register",
  body("businessName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  body("contactPerson").notEmpty(),
  body("phone").notEmpty(),
  body("address").notEmpty(),
  validate,
  register
);

r.post("/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
  loginVendor
);

r.post("/employee/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
  loginEmployee
);


r.get("/verify", authRequired, verify);
export default r;
