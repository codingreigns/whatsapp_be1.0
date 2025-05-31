import express from "express";
import { all } from "trim-request";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createOpenConversation,
  getConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", all, authMiddleware, createOpenConversation);
router.get("/", all, authMiddleware, getConversations);

export default router;
