import responseHandler from "../handlers/response.handler.js";
import {productModel, imageModel} from "../models/user.model.js";

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
    return responseHandler.ok(res, {
      ...image._doc,
      id: image.id,
      isDeletable: isUsedInProduct ? false: true,
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
    if (isUsedInProduct) {
      // Image is used by a product, handle accordingly
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

    // Combine the image IDs from both products and galleries
    const usedImageIds = [...productImageObjectIds.map(String)];

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

export default {
  createImage,
  updateImage,
  removeImage,
  getImages,
};
