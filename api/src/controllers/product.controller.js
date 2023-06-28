import mongoose from "mongoose";
import responseHandler from "../handlers/response.handler.js";
import { productModel, categoryModel, subCategoryModel, pSCCModel, galleryModel, colorModel, sizeModel, imageModel } from "../models/user.model.js";

const checkGalleriesExistence = async(res, galleries) => {
  const colorIds = galleries.map((gallery) => gallery.colorId);
  const sizeIds = galleries.map((gallery) => gallery.sizeId);
  const imageIds = galleries.map((gallery) => gallery.imageId);

  // Fetch all colors, sizes and images in a single query
  const colors = await colorModel.find({ _id: { $in: colorIds } }).lean();
  const sizes = await sizeModel.find({ _id: { $in: sizeIds } }).lean();
  const images = await imageModel.find({ _id: { $in: imageIds } }).lean();

  const colorMap = colors.reduce((map, color) => {
    map[color._id.toString()] = color;
    return map;
  }, {});

  const sizeMap = sizes.reduce((map, size) => {
    map[size._id.toString()] = size;
    return map;
  }, {});

  const imageMap = images.reduce((map, image) => {
    map[image._id.toString()] = image;
    return map;
  }, {});

  for (const gallery of galleries) {
    const { colorId, sizeId, imageId } = gallery;
    const color = colorMap[colorId];
    if (!color) {
      return "Field colorId doesn't match data in color table";
    }

    const size = sizeMap[sizeId];
    if (!size) {
      return "Field sizeId doesn't match data in size table"
    }

    const image = imageMap[imageId];
    if (!image) {
      return "Field imageId doesn't match data in image table";
    }
  }
  return null;
}

const checkPSCCsExistence = async(res, pSCCs) => {
  const categoryIds = pSCCs.map((pSCC) => pSCC.categoryId);
  const subCategoryIds = pSCCs.map((pSCC) => pSCC.subCategoryId);

  // Fetch all categories and subcategories in a single query
  const categories = await categoryModel.find({ _id: { $in: categoryIds } }).lean();
  const subCategories = await subCategoryModel.find({ _id: { $in: subCategoryIds } }).lean();

  const categoryMap = categories.reduce((map, category) => {
    map[category._id.toString()] = category;
    return map;
  }, {});

  const subCategoryMap = subCategories.reduce((map, subCategory) => {
    map[subCategory._id.toString()] = subCategory;
    return map;
  }, {});

  for (const pSCC of pSCCs) {
    const { categoryId, subCategoryId } = pSCC;
    const category = categoryMap[categoryId];
    if (!category) {
      return "Field categoryId doesn't match data in category table";
    }

    const subCategory = subCategoryMap[subCategoryId];
    if (!subCategory) {
      return "Field subCategoryId doesn't match data in subCategory table"
    }
  }
  return null;
}

const checkPSCCsDuplicates = async(res, pSCCs) => {
  const duplicatePSCCs = pSCCs.filter(
    (pSCC, index) =>
      pSCCs.findIndex(
        (r) =>
          r.categoryId === pSCC.categoryId &&
          r.subCategoryId === pSCC.subCategoryId &&
          index !== pSCCs.indexOf(r)
      ) !== -1
  );

  if (duplicatePSCCs.length > 0) {
    return true;
  }
  return false
}

const checkGalleriesDuplicates = async(res, galleries) => {
  const duplicateGalleries = galleries.filter(
    (gallery, index) =>
      galleries.findIndex(
        (r) =>
          r.colorId === gallery.colorId &&
          r.sizeId === gallery.sizeId &&
          r.imageId === gallery.imageId &&
          index !== galleries.indexOf(r)
      ) !== -1
  );

  if (duplicateGalleries.length > 0) {
    return true;
  }
  return false
}

