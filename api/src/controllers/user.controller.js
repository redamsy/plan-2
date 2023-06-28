import {userModel} from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { userName, password, name } = req.body;

    const checkUser = await userModel.findOne({ userName });

    if (checkUser) return responseHandler.badrequest(res, "Username already used");

    const user = new userModel();

    user.name = name;
    user.userName = userName;
    user.setPassword(password);

    await user.save();

    console.log("userController: signup: user", user)
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    const transformedUser = user.transform()

    return responseHandler.created(res, {
      token,
      userProfile: transformedUser
    });
  } catch(error) {
    console.log("userController: error", error);
    return responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await userModel.findOne({ userName }).select("username password salt id name");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    const transformedUser = user.transform();

    return responseHandler.created(res, {
      token,
      userProfile: transformedUser
    });
  } catch(error) {
    console.log("userController: error", error);
    return responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("userController: updatePassword: req.user.userId", req.user.id);
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    //TODO: revoke token
    return responseHandler.ok(res, { message: "Password changed"});
  } catch(error) {
    console.log("userController: error", error);
    return responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    console.log("userController: getInfo: req.user.userId", req.user.id);// current user id
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    const transformedUser = user.transform();
    return responseHandler.ok(res, transformedUser);
  } catch(error) {
    console.log("userController: error", error);
    return responseHandler.error(res);
  }
};
/////////////////////////////////////////////////////////////////////////////////
const updateCurrency = async (req, res) => {
  try {
    const { id } = req.user;
    const { rate, currency } = req.body;

    const user = await userModel.findById(id);

    if (!user) return responseHandler.notfound(res);

    user.rate = rate;
    user.currency = currency;

    await user.save();

    return responseHandler.ok(res, {
      ...user._doc,
      id: user.id,
    });
  } catch(error) {
    console.log("userController: updateCurrency: error", error);
    return responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  updateCurrency,
};