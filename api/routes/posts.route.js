import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", verifyToken, addPost);

router.patch("/:id", verifyToken, updatePost);

router.delete("/:id", verifyToken, deletePost);

export default router;
