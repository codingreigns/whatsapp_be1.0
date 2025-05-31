import { createUser, signInUser, findUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import "dotenv/config.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
    const payload = {
      userId: newUser._id,
    };
    // Generate access and refresh tokens
    const access_token = await generateToken(
      payload,
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      payload,
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signInUser(email, password);
    // payload for JWT
    const payload = {
      userId: user._id,
    };
    // Generate access and refresh tokens
    const access_token = await generateToken(
      payload,
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      payload,
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      message: "User login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });
    res.json({
      message: "User logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshtoken } = req.cookies;

    if (!refreshtoken) {
      throw createHttpError.Unauthorized("Please login first");
    }
    const checkUserToken = await verifyToken(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await findUser(checkUserToken.userId);
    const access_token = await generateToken(
      {
        userId: user._id,
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};
