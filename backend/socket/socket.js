
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Room from "../models/Room.js";

const getRoomChannel = (roomId) => `room:${roomId}`;

export default function initializeSocket(io) {
  // Authenticate every socket connection.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required."));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId =
        decoded.id ||
        decoded.userId ||
        decoded._id ||
        decoded.sub;

      if (!userId) {
        return next(new Error("Invalid authentication token."));
      }

      const user = await User.findById(userId).select(
        "_id name email"
      );

      if (!user) {
        return next(new Error("User not found."));
      }

      socket.data.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      next();
    } catch (error) {
      next(new Error("Invalid or expired token."));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.data.user.name}`);

    // Broadcast the currently connected members of a room.
    const broadcastMembers = async (roomId) => {
      const channel = getRoomChannel(roomId);
      const connectedSockets = await io.in(channel).fetchSockets();

      const uniqueMembers = new Map();

      connectedSockets.forEach((connectedSocket) => {
        const user = connectedSocket.data.user;

        if (user) {
          uniqueMembers.set(user.id, user);
        }
      });

      io.to(channel).emit(
        "room:members",
        Array.from(uniqueMembers.values())
      );
    };

    // Join a coding room.
    socket.on("room:join", async ({ roomId } = {}, callback) => {
      try {
        if (!roomId || typeof roomId !== "string") {
          return callback?.({
            success: false,
            message: "Invalid room ID.",
          });
        }

        const room = await Room.findOne({
          roomId,
          isActive: true,
          members: socket.data.user.id,
        }).select("roomId code language");

        if (!room) {
          return callback?.({
            success: false,
            message: "Room not found or access denied.",
          });
        }

        // Leave the previous room if necessary.
        const previousRoomId = socket.data.roomId;

        if (previousRoomId && previousRoomId !== roomId) {
          await socket.leave(getRoomChannel(previousRoomId));
          await broadcastMembers(previousRoomId);
        }

        socket.data.roomId = roomId;

        await socket.join(getRoomChannel(roomId));

        callback?.({
          success: true,
          room: {
            roomId: room.roomId,
            code: room.code,
            language: room.language,
          },
        });

        await broadcastMembers(roomId);

        console.log(
          `${socket.data.user.name} joined room ${roomId}`
        );
      } catch (error) {
        console.error("Socket room join error:", error);

        callback?.({
          success: false,
          message: "Could not join the room.",
        });
      }
    });

    // Broadcast editor changes to other users in the same room.
    socket.on("room:code-change", ({ code } = {}) => {
      const roomId = socket.data.roomId;

      if (!roomId || typeof code !== "string") {
        return;
      }

      if (Buffer.byteLength(code, "utf8") > 50000) {
        return;
      }

      socket.to(getRoomChannel(roomId)).emit(
        "room:code-change",
        {
          code,
          user: socket.data.user,
        }
      );
    });

    // Broadcast language changes.
    socket.on("room:language-change", ({ language } = {}) => {
      const roomId = socket.data.roomId;

      const supportedLanguages = [
        "javascript",
        "python",
        "java",
        "cpp",
        "c",
        "typescript",
      ];

      if (!roomId || !supportedLanguages.includes(language)) {
        return;
      }

      socket.to(getRoomChannel(roomId)).emit(
        "room:language-change",
        {
          language,
          user: socket.data.user,
        }
      );
    });

    socket.on("disconnect", async () => {
      const roomId = socket.data.roomId;

      console.log(`Socket disconnected: ${socket.data.user.name}`);

      if (roomId) {
        await broadcastMembers(roomId);
      }
    });
  });
}
