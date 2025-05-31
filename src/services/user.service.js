import createHttpError from "http-errors";
import User from "../models/userModel.js";

export const findUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw createHttpError.BadRequest("please enter user id");
  return user;
};

export const searchUsersByKeyword = async (keyword) => {
  const users = await User.findOne({
    name: { $regex: keyword, $options: "i" },
  });
  return users;
};
