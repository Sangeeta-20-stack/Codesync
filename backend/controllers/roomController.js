
import crypto from "crypto";
import mongoose from "mongoose";
import Room from "../models/Room.js";

// Generate a unique room ID
const generateRoomId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// @desc    Create a new coding room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { name, language } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Room name must contain at least 3 characters",
      });
    }

    const supportedLanguages = [
      "javascript",
      "python",
      "java",
      "cpp",
      "c",
      "typescript",
    ];

    const selectedLanguage = language || "javascript";

    if (!supportedLanguages.includes(selectedLanguage)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language",
      });
    }

    let roomId;
    let existingRoom;

    // Ensure generated room ID is unique
    do {
      roomId = generateRoomId();
      existingRoom = await Room.findOne({ roomId });
    } while (existingRoom);

    const room = await Room.create({
      roomId,
      name: name.trim(),
      host: req.user._id,
      members: [req.user._id],
      language: selectedLanguage,
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("host", "name email")
      .populate("members", "name email");

    return res.status(201).json({
      success: true,
      message: "Coding room created successfully",
      room: populatedRoom,
    });
  } catch (error) {
    console.error("Create Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

// @desc    Join an existing coding room
// @route   POST /api/rooms/join
// @access  Private
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId || typeof roomId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid room ID",
      });
    }

    const room = await Room.findOne({
      roomId: roomId.trim().toUpperCase(),
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or no longer active",
      });
    }

    const alreadyMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      room.members.push(req.user._id);
      await room.save();
    }

    const populatedRoom = await Room.findById(room._id)
      .populate("host", "name email")
      .populate("members", "name email");

    return res.status(200).json({
      success: true,
      message: alreadyMember
        ? "You are already a member of this room"
        : "Joined room successfully",
      room: populatedRoom,
    });
  } catch (error) {
    console.error("Join Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join room",
    });
  }
};

// @desc    Get all rooms belonging to the logged-in user
// @route   GET /api/rooms/my-rooms
// @access  Private
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      members: req.user._id,
      isActive: true,
    })
      .populate("host", "name email")
      .populate("members", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get My Rooms Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve rooms",
    });
  }
};

// @desc    Get a specific room
// @route   GET /api/rooms/:roomId
// @access  Private
export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId.trim().toUpperCase();

    const room = await Room.findOne({
      roomId,
      isActive: true,
    })
      .populate("host", "name email")
      .populate("members", "name email");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const isMember = room.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You must join this room to access it",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve room",
    });
  }
};

// @desc    Leave a coding room
// @route   PATCH /api/rooms/:roomId/leave
// @access  Private
export const leaveRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId.trim().toUpperCase();

    const room = await Room.findOne({
      roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.host.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "The host cannot leave the room. Close the room instead.",
      });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this room",
      });
    }

    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await room.save();

    return res.status(200).json({
      success: true,
      message: "You left the room successfully",
    });
  } catch (error) {
    console.error("Leave Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave room",
    });
  }
};

// @desc    Close a coding room
// @route   PATCH /api/rooms/:roomId/close
// @access  Private (Host only)
export const closeRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId.trim().toUpperCase();

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the room host can close this room",
      });
    }

    room.isActive = false;
    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room closed successfully",
    });
  } catch (error) {
    console.error("Close Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to close room",
    });
  }
};

export const saveRoomCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { roomId } = req.params;

    if (typeof code !== "string") {
      return res.status(400).json({
        message: "Code must be a string",
      });
    }

    const room = await Room.findOne({
      roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found or inactive",
      });
    }

    const userId = (
      req.user._id || req.user.id
    ).toString();

    const isMember = room.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this room",
      });
    }

    room.code = code;
    await room.save();

    return res.status(200).json({
      message: "Code saved successfully",
      code: room.code,
    });
  } catch (error) {
    console.error("Save code error:", error);

    return res.status(500).json({
      message: "Failed to save code",
    });
  }
};