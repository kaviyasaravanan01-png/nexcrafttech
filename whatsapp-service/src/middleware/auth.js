// Polyfill WebSocket for Node < 22 (Supabase realtime requires it)
if (!globalThis.WebSocket) {
  globalThis.WebSocket = require("ws");
}

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Verifies the Supabase JWT from the Authorization header.
 * Sets req.user and req.userId on success.
 */
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }
  const token = header.slice(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token verification failed" });
  }
}

module.exports = { authMiddleware, supabase };
