# NexCraft WhatsApp CRM — Railway Backend

Persistent Node.js service for the WhatsApp CRM product. Handles:
- WhatsApp session management (Baileys → WWebJS → WPPConnect fallback chain)
- Real-time progress via Socket.IO
- Background campaign queue via BullMQ + Redis

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, REDIS_URL, CORS_ORIGIN

# 3. Run locally
npm run dev

# 4. (Optional) Install fallback providers
npm install whatsapp-web.js puppeteer
```

## Deploy on Railway

1. Push to GitHub
2. Create new Railway project → "Deploy from GitHub"
3. Add **environment variables** from `.env.example`
4. Add a **Redis** plugin from Railway marketplace
5. Set start command: `npm start`

## Architecture

```
Frontend (Vercel) ←→ HTTP/Socket.IO ←→ Railway Service ←→ WhatsApp
                                              ↕
                                         Supabase (PostgreSQL)
                                              ↕
                                          Redis (BullMQ)
```

## Socket.IO Events

| Event | Direction | Payload |
|---|---|---|
| `wa:qr` | Server→Client | `{ qr: "data:image/png;base64,..." }` |
| `wa:ready` | Server→Client | `{ provider, phone }` |
| `wa:disconnected` | Server→Client | `{ reason }` |
| `campaign:started` | Server→Client | `{ campaignId, total }` |
| `campaign:progress` | Server→Client | `{ sent, failed, total, status, log }` |
| `campaign:completed` | Server→Client | `{ sent, failed, successRate }` |

## Folder Structure

```
src/
  index.js              — Express + Socket.IO server
  middleware/
    auth.js             — Supabase JWT verification
  providers/
    IWhatsAppProvider.js — Abstract base class
    BaileysProvider.js  — Primary (recommended)
    WWebJSProvider.js   — Fallback 1
    WhatsAppFactory.js  — Manages per-user provider instances
  queues/
    campaignQueue.js    — BullMQ queue + worker
  routes/
    session.routes.js   — /api/session/*
    campaign.routes.js  — /api/campaign/*
  services/
    messageSender.js    — Core send loop (delays, spinning, variables)
```
