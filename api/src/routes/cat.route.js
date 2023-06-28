import express from "express";
import { body } from "express-validator";
import categoryController from "../controllers/category.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";
import { imageModel } from "../models/user.model.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/categories/",
  categoryController.getCategories
);

router.post(
  "/categories/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("Category name is required")
    .isLength({ min: 1, max: 50 }).withMessage("Category name can not be empty (min: 1, max: 50)"),
  body("imageId")
    .exists().withMessage("Product imageId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 50)")
    .custom(async value => {//check if image exist
      const image = await imageModel.exists({ _id: value });
      if (!image) return Promise.reject("imageId does not exist in image table");
    }),
  requestHandler.validate,
  categoryController.createCategory
);

router.put(
  "/categories/:categoryId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("Category name is required")
    .isLength({ min: 1, max: 50 }).withMessage("Category name can not be empty (min: 1, max: 50)"),
  body("imageId")
    .exists().withMessage("Product imageId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 50)")
    .custom(async value => {//check if image exist
      const image = await imageModel.exists({ _id: value });
      if (!image) return Promise.reject("imageId does not exist in image table");
    }),
  requestHandler.validate,
  categoryController.updateCategory
);

router.delete(
  "/categories/:categoryId",
  tokenMiddleware.auth,
  categoryController.removeCategory
);
/////////////////////////////////////////////////////////////////////////
router.get(
  "/subCategories/",
  tokenMiddleware.auth,
  categoryController.getSubCategories
);

router.post(
  "/subCategories/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("SubCategory name is required")
    .isLength({ min: 1, max: 50 }).withMessage("SubCategory name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.createSubCategory
);

router.put(
  "/subCategories/:subCategoryId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("SubCategory name is required")
    .isLength({ min: 1, max: 50 }).withMessage("SubCategory name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.updateSubCategory
);

router.delete(
  "/subCategories/:subCategoryId",
  tokenMiddleware.auth,
  categoryController.removeSubCategory
);
/////////////////////////////////////////////////////////////////////////
router.get(
  "/colors/",
  tokenMiddleware.auth,
  categoryController.getColors
);

router.post(
  "/colors/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("color name is required")
    .isLength({ min: 1, max: 50 }).withMessage("color name can not be empty (min: 1, max: 50)"),
  body("colorCode")
    .exists().withMessage("color Code is required")
    .isLength({ min: 1, max: 50 }).withMessage("color Code can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.createColor
);

router.put(
  "/colors/:colorId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("color name is required")
    .isLength({ min: 1, max: 50 }).withMessage("color name can not be empty (min: 1, max: 50)"),
  body("colorCode")
    .exists().withMessage("color Code is required")
    .isLength({ min: 1, max: 50 }).withMessage("color Code can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.updateColor
);

router.delete(
  "/colors/:colorId",
  tokenMiddleware.auth,
  categoryController.removeColor
);
/////////////////////////////////////////////////////////////////////////
router.get(
  "/sizes/",
  tokenMiddleware.auth,
  categoryController.getSizes
);

router.post(
  "/sizes/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("size name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.createSize
);

router.put(
  "/sizes/:sizeId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("size name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.updateSize
);

router.delete(
  "/sizes/:sizeId",
  tokenMiddleware.auth,
  categoryController.removeSize
);
/////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////
router.get(
  "/vendors/",
  tokenMiddleware.auth,
  categoryController.getVendors
);

router.post(
  "/vendors/",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("vendor name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.createVendor
);

router.put(
  "/vendors/:vendorId",
  tokenMiddleware.auth,
  body("name")
    .exists().withMessage("vendor name is required")
    .isLength({ min: 1, max: 50 }).withMessage("size name can not be empty (min: 1, max: 50)"),
  requestHandler.validate,
  categoryController.updateVendor
);

router.delete(
  "/vendors/:vendorId",
  tokenMiddleware.auth,
  categoryController.removeVendor
);
export default router;