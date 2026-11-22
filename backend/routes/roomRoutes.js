
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoom,
  joinRoom,
  getMyRooms,
  getRoomById,
  leaveRoom,
  closeRoom,
   saveRoomCode,
} from "../controllers/roomController.js";

const router = express.Router();

// All room routes require authentication
router.use(authMiddleware);

router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/my-rooms", getMyRooms);
router.get("/:roomId", getRoomById);
router.patch("/:roomId/leave", leaveRoom);
router.patch("/:roomId/close", closeRoom);
router.patch("/:roomId/code", saveRoomCode);
export default router;
