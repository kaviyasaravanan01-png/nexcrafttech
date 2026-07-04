const express = require("express");
const crypto  = require("crypto");
const Razorpay = require("razorpay");
const pino    = require("pino");
const { supabase } = require("../middleware/auth");

const router = express.Router();
const log    = pino({ transport: { target: "pino-pretty" } });

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan → amount in paise (INR × 100)
const PLAN_PRICES = {
  starter:  49900,
  pro:      149900,
  business: 399900,
};

const PLAN_LABELS = {
  starter:  "Starter Plan",
  pro:      "Pro Plan",
  business: "Business Plan",
};

// ─── POST /api/payment/create-order ────────────────────────────────────────
// Creates a Razorpay order and stores a pending payment record.
router.post("/create-order", async (req, res) => {
  const userId = req.userId;
  const { planId } = req.body;

  if (!planId || !PLAN_PRICES[planId]) {
    return res.status(400).json({ message: "Invalid planId. Must be starter | pro | business" });
  }

  try {
    const amount   = PLAN_PRICES[planId];
    const currency = "INR";

    const order = await rzp.orders.create({
      amount,
      currency,
      receipt: `wa_${userId.slice(0, 8)}_${Date.now()}`,
      notes: { userId, planId },
    });

    // Store pending payment in Supabase
    await supabase.from("wa_payments").insert({
      user_id:           userId,
      razorpay_order_id: order.id,
      plan_id:           planId,
      amount,
      currency,
      status:            "pending",
    });

    log.info(`[Payment] Order created: ${order.id} user=${userId} plan=${planId}`);

    res.json({
      orderId:  order.id,
      amount,
      currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      planId,
      planLabel: PLAN_LABELS[planId],
    });
  } catch (err) {
    log.error(err, "[Payment] create-order failed");
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/payment/verify ──────────────────────────────────────────────
// Verifies Razorpay payment signature and activates the subscription.
router.post("/verify", async (req, res) => {
  const userId = req.userId;
  const { paymentId, orderId, signature, planId } = req.body;

  if (!paymentId || !orderId || !signature || !planId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Verify HMAC SHA256 signature
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSig !== signature) {
    log.warn(`[Payment] Invalid signature for order ${orderId}`);
    return res.status(400).json({ message: "Payment signature verification failed" });
  }

  try {
    const now = new Date().toISOString();

    // Update payment record
    await supabase
      .from("wa_payments")
      .update({ razorpay_payment_id: paymentId, status: "paid", paid_at: now })
      .eq("razorpay_order_id", orderId);

    // Activate / upgrade subscription
    const { data: existing } = await supabase
      .from("wa_subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const subPayload = {
      plan_id:               planId,
      status:                "active",
      razorpay_sub_id:       orderId,
      current_period_start:  now,
      current_period_end:    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at:            now,
    };

    if (existing?.id) {
      await supabase.from("wa_subscriptions").update(subPayload).eq("id", existing.id);
    } else {
      await supabase.from("wa_subscriptions").insert({ ...subPayload, user_id: userId });
    }

    log.info(`[Payment] Verified & activated: user=${userId} plan=${planId} payment=${paymentId}`);
    res.json({ success: true, planId, message: `${PLAN_LABELS[planId]} activated!` });
  } catch (err) {
    log.error(err, "[Payment] verify failed");
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/webhook/razorpay ────────────────────────────────────────────
// Razorpay webhook — handles payment.captured, payment.failed, etc.
// Mounted at /api/webhook/razorpay (no auth — signature verified below).
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const webhookSig    = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (expectedSig !== webhookSig) {
    log.warn("[Webhook] Invalid signature");
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  let event;
  try { event = JSON.parse(req.body.toString()); } catch {
    return res.status(400).json({ message: "Invalid JSON" });
  }

  log.info(`[Webhook] Event: ${event.event}`);

  try {
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const { userId, planId } = payment.notes || {};
      if (userId && planId) {
        const now = new Date().toISOString();
        await supabase.from("wa_payments")
          .update({ razorpay_payment_id: payment.id, status: "paid", paid_at: now })
          .eq("razorpay_order_id", payment.order_id);

        const { data: existing } = await supabase
          .from("wa_subscriptions").select("id").eq("user_id", userId).maybeSingle();

        const subPayload = {
          plan_id: planId, status: "active",
          current_period_start: now,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: now,
        };
        if (existing?.id) {
          await supabase.from("wa_subscriptions").update(subPayload).eq("id", existing.id);
        } else {
          await supabase.from("wa_subscriptions").insert({ ...subPayload, user_id: userId });
        }
        log.info(`[Webhook] Subscription activated: user=${userId} plan=${planId}`);
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      await supabase.from("wa_payments")
        .update({ status: "failed" })
        .eq("razorpay_order_id", payment.order_id);
    }
  } catch (err) {
    log.error(err, "[Webhook] Processing error");
  }

  res.json({ status: "ok" });
});

// ─── GET /api/payment/subscription ─────────────────────────────────────────
// Get the current user's subscription + plan details.
router.get("/subscription", async (req, res) => {
  const userId = req.userId;
  try {
    const { data } = await supabase
      .from("wa_subscriptions")
      .select("*, wa_plans(*)")
      .eq("user_id", userId)
      .maybeSingle();
    res.json(data || { plan_id: "free", status: "active" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
