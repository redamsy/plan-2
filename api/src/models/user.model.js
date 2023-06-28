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
    imageId: {
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
