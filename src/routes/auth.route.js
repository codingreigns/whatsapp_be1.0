import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import { all } from "trim-request";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", all, register);
router.post("/login", all, login);
router.post("/logout", all, logout);
router.post("/refreshtoken", all, refreshToken);
router.get("/test", all, authMiddleware, (req, res) => {
  res.send("hello");
});
export default router;