// const pSCCs = [{categoryId: 1, subCategoryId: 1}]
const create = async (req, res) => {
  try {
    const { itemCode, title, description, vendorId, imageId, price, originalPrice, remaining, pSCCs, galleries } = req.body;

    //check for pSCCs duplicates here
    const isDuplicate1 = await checkPSCCsDuplicates(res, pSCCs)
    if(isDuplicate1) {
      return responseHandler.badrequest(
        res,
        "Duplicate entries found in the pSCCs array"
      );
    }
  
    if(galleries){
      //check for galleries duplicates here
      const isDuplicate2 = await checkGalleriesDuplicates(res, galleries)
      if(isDuplicate2) {
        return responseHandler.badrequest(
          res,
          "Duplicate entries found in the galleries array"
        );
      }
    }

    // check that all categories and subCategories exist in their respective tables
    const existenceError1 = await checkPSCCsExistence(res, pSCCs)
    if(existenceError1) {
      return responseHandler.badrequest(
        res,
        existenceError1
      );
    }
    if(galleries){
      // check that all colors, sizes and image exist in their respective tables
      const existenceError2 = await checkGalleriesExistence(res, galleries)
      if(existenceError2) {
        return responseHandler.badrequest(
          res,
          existenceError2
        );
      }
    }

    const product = new productModel({
      itemCode, title, description, vendorId, imageId, price, originalPrice, remaining,
    });

    await product.save();

    //add batch to pSCC table
    try {
      await pSCCModel.insertMany(
        pSCCs.map((pSCC) => ({
          productId: product.id,
          categoryId: pSCC.categoryId,
          subCategoryId: pSCC.subCategoryId,
        }))
      );      
    } catch (error) {
      // Handle the error when inserting PSCCs
      // Rollback or perform necessary actions
    //TODO: solve delete many incase error(currently old data are lost)
      await pSCCModel.deleteMany({ productId: product.id });
      if(product) {
        await product.deleteOne();
      }
      console.log("productController: create: Error while inserting pSCCs:", error);
      throw error; // Rethrow the error to be handled by the catch block below
    }
    if(galleries){
      //add batch to galleries table
      try {
        await galleryModel.insertMany(
          galleries.map((gallery) => ({
            itemSubCode: gallery.itemSubCode,
            subPrice: gallery.subPrice,
            subOriginalPrice: gallery.subOriginalPrice,
            productId: product.id,
            colorId: gallery.colorId,
            sizeId: gallery.sizeId,
            imageId: gallery.imageId,
          }))
        );      
      } catch (error) {
        // Handle the error when inserting galleries
        // Rollback or perform necessary actions
      //TODO: solve delete many incase error(currently old data are lost)
        await galleryModel.deleteMany({ productId: product.id });
        if(product) {
          await product.deleteOne();
        }
        console.log("productController: create: Error while inserting galleries:", error);
        throw error; // Rethrow the error to be handled by the catch block below
      }
    }  

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
    const { itemCode, title, description, vendorId, imageId, price, originalPrice, remaining, pSCCs, galleries } = req.body;
  
    const product = await productModel.findById(productId).select("itemCode description vendorId imageId price originalPrice remaining id title categoryId createdAt updatedAt");
    if (!product) return responseHandler.notfound(res);

    // check for duplicates here
    const isDuplicate1 = await checkPSCCsDuplicates(res, pSCCs)
    if(isDuplicate1) {
      return responseHandler.badrequest(
        res,
        "Duplicate entries found in the pSCCs array"
      );
    }
  
    if(galleries){
      // check for duplicates here
      const isDuplicate2 = await checkGalleriesDuplicates(res, galleries)
      if(isDuplicate2) {
        return responseHandler.badrequest(
          res,
          "Duplicate entries found in the galleries array"
        );
      }
    }

    // check that all categories and subCategories exist in their respective tables
    const existenceError1 = await checkPSCCsExistence(res, pSCCs)
    if(existenceError1) {
      return responseHandler.badrequest(
        res,
        existenceError1
      );
    }

    if(galleries){
      // check that all colors, sizes and image exist in their respective tables
      const existenceError2 = await checkGalleriesExistence(res, galleries)
      if(existenceError2) {
        return responseHandler.badrequest(
          res,
          existenceError2
        );
      }
    }

    product.itemCode = itemCode;
    product.title = title;
    product.description = description;
    product.imageId = imageId;
    product.vendorId = vendorId;
    product.price = price;
    product.originalPrice = originalPrice;
    product.remaining = remaining;

    await product.save();
  
    // add batch to pSCC table
    //TODO: solve delete many incase error(currently old data are lost)
    await pSCCModel.deleteMany({ productId: product.id });
    try {
      await pSCCModel.insertMany(
        pSCCs.map((pSCC) => ({
          productId: product.id,
          categoryId: pSCC.categoryId,
          subCategoryId: pSCC.subCategoryId,
        }))
      );      
    } catch (error) {
      // Handle the error when inserting PSCCs
      // Rollback or perform necessary actions
    //TODO: solve delete many incase error(currently old data are lost)
      await pSCCModel.deleteMany({ productId: product.id });
      console.log("productController: update: Error while inserting pSCCs:", error);
      throw error; // Rethrow the error to be handled by the catch block below
      
    }
   
    if(galleries){
      //add batch to galleries table
      //TODO: solve delete many incase error(currently old data are lost)
      await galleryModel.deleteMany({ productId: product.id });
      try {
        await galleryModel.insertMany(
          galleries.map((gallery) => ({
            itemSubCode: gallery.itemSubCode,
            subPrice: gallery.subPrice,
            subOriginalPrice: gallery.subOriginalPrice,
            productId: product.id,
            colorId: gallery.colorId,
            sizeId: gallery.sizeId,
            imageId: gallery.imageId,
          }))
        );      
      } catch (error) {
        // Handle the error when inserting galleries
        // Rollback or perform necessary actions
      //TODO: solve delete many incase error(currently old data are lost)
        await galleryModel.deleteMany({ productId: product.id });
        console.log("productController: update: Error while inserting galleries:", error);
        throw error; // Rethrow the error to be handled by the catch block below
      } 
    }
  
    //return with pSCCs and galleries
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

    await pSCCModel.deleteMany({ productId });
    await galleryModel.deleteMany({ productId });

    await product.deleteOne();

    return responseHandler.ok(res);
  } catch(error) {
    console.log("productController: error", error);
    return responseHandler.error(res);
  }
};

