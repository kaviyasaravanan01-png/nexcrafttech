require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const pino = require("pino");

const sessionRoutes = require("./routes/session.routes");
const campaignRoutes = require("./routes/campaign.routes");
const { initQueues } = require("./queues/campaignQueue");
const { authMiddleware } = require("./middleware/auth");

const log = pino({ transport: { target: "pino-pretty", options: { colorize: true } } });
const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = http.createServer(app);

// Socket.IO for real-time campaign progress
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Attach io to every request so routes can emit events
app.set("io", io);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// Routes (protected)
app.use("/api/session", authMiddleware, sessionRoutes);
app.use("/api/campaign", authMiddleware, campaignRoutes);

// Socket.IO — clients join their user's room by userId
io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    socket.join(`user:${userId}`);
    log.info(`Socket connected: ${socket.id} → user:${userId}`);
  }
  socket.on("disconnect", () => log.info(`Socket disconnected: ${socket.id}`));
});

// Init BullMQ queues
initQueues(io).catch((err) => log.error(err, "Failed to init queues"));

httpServer.listen(PORT, () => {
  log.info(`WhatsApp service running on http://localhost:${PORT}`);
});

module.exports = { app, io };
