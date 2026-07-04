const express = require("express");
const router = express.Router();
const { initSession, getActiveProvider, disconnectSession } = require("../providers/WhatsAppFactory");
const { supabase } = require("../middleware/auth");
const pino = require("pino");

const log = pino({ transport: { target: "pino-pretty" } });

// POST /api/session/qr — start a new WA session and emit QR via socket
router.post("/qr", async (req, res) => {
  const io = req.app.get("io");
  const userId = req.userId;
  try {
    // Non-blocking — init runs in background, QR emitted via socket
    initSession(userId, io, req.body.providerIndex || 0).catch((err) => {
      log.error(err, "initSession failed");
      io.to(`user:${userId}`).emit("wa:error", { message: err.message });
    });
    res.json({ message: "QR generation started. Listen to wa:qr socket event." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/session/status — get current session status
router.get("/status", async (req, res) => {
  const userId = req.userId;

  // First check in-memory (most accurate — reflects actual WA socket state)
  const { activeProviders } = require("../providers/WhatsAppFactory");
  const entry = activeProviders.get(userId);
  if (entry) {
    const liveStatus = await entry.instance.getStatus();
    return res.json({ status: liveStatus, provider: entry.provider });
  }

  // Fallback to DB
  try {
    const { data } = await supabase
      .from("wa_sessions")
      .select("status, phone, provider, last_seen")
      .eq("user_id", userId)
      .maybeSingle();
    res.json(data || { status: "disconnected" });
  } catch {
    res.json({ status: "disconnected" });
  }
});

// POST /api/session/disconnect
router.post("/disconnect", async (req, res) => {
  const io = req.app.get("io");
  const userId = req.userId;
  try {
    await disconnectSession(userId);
    io.to(`user:${userId}`).emit("wa:disconnected", { reason: "manual" });
    res.json({ message: "Disconnected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
