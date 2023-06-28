import responseHandler from "../handlers/response.handler.js";
import {productModel, categoryModel, subCategoryModel, vendorModel, imageModel, sizeModel, colorModel, galleryModel, pSCCModel} from "../models/user.model.js";


const createCategory = async (req, res) => {
  try {
    const category = new categoryModel({
      ...req.body
    });

    await category.save();

    //TODO: return with image url
    return responseHandler.created(res, {
      ...category._doc,
      id: category.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, imageId } = req.body;

    const category = await categoryModel.findById(categoryId).select("id name imageId");

    if (!category) return responseHandler.notfound(res);

    category.name = name;
    category.imageId = imageId;

    await category.save();

    //TODO: return with image url
    const isUsedInpSCC = await pSCCModel.exists({ categoryId: category._id });
    return responseHandler.ok(res, {
      ...category._doc,
      id: category.id,
      isDeletable: isUsedInpSCC ? false: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeCategory = async (req, res) => {
  console.log("categoryController: remove: req.params", req.params)
  try {
    const { categoryId } = req.params;

    const category = await categoryModel.findOne({
      _id: categoryId,
    });
    if (!category) return responseHandler.notfound(res);

    const isUsedInpSCC = await pSCCModel.exists({ categoryId: category._id });
    if (isUsedInpSCC) {
      // category is used by a pSCC, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "category is currently in use and cannot be deleted");
    }

    await category.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.aggregate([
      {
        $lookup: {
          from: "images",
          let: { imageId: "$imageId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$imageId"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                name: 1,
                url: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "image",
        },
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          image: {
            $arrayElemAt: ["$image", 0],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    // Get all distinct categories (type of ObjectId) used by pSCCs
    const pSCCCategoryObjectIds = await pSCCModel.distinct("categoryId");
    // Combine the category IDs from and pSCCs
    const usedCategoryIds = pSCCCategoryObjectIds.map(String);
    // Iterate through each category and check if it is in the usedCategoryIds array
    const categoriesWithDeletability = categories.map((category) => ({
      ...category,
      isDeletable: !usedCategoryIds.includes(category._id.toString()),
    }));

    return responseHandler.ok(res, categoriesWithDeletability);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};
//////////////////////////////////////////////////////////////////////////////////////
const createSubCategory = async (req, res) => {
  try {
    const subCategory = new subCategoryModel({
      ...req.body
    });

    await subCategory.save();

    return responseHandler.created(res, {
      ...subCategory._doc,
      id: subCategory.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("subCategoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const { name } = req.body;

    const subCategory = await subCategoryModel.findById(subCategoryId).select("id name");

    if (!subCategory) return responseHandler.notfound(res);

    subCategory.name = name;

    await subCategory.save();

    const isUsedInpSCC = await pSCCModel.exists({ subCategoryId: subCategory._id });
    return responseHandler.ok(res, {
      ...subCategory._doc,
      id: subCategory.id,
      isDeletable: isUsedInpSCC ? false: true,
    });
  } catch(error) {
    console.log("subCategoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeSubCategory = async (req, res) => {
  console.log("subCategoryController: remove: req.params", req.params)
  try {
    const { subCategoryId } = req.params;

    const subCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
    });
    if (!subCategory) return responseHandler.notfound(res);

    const isUsedInpSCC = await pSCCModel.exists({ subCategoryId: subCategory._id });
    if (isUsedInpSCC) {
      // subCategory is used by a pSCC, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "subCategory is currently in use and cannot be deleted");
    }

    await subCategory.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("subCategoryController: error", error);
    return responseHandler.error(res);
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryModel.find().sort("-createdAt");

    // Get all distinct subCategories (type of ObjectId) used by pSCCs
    const pSCCSubCategoryObjectIds = await pSCCModel.distinct("subCategoryId");
    // Combine the subCategory IDs from and pSCCs
    const usedSubCategoryIds = pSCCSubCategoryObjectIds.map(String);
    // Iterate through each subCategory and check if it is in the usedCategoryIds array
    const subCategoriesWithDeletability = subCategories.map((subCategory) => ({
      ...subCategory.toObject(),
      isDeletable: !usedSubCategoryIds.includes(subCategory._id.toString()),
    }));

    return responseHandler.ok(res, subCategoriesWithDeletability);
  } catch(error) {
    console.log("subCategoryController: error", error);
    return responseHandler.error(res);
  }
};
//////////////////////////////////////////////////////////////////////////////////////
const createColor = async (req, res) => {
  try {
    const color = new colorModel({
      ...req.body
    });

    await color.save();

    return responseHandler.created(res, {
      ...color._doc,
      id: color.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const { name, colorCode } = req.body;

    const color = await colorModel.findById(colorId).select("id name colorCode");

    if (!color) return responseHandler.notfound(res);

    color.name = name;
    color.colorCode = colorCode;

    await color.save();

    const isUsedInGallery = await galleryModel.exists({ colorId: color._id });
    return responseHandler.ok(res, {
      ...color._doc,
      id: color.id,
      isDeletable: isUsedInGallery ? false: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeColor = async (req, res) => {
  console.log("categoryController: remove: req.params", req.params)
  try {
    const { colorId } = req.params;

    const color = await colorModel.findOne({
      _id: colorId,
    });
    if (!color) return responseHandler.notfound(res);

    const isUsedInGallery = await galleryModel.exists({ colorId: color._id });
    if (isUsedInGallery) {
      // color is used by a gallery, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "color is currently in use and cannot be deleted");
    }

    await color.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const getColors = async (req, res) => {
  try {
    const colors = await colorModel.find().sort("-createdAt");

    // Get all distinct colors (type of ObjectId) used by galleries
    const galleryColorObjectIds = await galleryModel.distinct("colorId");

    // Combine the color IDs from and galleries
    const usedColorIds = galleryColorObjectIds.map(String);

    // Iterate through each color and check if it is in the usedColorIds array
    const colorsWithDeletability = colors.map((color) => ({
      ...color.toObject(),
      isDeletable: !usedColorIds.includes(color._id.toString()),
    }));

    return responseHandler.ok(res, colorsWithDeletability);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};
//////////////////////////////////////////////////////////////////////////////////////
const createSize = async (req, res) => {
  try {
    const size = new sizeModel({
      ...req.body
    });

    await size.save();

    return responseHandler.created(res, {
      ...size._doc,
      id: size.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateSize = async (req, res) => {
  try {
    const { sizeId } = req.params;
    const { name } = req.body;

    const size = await sizeModel.findById(sizeId).select("id name");

    if (!size) return responseHandler.notfound(res);

    size.name = name;

    await size.save();

    const isUsedInGallery = await galleryModel.exists({ sizeId: size._id });
    return responseHandler.ok(res, {
      ...size._doc,
      id: size.id,
      isDeletable: isUsedInGallery ? false: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeSize = async (req, res) => {
  console.log("categoryController: remove: req.params", req.params)
  try {
    const { sizeId } = req.params;

    const size = await sizeModel.findOne({
      _id: sizeId,
    });
    if (!size) return responseHandler.notfound(res);

    const isUsedInGallery = await galleryModel.exists({ sizeId: size._id });
    if (isUsedInGallery) {
      // Size is used by a gallery, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "Size is currently in use and cannot be deleted");
    }

    await size.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const getSizes = async (req, res) => {
  try {
    const sizes = await sizeModel.find().sort("-createdAt");

    // Get all distinct sizes (type of ObjectId) used by galleries
    const gallerySizeObjectIds = await galleryModel.distinct("sizeId");

    // Combine the size IDs from and galleries
    const usedSizeIds = gallerySizeObjectIds.map(String);

    // Iterate through each size and check if it is in the usedSizeIds array
    const sizesWithDeletability = sizes.map((size) => ({
      ...size.toObject(),
      isDeletable: !usedSizeIds.includes(size._id.toString()),
    }));

    return responseHandler.ok(res, sizesWithDeletability);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};
//////////////////////////////////////////////////////////////////////////////////////
const createImage = async (req, res) => {
  try {
    const image = new imageModel({
      ...req.body
    });

    await image.save();

    return responseHandler.created(res, {
      ...image._doc,
      id: image.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { name, url } = req.body;

    const image = await imageModel.findById(imageId).select("id name url");

    if (!image) return responseHandler.notfound(res);

    image.name = name;
    image.url = url;

    await image.save();

    const isUsedInProduct = await productModel.exists({ imageId: image._id });
    const isUsedInGallery = await galleryModel.exists({ imageId: image._id });
    return responseHandler.ok(res, {
      ...image._doc,
      id: image.id,
      isDeletable: isUsedInProduct || isUsedInGallery ? false: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeImage = async (req, res) => {
  console.log("categoryController: remove: req.params", req.params)
  try {
    const { imageId } = req.params;

    const image = await imageModel.findOne({
      _id: imageId,
    });
    if (!image) return responseHandler.notfound(res);

    const isUsedInProduct = await productModel.exists({ imageId: image._id });
    const isUsedInGallery = await galleryModel.exists({ imageId: image._id });
    if (isUsedInProduct || isUsedInGallery) {
      // Image is used by a product or gallery, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "Image is currently in use and cannot be deleted");
    }

    await image.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const getImages = async (req, res) => {
  try {
    const images = await imageModel.find().sort("-createdAt");

    // Get all distinct images (type of ObjectId) used by products
    const productImageObjectIds = await productModel.distinct("imageId");

    // Get all distinct images (type of ObjectId) used by galleries
    const galleryImageObjectIds = await galleryModel.distinct("imageId");

    // Combine the image IDs from both products and galleries
    const usedImageIds = [...productImageObjectIds.map(String), ...galleryImageObjectIds.map(String)];

    // Iterate through each image and check if it is in the usedImageIds array
    const imagesWithDeletability = images.map((image) => ({
      ...image.toObject(),
      isDeletable: !usedImageIds.includes(image._id.toString()),
    }));

    return responseHandler.ok(res, imagesWithDeletability);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};
//////////////////////////////////////////////////////////////////////////////////////
const createVendor = async (req, res) => {
  try {
    const vendor = new vendorModel({
      ...req.body
    });

    await vendor.save();

    return responseHandler.created(res, {
      ...vendor._doc,
      id: vendor.id,
      isDeletable: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { name } = req.body;

    const vendor = await vendorModel.findById(vendorId).select("id name");

    if (!vendor) return responseHandler.notfound(res);

    vendor.name = name;

    await vendor.save();

    const isUsedInProduct = await productModel.exists({ vendorId: vendor._id });
    return responseHandler.ok(res, {
      ...vendor._doc,
      id: vendor.id,
      isDeletable: isUsedInProduct ? false: true,
    });
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const removeVendor = async (req, res) => {
  console.log("categoryController: remove: req.params", req.params)
  try {
    const { vendorId } = req.params;

    const vendor = await vendorModel.findOne({
      _id: vendorId,
    });
    if (!vendor) return responseHandler.notfound(res);

    const isUsedInProduct = await productModel.exists({ vendorId: vendor._id });
    if (isUsedInProduct) {
      // Vendor is used by a product, handle accordingly
      // For example, you can return an error response or prevent deletion
      return responseHandler.badrequest(res, "Vendor is currently in use and cannot be deleted");
    }

    await vendor.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find().sort("-createdAt");

    // Get all distinct vendors (type of ObjectId) used by products
    const productVendorObjectIds = await productModel.distinct("vendorId");

    // Get all distinct vendors (type of ObjectId) used by galleries
    const galleryVendorObjectIds = await galleryModel.distinct("vendorId");

    // Combine the vendor IDs from both products and galleries
    const usedVendorIds = [...productVendorObjectIds.map(String), ...galleryVendorObjectIds.map(String)];

    // Iterate through each vendor and check if it is in the usedVendorIds array
    const vendorsWithDeletability = vendors.map((vendor) => ({
      ...vendor.toObject(),
      isDeletable: !usedVendorIds.includes(vendor._id.toString()),
    }));

    return responseHandler.ok(res, vendorsWithDeletability);
  } catch(error) {
    console.log("categoryController: error", error);
    return responseHandler.error(res);
  }
};

export default {
  createCategory,
  updateCategory,
  removeCategory,
  getCategories,
  /////
  createSubCategory,
  updateSubCategory,
  removeSubCategory,
  getSubCategories,
  /////
  createSize,
  updateSize,
  removeSize,
  getSizes,
  ////
  createColor,
  updateColor,
  removeColor,
  getColors,
  ////
  createImage,
  updateImage,
  removeImage,
  getImages,
  ////
  createVendor,
  updateVendor,
  removeVendor,
  getVendors,
};
