import express from "express";
import { all } from "trim-request";
import {
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", all, authMiddleware, sendMessages);
router.get("/:convoId", all, authMiddleware, getMessages);

export default router;
