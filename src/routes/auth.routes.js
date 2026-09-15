import { Router } from "express";
import { handleUserRegister } from "../controllers/auth.contollers.js";

const router = Router();

router.post("/register", handleUserRegister);

export default router;
