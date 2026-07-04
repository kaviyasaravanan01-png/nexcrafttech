require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const pino = require("pino");

const sessionRoutes  = require("./routes/session.routes");
const campaignRoutes = require("./routes/campaign.routes");
const paymentRoutes  = require("./routes/payment.routes");
const { initQueues } = require("./queues/campaignQueue");
const { authMiddleware } = require("./middleware/auth");
const { restoreAllSessions } = require("./providers/WhatsAppFactory");

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
app.use("/api/session",  authMiddleware, sessionRoutes);
app.use("/api/campaign", authMiddleware, campaignRoutes);
app.use("/api/payment",  authMiddleware, paymentRoutes);
// Razorpay webhook — no auth middleware, signature verified inside the route
app.use("/api/webhook/razorpay", paymentRoutes);

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

httpServer.listen(PORT, async () => {
  log.info(`WhatsApp service running on http://localhost:${PORT}`);

  // On startup: any campaign still marked "running" or "queued" means the
  // previous process died mid-flight. Reset them so users can re-run.
  try {
    const { authMiddleware: _ignore, supabase } = require("./middleware/auth");
    const now = new Date().toISOString();
    const { error, count } = await supabase
      .from("wa_campaigns")
      .update({
        status: "failed",
        error_message: "Service restarted — please re-run this campaign",
        updated_at: now,
      })
      .in("status", ["running", "queued"])
      .select("id", { count: "exact", head: true });
    if (!error) log.info(`[Startup] Reset ${count ?? "?"} stuck campaigns to failed`);
  } catch (e) {
    log.warn({ e }, "[Startup] Could not reset stuck campaigns");
  }

  // Restore WhatsApp sessions from Supabase (3 s delay so server is fully up)
  setTimeout(() => {
    restoreAllSessions(io).catch((err) =>
      log.error(err, "Failed to restore sessions on startup")
    );
  }, 3000);
});

module.exports = { app, io };