const getPSCCs = async (req, res) => {
  try {
    const pSCCs = await pSCCModel.find().sort("-createdAt");

    return responseHandler.ok(res, pSCCs);
  } catch (error) {
    console.log("productController: error", error);
    return responseHandler.error(res);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        $lookup: {
          from: "psccs",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productId", "$$productId"],
                },
                // $or: [
                //   { subCategoryId: { $exists: false } },
                //   { subCategoryId: null },
                // ],
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategory",
              },
            },
            {
              $project: {
                category: { $arrayElemAt: ["$category", 0] },
                subCategory: { $arrayElemAt: ["$subCategory", 0] },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                category: {
                  id: "$category._id",
                  name: "$category.name",
                  createdAt: "$category.createdAt",
                  updatedAt: "$category.updatedAt",
                },
                subCategory: {
                  id: "$subCategory._id",
                  name: "$subCategory.name",
                  createdAt: "$subCategory.createdAt",
                  updatedAt: "$subCategory.updatedAt",
                },
              },
            },
          ],
          as: "pSCC",
        },
      },
      {
        $lookup: {
          from: "galleries",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productId", "$$productId"],
                },
                // $or: [
                //   { subCategoryId: { $exists: false } },
                //   { subCategoryId: null },
                // ],
              },
            },
            {
              $lookup: {
                from: "colors",
                localField: "colorId",
                foreignField: "_id",
                as: "color",
              },
            },
            {
              $lookup: {
                from: "sizes",
                localField: "sizeId",
                foreignField: "_id",
                as: "size",
              },
            },
            {
              $lookup: {
                from: "images",
                localField: "imageId",
                foreignField: "_id",
                as: "image",
              },
            },
            {
              $project: {
                itemSubCode: 1,
                subPrice: 1,
                subOriginalPrice: 1,
                color: { $arrayElemAt: ["$color", 0] },
                size: { $arrayElemAt: ["$size", 0] },
                image: { $arrayElemAt: ["$image", 0] },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                itemSubCode: 1,
                subPrice: 1,
                subOriginalPrice: 1,
                color: {
                  id: "$color._id",
                  name: "$color.name",
                  colorCode: "$color.colorCode",
                  createdAt: "$color.createdAt",
                  updatedAt: "$color.updatedAt",
                },
                size: {
                  id: "$size._id",
                  name: "$size.name",
                  createdAt: "$size.createdAt",
                  updatedAt: "$size.updatedAt",
                },
                image: {
                  id: "$image._id",
                  name: "$image.name",
                  url: "$image.url",
                  createdAt: "$image.createdAt",
                  updatedAt: "$image.updatedAt",
                },
              },
            },
          ],
          as: "gallery",
        },
      },
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
        $lookup: {
          from: "vendors",
          let: { vendorId: "$vendorId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$vendorId"],
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
          as: "vendor",
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
          vendor: {
            $arrayElemAt: ["$vendor", 0],
          },
          price: 1,
          originalPrice: 1,
          remaining: 1,
          createdAt: 1,
          updatedAt: 1,
          pSCCs: "$pSCC",
          galleries: "$gallery",
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
          from: "psccs",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productId", "$$productId"],
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategory",
              },
            },
            {
              $project: {
                category: { $arrayElemAt: ["$category", 0] },
                subCategory: { $arrayElemAt: ["$subCategory", 0] },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                category: {
                  id: "$category._id",
                  name: "$category.name",
                  createdAt: "$category.createdAt",
                  updatedAt: "$category.updatedAt",
                },
                subCategory: {
                  id: "$subCategory._id",
                  name: "$subCategory.name",
                  createdAt: "$subCategory.createdAt",
                  updatedAt: "$subCategory.updatedAt",
                },
              },
            },
          ],
          as: "pSCC",
        },
      },
      {
        $lookup: {
          from: "galleries",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productId", "$$productId"],
                },
                // $or: [
                //   { subCategoryId: { $exists: false } },
                //   { subCategoryId: null },
                // ],
              },
            },
            {
              $lookup: {
                from: "colors",
                localField: "colorId",
                foreignField: "_id",
                as: "color",
              },
            },
            {
              $lookup: {
                from: "sizes",
                localField: "sizeId",
                foreignField: "_id",
                as: "size",
              },
            },
            {
              $lookup: {
                from: "images",
                localField: "imageId",
                foreignField: "_id",
                as: "image",
              },
            },
            {
              $project: {
                itemSubCode: 1,
                subPrice: 1,
                subOriginalPrice: 1,
                color: { $arrayElemAt: ["$color", 0] },
                size: { $arrayElemAt: ["$size", 0] },
                image: { $arrayElemAt: ["$image", 0] },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                itemSubCode: 1,
                subPrice: 1,
                subOriginalPrice: 1,
                color: {
                  id: "$color._id",
                  name: "$color.name",
                  colorCode: "$color.colorCode",
                  createdAt: "$color.createdAt",
                  updatedAt: "$color.updatedAt",
                },
                size: {
                  id: "$size._id",
                  name: "$size.name",
                  createdAt: "$size.createdAt",
                  updatedAt: "$size.updatedAt",
                },
                image: {
                  id: "$image._id",
                  name: "$image.name",
                  url: "$image.url",
                  createdAt: "$image.createdAt",
                  updatedAt: "$image.updatedAt",
                },
              },
            },
          ],
          as: "gallery",
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
        $lookup: {
          from: "vendors",
          let: { vendorId: "$vendorId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$vendorId"],
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
          as: "vendor",
        },
      },
      {
        $project: {
          id: "$_id",
          itemCode: 1,
          title: 1,
          description: 1,
          vendor: {
            $arrayElemAt: ["$vendor", 0],
          },
          image: {
            $arrayElemAt: ["$image", 0],
          },
          price: 1,
          originalPrice: 1,
          remaining: 1,
          createdAt: 1,
          updatedAt: 1,
          pSCCs: "$pSCC",
          galleries: "$gallery",
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