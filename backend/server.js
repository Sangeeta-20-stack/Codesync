
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import executionRoutes from "./routes/executionRoutes.js";

import authMiddleware from "./middleware/authMiddleware.js";
import initializeSocket from "./socket/socket.js";

dotenv.config();

const app = express();

// Create HTTP server.
const server = http.createServer(app);

// Initialize Socket.IO.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

// Initialize real-time events.
initializeSocket(io);

// Middleware.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// Default route.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CodeSync Backend is running!",
  });
});

// Authentication routes.
app.use("/api/auth", authRoutes);

// Protected user profile.
app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Coding room routes.
app.use("/api/rooms", roomRoutes);

// Code execution routes.
app.use("/api/execute", executionRoutes);

// 404 handler.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// Global error handler.
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// Start server.
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log("----------------------------------");
      console.log("       CodeSync Backend");
      console.log("----------------------------------");
      console.log(`Server: http://localhost:${PORT}`);
      console.log("Database: Connected");
      console.log("Authentication: Enabled");
      console.log("Coding Rooms: Enabled");
      console.log("Code Execution: Enabled");
      console.log("Socket.IO: Enabled");
      console.log("----------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
