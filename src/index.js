import mongoose from "mongoose";
import app from "./app.js";
import logger from "./config/logger.config.js";
import killerFunction from "./utils/killerFunction.js";
import dotenv from "dotenv/config";
import { Server } from "socket.io";
import SocketIo from "../SocketIo.js";
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error(`MongoDB connection error:${err}`));

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  // mongoose.set("debug", true);
}

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// socket
const io = new Server(server, {
  pingTimeout: 60000,
  cors: process.env.CLIENT_ENDPOINT,
});
io.on("connection", (socket) => {
  logger.info("socket.io connected successfully!");
  SocketIo(socket, io);
});
killerFunction(server);
