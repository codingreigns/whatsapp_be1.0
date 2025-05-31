import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export default async function (req, res, next) {
  if (!req.headers["authorization"]) {
    return next(createHttpError.Unauthorized());
  }
  const token = req.headers["authorization"].split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(createHttpError.Unauthorized("Unauthorized"));
    }
    req.user = decoded;
    next();
  });
}
