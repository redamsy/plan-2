import express from "express";
import { body } from "express-validator";
import categoryController from "../controllers/category.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/images/",
  tokenMiddleware.auth,
  categoryController.getImages
);

router.post(
  "/images/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("image name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  body("url")
    .exists().withMessage("image url is required")
    .isLength({ min: 1, max: 150 }).withMessage("image url can not be empty (min: 1, max: 150)"),
  requestHandler.validate,
  categoryController.createImage
);

router.put(
  "/images/:imageId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("image name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  body("url")
    .exists().withMessage("image url is required")
    .isLength({ min: 1, max: 150 }).withMessage("image url can not be empty (min: 1, max: 150)"),
  requestHandler.validate,
  categoryController.updateImage
);

router.delete(
  "/images/:imageId",
  tokenMiddleware.auth,
  categoryController.removeImage
);

export default router;