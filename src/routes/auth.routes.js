import { Router } from "express";
import {
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetPassword,
  changeCurrentPassword,
} from "../controllers/auth.contollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetPasswordValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured routes
router.post("/register", userRegisterValidator(), validate, handleUserRegister);
router.post("/login", userLoginValidator(), validate, handleUserLogin);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.post("/reset-password/:resetToken", userResetPasswordValidator(), validate, resetPassword);

// secured routes
router.post("/logout", verifyJWT, handleUserLogout);
router.post("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);
router.post("/resend-verification-email", verifyJWT, resendEmailVerification);

export default router;
