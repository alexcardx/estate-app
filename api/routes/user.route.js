import express from "express";
import {
  updateUser,
  deleteUser,
  getUserPosts,
  getSavedPosts,
  savePost,
  getNotificationNumber,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.patch("/me", verifyToken, updateUser);

router.delete("/me", verifyToken, deleteUser);

router.get("/posts", verifyToken, getUserPosts);

router.get("/saved/posts", verifyToken, getSavedPosts);

router.post("/save", verifyToken, savePost);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;
