import express from "express";
import { addMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/chat/:chatId", verifyToken, addMessage);

export default router;
