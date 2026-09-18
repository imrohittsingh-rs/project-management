import { Router } from "express";
import { handleUserRegister } from "../controllers/auth.contollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, handleUserRegister);

export default router;
