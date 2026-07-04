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
const PORT = process.env.PORT || 8080;

// Support comma-separated CORS origins e.g. "https://nexcrafttech.com,http://localhost:3000"
const rawOrigins = process.env.CORS_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = rawOrigins.split(",").map((o) => o.trim());

function corsOriginFn(origin, callback) {
  // Allow requests with no origin (curl, Postman, Railway health checks)
  if (!origin) return callback(null, true);
  if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
  callback(new Error(`CORS blocked: ${origin}`));
}

const app = express();
const httpServer = http.createServer(app);

// Socket.IO for real-time campaign progress
const io = new SocketServer(httpServer, {
  cors: { origin: corsOriginFn, methods: ["GET", "POST"], credentials: true },
});

// Attach io to every request so routes can emit events
app.set("io", io);

app.use(cors({ origin: corsOriginFn, credentials: true }));
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
