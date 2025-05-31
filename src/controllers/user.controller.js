import createHttpError from "http-errors";
import { searchUsersByKeyword } from "../services/user.service.js";

export const searchUser = async (req, res, next) => {
  try {
    const keyWord = req.query.search;
    if (!keyWord) throw createHttpError.BadRequest("something went wrong");
    const users = await searchUsersByKeyword(keyWord);

    res.json(users);
  } catch (error) {
    next(error);
  }
};
