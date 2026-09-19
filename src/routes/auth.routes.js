import { Router } from "express";
import {
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
} from "../controllers/auth.contollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, handleUserRegister);
router.post("/login", userLoginValidator(), validate, handleUserLogin);

// secured routes
router.post("/logout", verifyJWT, handleUserLogout);

export default router;
