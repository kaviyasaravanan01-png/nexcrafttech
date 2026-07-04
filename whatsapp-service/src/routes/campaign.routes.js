const express = require("express");
const router = express.Router();
const { enqueueCampaign, pauseCampaign, resumeCampaign } = require("../queues/campaignQueue");
const { supabase } = require("../middleware/auth");

// POST /api/campaign/queue
router.post("/queue", async (req, res) => {
  const { campaignId } = req.body;
  const userId = req.userId;
  if (!campaignId) return res.status(400).json({ message: "campaignId required" });

  // Verify ownership
  const { data: campaign } = await supabase.from("wa_campaigns").select("id, scheduled_at, status").eq("id", campaignId).eq("user_id", userId).single();
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  if (["running", "completed"].includes(campaign.status)) {
    return res.status(409).json({ message: `Campaign is already ${campaign.status}` });
  }

  try {
    const jobId = await enqueueCampaign(campaignId, userId, campaign.scheduled_at);
    await supabase.from("wa_campaigns").update({ status: "queued", bull_job_id: jobId, updated_at: new Date().toISOString() }).eq("id", campaignId);
    res.json({ message: "Queued", jobId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/campaign/:id/pause
router.post("/:id/pause", async (req, res) => {
  const { id: campaignId } = req.params;
  try {
    await pauseCampaign(campaignId);
    res.json({ message: "Paused" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/campaign/:id/resume
router.post("/:id/resume", async (req, res) => {
  const { id: campaignId } = req.params;
  const userId = req.userId;
  try {
    const jobId = await resumeCampaign(campaignId, userId);
    res.json({ message: "Resumed", jobId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/campaign/:id/stop
router.post("/:id/stop", async (req, res) => {
  const { id: campaignId } = req.params;
  try {
    await pauseCampaign(campaignId); // same as pause but set to cancelled
    await supabase.from("wa_campaigns").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", campaignId);
    res.json({ message: "Stopped" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
