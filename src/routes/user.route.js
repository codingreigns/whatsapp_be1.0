import express from "express";
import { all } from "trim-request";
import authMiddleware from "../middleware/authMiddleware.js";
import { searchUser } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", all, authMiddleware, searchUser);

export default router;
