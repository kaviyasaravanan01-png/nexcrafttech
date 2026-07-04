const { Queue, Worker, QueueEvents } = require("bullmq");
const IORedis = require("ioredis");
const pino = require("pino");
const { sendCampaign } = require("../services/messageSender");
const { supabase } = require("../middleware/auth");

const log = pino({ transport: { target: "pino-pretty" } });

const QUEUE_NAME = "wa-campaigns";
let queue, worker, queueEvents;

// Track abort signals per campaign
const abortMap = new Map();

function initQueues(io) {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  let connection;
  try {
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      connectTimeout: 5000,
    });
  } catch (err) {
    log.warn("Redis not available — campaign queue disabled. Campaigns will not be processed.");
    return Promise.resolve({ queue: null, worker: null });
  }

  connection.on("error", (err) => {
    log.warn({ err }, "Redis connection error — queue paused");
  });

  queue = new Queue(QUEUE_NAME, { connection });
  queueEvents = new QueueEvents(QUEUE_NAME, { connection });

  worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const { campaignId, userId } = job.data;
      log.info(`[Queue] Processing campaign ${campaignId}`);

      abortMap.set(campaignId, false);

      try {
        await sendCampaign({
          campaignId,
          userId,
          io,
          onAbort: () => abortMap.get(campaignId) === true,
        });
      } finally {
        abortMap.delete(campaignId);
      }
    },
    {
      connection,
      concurrency: 2, // max 2 campaigns running simultaneously
    }
  );

  worker.on("failed", async (job, err) => {
    log.error(err, `[Queue] Job failed: ${job.id}`);
    const { campaignId } = job.data;
    try {
      await supabase.from("wa_campaigns").update({
        status: "failed",
        error_message: err.message,
        updated_at: new Date().toISOString(),
      }).eq("id", campaignId);
    } catch { /* ignore */ }
  });

  log.info("[Queue] BullMQ campaign queue ready");
  return Promise.resolve({ queue, worker });
}

/** Add a campaign job to the queue */
async function enqueueCampaign(campaignId, userId, scheduledAt) {
  if (!queue) throw new Error("Queue not available — Redis is not connected. Make sure REDIS_URL is set.");
  const delay = scheduledAt ? Math.max(0, new Date(scheduledAt).getTime() - Date.now()) : 0;

  const job = await queue.add(
    "send-campaign",
    { campaignId, userId },
    {
      delay,
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: 100,
      jobId: `campaign:${campaignId}`,
    }
  );

  log.info(`[Queue] Enqueued campaign ${campaignId} (delay=${delay}ms)`);
  return job.id;
}

/** Pause a running campaign */
async function pauseCampaign(campaignId) {
  // Signal the running sendCampaign loop to abort
  abortMap.set(campaignId, true);
  await supabase.from("wa_campaigns").update({ status: "paused", updated_at: new Date().toISOString() }).eq("id", campaignId);
}

/** Resume a paused campaign by re-queuing */
async function resumeCampaign(campaignId, userId) {
  abortMap.set(campaignId, false);
  await supabase.from("wa_campaigns").update({ status: "queued", updated_at: new Date().toISOString() }).eq("id", campaignId);
  return enqueueCampaign(campaignId, userId, null);
}

module.exports = { initQueues, enqueueCampaign, pauseCampaign, resumeCampaign };
