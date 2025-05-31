import createHttpError from "http-errors";
import validator from "validator";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  if (!name || !email || !password) {
    throw createHttpError[400]("Name, email, and password are required");
  }
  if (!validator.isLength(name, { min: 3, max: 20 })) {
    throw createHttpError.BadRequest(
      "Name must be between 3 and 20 characters"
    );
  }
  if (status) {
    if (status.isLength > 64) {
      throw createHttpError.BadRequest(
        "Status must be less than 64 characters"
      );
    }
  }
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Email is not valid");
  }
  //   user exists
  let checkuser = await User.findOne({ email });
  if (checkuser) {
    throw createHttpError.Conflict(
      "User already exists, Please try a different email"
    );
  }
  if (!validator.isLength(password, { min: 6, max: 20 })) {
    throw createHttpError.BadRequest(
      "Password must be between 6 and 20 characters"
    );
  }
  const user = new User({
    name,
    email,
    password,
    picture,
  }).save();
  return user;
};

export const signInUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createHttpError.NotFound("User not found, Please Register to login");
  }
  let passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createHttpError.Unauthorized("Invalid password");
  }
  return user;
};

export const findUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError.NotFound("User not found");
  }
  return user;
};
