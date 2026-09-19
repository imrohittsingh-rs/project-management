import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Full name must be between 3 and 100 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 100 })
      .withMessage("Password must be between 8 and 100 characters"),
  ];
};

const userLoginValidator = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 8, max: 100 })
      .withMessage("New password must be between 8 and 100 characters"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ];
};

const userResetPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 8, max: 100 })
      .withMessage("New password must be between 8 and 100 characters"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetPasswordValidator,
};
