
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { executeCode } from "../controllers/executionController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", executeCode);

export default router;
