import mongoose from "mongoose";
import responseHandler from "../handlers/response.handler.js";
import { productModel } from "../models/user.model.js";

const create = async (req, res) => {
  try {
    const { itemCode, title, description, vendorId, imageId, price, originalPrice, remaining } = req.body;

    const product = new productModel({
      itemCode, title, description, vendorId, imageId, price, originalPrice, remaining,
    });

    await product.save(); 

    //return with pSCCs and galleries
    const detailedProduct = await getDetailedProductById(req, res, product.id)
    return responseHandler.created(res, {
      ...detailedProduct
    });
  } catch(error) {
    console.log("productController: create: error", error);
    return responseHandler.error(res);
  }
};

const update = async (req, res) => {
  try {
    const { productId } = req.params;
    const { itemCode, title, description, vendorId, imageId, price, originalPrice, remaining } = req.body;
  
    const product = await productModel.findById(productId).select("itemCode description vendorId imageId price originalPrice remaining id title categoryId createdAt updatedAt");
    if (!product) return responseHandler.notfound(res);

    product.itemCode = itemCode;
    product.title = title;
    product.description = description;
    product.imageId = imageId;
    product.vendorId = vendorId;
    product.price = price;
    product.originalPrice = originalPrice;
    product.remaining = remaining;

    await product.save();

    const detailedProduct = await getDetailedProductById(req, res, product.id)
    return responseHandler.ok(res, {
      ...detailedProduct
    });
  } catch(error) {
    console.log("productController: update: error", error);
    return responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  console.log("productController: remove: req.params", req.params)
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
    });

    if (!product) return responseHandler.notfound(res);

    await product.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("productController: error", error);
    return responseHandler.error(res);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        $sort: {
          title: 1, // Sort by title field in ascending order
        },
      },
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
          itemCode: 1,
          title: 1,
          description: 1,
          image: {
            $arrayElemAt: ["$image", 0],
          },
          price: 1,
          originalPrice: 1,
          remaining: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return responseHandler.ok(res, products);
  } catch (error) {
    console.log("productController: getProducts: error", error);
    return responseHandler.error(res);
  }
};

const getDetailedProductById = async (req, res, productId) => {
  try {
    const product = await productModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId)
        }
      },
      
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
          itemCode: 1,
          title: 1,
          description: 1,
          image: {
            $arrayElemAt: ["$image", 0],
          },
          price: 1,
          originalPrice: 1,
          remaining: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return product[0];
  } catch (error) {
    console.log("productController: getDetailedProductById: error", error);
    return
  }
};

export default { create, update, remove, getProducts };