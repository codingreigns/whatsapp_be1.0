// import("express-async-errors");
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import {
  HttpErrorHandler,
  notFoundHandler,
} from "./middleware/customErrorMiddleware.js";
import createHttpError from "http-errors";
// express app
const app = express();
// routes
import routes from "./routes/index.js";
// middleware
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1", routes);

// custom middleware
app.use(HttpErrorHandler);
app.use(notFoundHandler);
console.log(process.env.NODE_ENV);
export default app;
