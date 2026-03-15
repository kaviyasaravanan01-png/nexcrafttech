# 🌐 Remote Team Access Guide - Public URL Setup

## Problem
Your team is in different locations and can't access `http://YOUR_IP:3000`

## Solution Options (Choose 1)

---

## Option 1: ngrok (Easiest & Free)
**Best for:** Quick testing, temporary sharing

### Step 1: Download ngrok
- Go to: https://ngrok.com/download
- Download for Windows
- Extract to your computer

### Step 2: Setup ngrok
```bash
# Navigate to where you extracted ngrok
cd path/to/ngrok

# Authenticate (sign up at https://ngrok.com)
ngrok config add-authtoken YOUR_TOKEN
```

### Step 3: Run Dashboard + ngrok

**Terminal 1 - Start Dashboard:**
```bash
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"
node server.js
```

**Terminal 2 - Start ngrok:**
```bash
cd path/to/ngrok
ngrok http 3000
```

You'll see:
```
Session Status                online
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://RANDOM-ID.ngrok.io -> http://localhost:3000
```

**Share this link with team:** `https://RANDOM-ID.ngrok.io`

✅ **Pros:** Simple, free, works immediately
❌ **Cons:** URL changes if ngrok restarts, limited bandwidth on free tier

---

## Option 2: Cloudflare Tunnel (Recommended for Stability)
**Best for:** Long-term, professional use, free

### Step 1: Download Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-applications/
# For Windows, download: cloudflared-windows-amd64.exe
# Place it in your lead-scraper folder
```

### Step 2: Setup (First time only)
```bash
# Navigate to your lead-scraper folder
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"

# Authenticate
cloudflared.exe login
# Follow the web browser to authorize Cloudflare account
```

### Step 3: Create Tunnel Configuration
Create file: `.cloudflared/config.yml`

```yaml
tunnel: leads-dashboard
credentials-file: C:\Users\Anand\AppData\Roaming\.cloudflared\YOUR-TUNNEL-ID.json

ingress:
  - hostname: leads.YOUR_DOMAIN.com
    service: http://localhost:3000
  - service: http_status:404
```

Replace `YOUR_DOMAIN` with your Cloudflare domain.

### Step 4: Create Tunnel
```bash
cloudflared.exe tunnel create leads-dashboard
```

### Step 5: Route Traffic
Go to Cloudflare Dashboard → DNS and add CNAME:
```
Name: leads
Type: CNAME
Target: UUID.cfargotunnel.com
```

### Step 6: Run
```bash
# Terminal 1 - Dashboard
node server.js

# Terminal 2 - Tunnel
cloudflared.exe tunnel run leads-dashboard
```

**Share link:** `https://leads.YOUR_DOMAIN.com`

✅ **Pros:** Stable URL, professional, good security
❌ **Cons:** Requires Cloudflare domain

---

## Option 3: Deploy to Free Cloud (Best for Production)

### Choice A: Railway.app
```bash
# 1. Sign up at https://railway.app
# 2. Create new project from GitHub
# 3. Add environment variable: PORT=3000
# 4. Deploy
# 5. Get public URL automatically
```

### Choice B: Render.com
```bash
# Similar to Railway, free tier available
# https://render.com
```

### Choice C: Heroku (Paid After Free Tier)
```bash
# Still available but free tier deprecated
# Now part of Salesforce
```

✅ **Pros:** Permanent URL, no setup needed, scalable
❌ **Cons:** Harder to update frequently

---

## 🚀 Quick Start: Use ngrok (Next 5 Minutes)

1. **Download ngrok:**
   ```
   https://ngrok.com/download
   ```

2. **Sign up for free account:**
   ```
   https://ngrok.com
   ```

3. **Extract ngrok.exe** to a folder

4. **Get your auth token** from ngrok dashboard

5. **Create a batch file** in your lead-scraper folder: `START-WITH-NGROK.bat`

```batch
@echo off
echo Starting Dashboard with ngrok...
echo.

REM Start server in background
start "" node server.js

REM Wait for server to start
timeout /t 3

REM Start ngrok
path\to\ngrok.exe http 3000

pause
```

6. **Double-click `START-WITH-NGROK.bat`**

7. **Copy the URL** and share with team

---

## Advanced: Automated Script with Public URL

Create `START-PUBLIC-DASHBOARD.bat`:

```batch
@echo off
echo ================================================
echo Remote Dashboard Setup
echo ================================================
echo.

set CHOICE=
echo Choose access method:
echo 1 = ngrok (Easiest)
echo 2 = Cloudflare Tunnel (Stable)
echo 3 = Local Only

set /p CHOICE="Enter your choice (1-3): "

if "%CHOICE%"=="1" (
    echo Starting with ngrok...
    start "" node server.js
    timeout /t 3
    path\to\ngrok.exe http 3000
) else if "%CHOICE%"=="2" (
    echo Starting with Cloudflare Tunnel...
    start "" node server.js
    timeout /t 3
    cloudflared.exe tunnel run leads-dashboard
) else (
    echo Starting local only...
    node server.js
)
```

---

## Summary: What to Do NOW

### For Quick Public Access (Next 30 min):
1. Download ngrok: https://ngrok.com/download
2. Sign up: https://ngrok.com
3. Extract to lead-scraper folder
4. Run in one terminal: `node server.js`
5. Run in another: `ngrok http 3000`
6. Share the `https://...ngrok.io` URL with team
7. Done! ✅

### For Professional Setup (Takes 1 hour):
1. Use Cloudflare Tunnel (more stable, branded URL)
2. Or deploy to Railway/Render (permanent)

---

**Questions?** See next file: SCRAPER-SETUP.md
