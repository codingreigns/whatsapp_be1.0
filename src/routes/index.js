import express from "express";
const router = express.Router();

// imports
import authRouter from "./auth.route.js";
import conversationRouter from "./conversation.route.js";
import messagesRouter from "./message.route.js";
import userRouter from "./user.route.js";

router.use("/auth", authRouter);
router.use("/conversation", conversationRouter);
router.use("/message", messagesRouter);
router.use("/user", userRouter);
export default router;
