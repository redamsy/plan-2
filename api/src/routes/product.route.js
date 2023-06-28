import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import productController from "../controllers/product.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";
import { productModel, imageModel, vendorModel } from "../models/user.model.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  productController.getProducts
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("itemCode")
    .exists().withMessage("itemCode is required")
    .isLength({ min: 8, max: 50 }).withMessage("itemCode minimum 8 and maximun 50 characters")
    .custom(async value => {
      const product = await productModel.findOne({ itemCode: value });
      if (product) return Promise.reject("itemCode already used");
    }),
  body("title")
    .exists().withMessage("Product title is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product title can not be empty (min: 1, max: 50)"),
  body("description")
    .exists().withMessage("Product description is required")
    .isLength({ min: 1, max: 255 }).withMessage("Product description can not be empty (min: 1, max: 255)"),
  body("imageId")
    .exists().withMessage("Product imageId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 50)")
    .custom(async value => {//check if image exist
      const image = await imageModel.exists({ _id: value });
      if (!image) return Promise.reject("imageId does not exist in image table");
    }),
  body("vendorId")
    .exists().withMessage("Product vendorId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 255)")
    .custom(async value => {//check if vendor exist
      const vendor = await vendorModel.exists({ _id: value});
      if (!vendor) return Promise.reject("vendorId does not exist in vendor table");
    }),
  body('price')
    .exists().withMessage('Product price is required')
    .isNumeric().withMessage('Product price must be a valid number')
    .custom((value) => value >= 0).withMessage('Product price must be a non-negative number'),
  body('originalPrice')
    .optional()
    .isNumeric().withMessage('Product originalPrice must be a valid number')
    .custom((value) => value >= 0).withMessage('Product original price must be a non-negative number'),
  body("remaining")
    .exists().withMessage("Remaining quantity is required")
    .isInt({ min: 0, max: 9999 }).withMessage("Invalid remaining quantity"),
  body("pSCCs")
    .exists().withMessage("PSCCs array is required")
    .isArray().withMessage("PSCCs must be an array")
    .custom((value) => {
      if (!value.every((pSCC) => mongoose.Types.ObjectId.isValid(pSCC.categoryId) && mongoose.Types.ObjectId.isValid(pSCC.subCategoryId) && pSCC.categoryId.length > 0 && typeof pSCC.categoryId === "string" && pSCC.subCategoryId.length > 0 && typeof pSCC.subCategoryId === "string" )) {
        throw new Error("Each pSCC object must have categoryId and subCategoryId of type string");
      }
      return true;
    }),
  body("galleries")
    .optional()
    .isArray().withMessage("galleries must be an array")
    .custom((value) => {
      if (!value.every((gallery) => mongoose.Types.ObjectId.isValid(gallery.colorId) && mongoose.Types.ObjectId.isValid(gallery.sizeId) && mongoose.Types.ObjectId.isValid(gallery.imageId) && gallery.colorId.length > 0 && typeof gallery.colorId === "string" && gallery.sizeId.length > 0 && typeof gallery.sizeId === "string" && gallery.imageId.length > 0 && typeof gallery.imageId === "string" )) {
        throw new Error("Each gallery object must have coloId, sizeId and imageId of type string");
      }
      return true;
    }),
  requestHandler.validate,
  productController.create
);

router.put(
  "/:productId",
  tokenMiddleware.auth,
  body("itemCode")
    .exists().withMessage("itemCode is required")
    .isLength({ min: 8, max: 50 }).withMessage("itemCode minimum 8 and maximun 50 characters"),
  body("title")
    .exists().withMessage("Product title is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product title can not be empty (min: 1, max: 50)"),
  body("description")
    .exists().withMessage("Product description is required")
    .isLength({ min: 1, max: 255 }).withMessage("Product description can not be empty (min: 1, max: 255)"),
  body("imageId")
    .exists().withMessage("Product imageId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 50)")
    .custom(async value => {//check if image exist
      const image = await imageModel.exists({ _id: value});
      if (!image) return Promise.reject("imageId does not exist in image table");
    }),
  body("vendorId")
    .exists().withMessage("Product vendorId is required")
    .isLength({ min: 1, max: 50 }).withMessage("Product imageId can not be empty (min: 1, max: 255)")
    .custom(async value => {//check if vendor exist
      const vendor = await vendorModel.exists({ _id: value});
      if (!vendor) return Promise.reject("vendorId does not exist in vendor table");
    }),
  body('price')
    .exists().withMessage('Product price is required')
    .isNumeric().withMessage('Product price must be a valid number')
    .custom((value) => value >= 0).withMessage('Product price must be a non-negative number'),
  body('originalPrice')
    .optional()
    .isNumeric().withMessage('Product originalPrice must be a valid number')
    .custom((value) => value >= 0).withMessage('Product original price must be a non-negative number'),
  body("remaining")
    .exists().withMessage("Remaining quantity is required")
    .isInt({ min: 0, max: 9999 }).withMessage("Invalid remaining quantity"),
  body("pSCCs")
    .exists().withMessage("PSCCs array is required")
    .isArray().withMessage("PSCCs must be an array")
    .custom((value) => {
      if (!value.every((pSCC) => mongoose.Types.ObjectId.isValid(pSCC.categoryId) && mongoose.Types.ObjectId.isValid(pSCC.subCategoryId) && pSCC.categoryId.length > 0 && typeof pSCC.categoryId === "string" && pSCC.subCategoryId.length > 0 && typeof pSCC.subCategoryId === "string" )) {
        throw new Error("Each pSCC object must have categoryId and subCategoryId of type string");
      }
      return true;
    }),
  body("galleries")
    .optional()
    .isArray().withMessage("galleries must be an array")
    .custom((value) => {
      if (!value.every((gallery) => mongoose.Types.ObjectId.isValid(gallery.colorId) && mongoose.Types.ObjectId.isValid(gallery.sizeId) && mongoose.Types.ObjectId.isValid(gallery.imageId) && gallery.colorId.length > 0 && typeof gallery.colorId === "string" && gallery.sizeId.length > 0 && typeof gallery.sizeId === "string" && gallery.imageId.length > 0 && typeof gallery.imageId === "string" )) {
        throw new Error("Each gallery object must have colorId, sizeId and imageId of type string");
      }
      return true;
    }),
  requestHandler.validate,
  productController.update
);

router.delete(
  "/:productId",
  tokenMiddleware.auth,
  productController.remove
);

export default router;