import { Router } from "express";
import {
  handleUserRegister,
  handleUserLogin,
} from "../controllers/auth.contollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, handleUserRegister);
router.post("/login", userLoginValidator(), validate, handleUserLogin);

export default router;
