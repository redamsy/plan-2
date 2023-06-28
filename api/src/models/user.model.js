import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const modelOptions = {
  toJSON: {
    virtuals: true,
    transform: (_, obj) => {
      delete obj._id;
      return obj;
    }
  },
  toObject: {
    virtuals: true,
    transform: (_, obj) => {
      delete obj._id;
      return obj;
    }
  },
  versionKey: false,
  timestamps: true
};
//////////////////////////////////////////////////////////////////////////////////////
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  },
  currency: {
    type: String,
    required: true,
    maxlength: 50,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
}, modelOptions);

userSchema.methods.transform = function () {
  const {id, userName, name, rate, currency } = this;
  return {userId: id, userName, name, rate, currency };
}
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");

  return this.password === hash;
};
export const userModel = mongoose.model("User", userSchema);
//////////////////////////////////////////////////////////////////////////////////////
const attributeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },
  value: {
    type: String,
    required: true,
    maxlength: 255,
  },
}, modelOptions);

const sectionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },
  attributes: [attributeSchema],
}, modelOptions);

const pageSchema = new Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },
  sections: [sectionSchema],
}, modelOptions);

export const pageModel = mongoose.model('Page', pageSchema);
//////////////////////////////////////////////////////////////////////////////////////
export const productchema = new Schema({
    itemCode: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 255,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    imageId: {//even though we gave a gallery, don't remove this
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    remaining: {
      type: Number,
      required: true,
      min: 0,
      max: 9999,
    },
  }, modelOptions);
export const productModel = mongoose.model('Product', productchema);
//////////////////////////////////////////////////////////////////////////////////////
const vendorSchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a vendor Name'],  
  },
}, modelOptions);
export const vendorModel = mongoose.model('Vendor', vendorSchema);
//////////////////////////////////////////////////////////////////////////////////////
export const categorySchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a category Name'],  
  },
  imageId: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required : [true, 'imageId must belong to an image'],
  },
}, modelOptions);
export const categoryModel = mongoose.model('Category', categorySchema);

export const subCategorySchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a SubCategory Name'],  
  },
}, modelOptions);
export const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);

const pSCCSchema = new Schema({
  productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required : [true, 'productId must belong to a product'],

  },
  categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required : [true, 'categoryId must belong to a category'],

  },
  subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required : [true, 'subCategoryId must belong to a subCategory'],
  },
}, modelOptions);
pSCCSchema.index({ productId: 1, categoryId: 1, subCategoryId: 1 }, { unique: true });
export const pSCCModel = mongoose.model('PSCC', pSCCSchema);
//////////////////////////////////////////////////////////////////////////////////////
const imageSchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a image Name'],  
  },
  url: {
      type: String,
      trim: true,
      maxlength: 150,
      required : [true, 'Please add a image url'],  
  },
}, modelOptions);
export const imageModel = mongoose.model('Image', imageSchema);

export const colorSchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a color Name'],  
  },
  colorCode: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a color Code'],  
  },
}, modelOptions);
export const colorModel = mongoose.model('Color', colorSchema);

const  sizeSchema = new Schema({
  name: {
      type: String,
      trim: true,
      maxlength: 50,
      required : [true, 'Please add a size Name'],  
  },
}, modelOptions);
export const sizeModel = mongoose.model('Size', sizeSchema);

const gallerySchema = new Schema({
  itemSubCode: {
    type: String,
    required: true,
    maxlength: 50,
  },
  subPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  subOriginalPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required : [true, 'productId must belong to a product'],

  },
  colorId: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required : [true, 'colorId must belong to a color'],

  },
  sizeId: {
      type: Schema.Types.ObjectId,
      ref: 'Color',
      required : [true, 'sizeId must belong to a size'],
  },
  imageId: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required : [true, 'imageId must belong to an image'],
  },
}, modelOptions);
gallerySchema.index({ productId: 1, colorId: 1, sizeId: 1, imageId: 1 }, { unique: true });
export const galleryModel = mongoose.model('Gallery', gallerySchema);


// import mongoose, { Model } from "mongoose";
// import modelOptions from "./model.options";
// import crypto from "crypto";

// const transformFields = ["id", "userName", "name"] as const;

// type Transformed = Pick<UserDocument, (typeof transformFields)[number]>

// interface UserDocument extends Document {
//   id: string;
//   userName: string;
//   name: string;
//   password: string;
//   salt: string;
//   transform(): Transformed;
//   setPassword: (password: string) => void;
//   validPassword: (password: string) => boolean;
// }

// interface UserModel extends Model<UserDocument> {
// }

// const userSchema = new mongoose.Schema<UserDocument>({
//   userName: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false
//   },
//   salt: {
//     type: String,
//     required: true,
//     select: false
//   }
// }, modelOptions);

// userSchema.methods.transform = function (): Transformed {
//   const {id, userName, name} = this;
//   return {id, userName, name};
// }
// userSchema.methods.setPassword = function (password: string) {
//   this.salt = crypto.randomBytes(16).toString("hex");

//   this.password = crypto.pbkdf2Sync(
//     password,
//     this.salt,
//     1000,
//     64,
//     "sha512"
//   ).toString("hex");
// };

// userSchema.methods.validPassword = function (password: string) {
//   const hash = crypto.pbkdf2Sync(
//     password,
//     this.salt,
//     1000,
//     64,
//     "sha512"
//   ).toString("hex");

//   return this.password === hash;
// };

// const userModel = mongoose.model<UserDocument, UserModel>("User", userSchema);

// export default userModel;

