import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import {userModel} from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("userName")
    .exists().withMessage("Username is required")
    .isLength({ min: 8, max: 50 }).withMessage("Username minimum 8 and maximun 50 characters")
    .custom(async value => {
      const user = await userModel.findOne({ userName: value });
      if (user) return Promise.reject("Username already used");
    }),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8, max: 50 }).withMessage("password minimum 8 and maximun 50 characters"),
  body("confirmPassword")
    .exists().withMessage("confirmPassword is required")
    .isLength({ min: 8, max: 50 }).withMessage("confirmPassword minimum 8 and maximun 50 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("confirmPassword not match");
      return true;
    }),
  body("name")
    .exists().withMessage("name is required")
    .isLength({ min: 8, max: 50 }).withMessage("name minimum 8 and maximun 50 characters"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("userName")
    .exists().withMessage("Username is required")
    .isLength({ min: 8, max: 50 }).withMessage("Username minimum 8 and maximun 50 characters"),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8, max: 50 }).withMessage("password minimum 8 and maximun 50 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8, max: 50 }).withMessage("password minimum 8 and maximun 50 characters"),
  body("newPassword")
    .exists().withMessage("newPassword is required")
    .isLength({ min: 8, max: 50 }).withMessage("newPassword minimum 8 and maximun 50 characters"),
  body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword is required")
    .isLength({ min: 8, max: 50 }).withMessage("confirmNewPassword minimum 8 and maximun 50 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get(
  "/self",
  tokenMiddleware.auth,
  userController.getInfo
);
////////////////////////////////////////////////////////////////
router.put(
  "/currency",
  tokenMiddleware.auth,
  body('rate')
    .exists().withMessage('Rate is required')
    .isNumeric().withMessage('Rate must be a valid number')
    .custom((value) => value >= 0).withMessage('Rate must be a non-negative number'),
  body("currency")
    .exists().withMessage("Currency is required")
    .isLength({ min: 1, max: 50 }).withMessage("Currency can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  userController.updateCurrency
);

export default router;