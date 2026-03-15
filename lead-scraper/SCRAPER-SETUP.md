# 📊 Running the Lead Scraper - Complete Guide

## What the Scraper Does

Searches Google Places for businesses without websites in multiple Tamil Nadu cities:
- Interior designers, architects, salons, restaurants, bakeries, dental clinics, real estate, spas, etc.
- Excludes businesses that already have websites
- Generates WhatsApp links automatically
- Saves to `leads.csv`

**Time Required:** 30-90 minutes depending on results

---

## Prerequisites

### 1️⃣ Google Places API Key
You MUST have this. Here's how to get it:

**Step 1: Go to Google Cloud Console**
- Navigate to: https://console.cloud.google.com/
- Sign in with your Google account

**Step 2: Create New Project**
- Click "Select a Project" → "New Project"
- Name: `NexCraftTech Leads`
- Click "Create"

**Step 3: Enable Places API**
- Search for "Places API" in search bar
- Click on it → Click "Enable"

**Step 4: Create API Key**
- Go to "Credentials" (left sidebar)
- Click "Create Credentials" → "API Key"
- Copy the key (you'll need it)

**Step 5: Set API Restrictions** (Important)
- Click on your API key
- Under "API restrictions" → Select "Maps, Places and Routes"
- Check "Places API"
- Save

**Optional but Recommended:**
- Set key restrictions (HTTP referrers) to limit usage
- Set up billing alerts to monitor costs

---

## Running the Scraper

### Method 1: Using Batch File (Easiest)

**Step 1: Prepare**
```bash
# Get your API key from Google Cloud Console (see above)
```

**Step 2: Create Batch File**
Create file: `RUN-SCRAPER-WITH-KEY.bat`

```batch
@echo off
echo ================================================
echo NexCraftTech Lead Scraper
echo ================================================
echo.

REM Change to script directory
cd /d "%~dp0"

echo 📌 Enter your Google Places API Key when prompted
echo.
echo 🔗 Get it from: https://console.cloud.google.com/
echo.

set /p API_KEY="Enter Google API Key: "

if "%API_KEY%"=="" (
    echo ❌ ERROR: API key required
    pause
    exit /b 1
)

echo.
echo ⏱️  Starting lead scraper (30-90 minutes)...
echo ⚠️  DO NOT close this window!
echo.

set GOOGLE_API_KEY=%API_KEY%
node lead-scraper.js

echo.
echo ✅ Scraping complete!
echo 📁 Check leads.csv for results
echo.
pause
```

**Step 3: Run It**
- Double-click `RUN-SCRAPER-WITH-KEY.bat`
- Paste your Google API key
- Wait...
- Results saved to `leads.csv` ✅

---

### Method 2: Command Line (Advanced)

**Step 1: Open Command Prompt**
```bash
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"
```

**Step 2: Set API Key & Run**
```bash
set GOOGLE_API_KEY=your_key_here
node lead-scraper.js
```

---

### Method 3: Permanent Setup (Recommended)

**Step 1: Set Windows Environment Variable**
- Right-click "This PC" → Properties
- Click "Advanced system settings"
- Click "Environment Variables"
- Under "User variables" click "New"
- Variable name: `GOOGLE_API_KEY`
- Variable value: `your_api_key_here`
- Click OK → OK → OK

**Step 2: Restart your computer**

**Step 3: Run Scraper**
```bash
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"
node lead-scraper.js
```

Then just double-click `RUN-SCRAPER.bat` anytime!

---

## What Happens During Scraping

You'll see output like:
```
🔎 Searching: interior designer chennai
✅ Lead: BLUE HOMES INTERIORS
✅ Lead: K5 INTERIORS
⏳ Loading next page...
✅ Lead: Peril Interior Designers
✅ Lead: Found 127 leads in this search
...
(continuing for each of 20 cities × 35 businesses = 700 searches)
...
🎉 Finished. Leads saved to leads.csv
```

**⏱️ Timeline:**
- 3-5 minutes: First results appear
- 15-30 minutes: 50+ leads
- 45-90 minutes: Complete (depends on internet speed)

---

## After Scraping Completes

### Step 1: Check Results
```bash
# Open leads.csv in Excel
# Should see: NAME, PHONE, ADDRESS, WHATSAPP_LINK
```

### Step 2: Update WhatsApp Messages
```bash
# If you modified the message template, update old leads too
node update-whatsapp-messages.js
```

Or double-click: `UPDATE-MESSAGES.bat`

### Step 3: Merge with Existing Leads (Optional)
If you want to combine `leads.csv` with `firstleads.csv`:

**Option A: Manual in Excel**
1. Open both CSV files
2. Copy new leads from `leads.csv`
3. Paste into `firstleads.csv`
4. Save

**Option B: Use Power Query (Excel)**
1. Create pivot or append in Excel
2. Save as CSV

**Option C: Use a Script**
```bash
REM Create merge-leads.bat to combine both files
```

---

## Common Issues & Fixes

### ❌ "GOOGLE_API_KEY not set"
**Solution:**
- Set environment variable (see Method 3 above)
- Or use Method 1 (batch file input)

### ❌ "API quota exceeded"
**Solution:**
- Too many requests sent
- Wait 1 hour
- Check API limits at: https://console.cloud.google.com/ → Quotas
- Consider increasing quota (costs money)

### ❌ "No places found"
**Solution:**
- This is normal for some searches
- Try other keywords
- Check your internet connection

### ❌ "Scraper frozen/stuck"
**Solution:**
- Network timeout (wait or restart)
- Kill with: Ctrl+C
- Restart: `node lead-scraper.js`

### ❌ "WhatsApp links not working"
**Solution:**
- Run: `node update-whatsapp-messages.js`
- Check phone numbers are valid
- Use 10-digit Indian format

---

## Cost Considerations

Google Places API is **FREE** for:
- ✅ First 25,000 requests/month
- ✅ Text search: $2.50 per 1000 requests AFTER free quota
- ✅ Place details: $1.75 per 1000 requests AFTER free quota

**Example Cost:**
- 700 searches × $2.50 = $1,750 (if all billable)
- But most likely FREE (under 25k/month)

**Monitor your usage:**
- Go to: https://console.cloud.google.com/ → Quotas
- Set up billing alerts

---

## Optimization: Run in Background

### Using Windows Task Scheduler

**Step 1: Create a Task**
- Open Task Scheduler
- Create new task: "Run Lead Scraper"
- Trigger: "At specific time" (e.g., 2 AM daily)
- Action: Run `node.exe` with argument: `C:\...\lead-scraper.js`

**Step 2: Set Environment Variable**
- Add it to system environment (see Method 3)

**Step 3: Let it Run Overnight**
- Scraper runs automatically
- Results saved to leads.csv
- You check them next morning

---

## Quick Reference: Complete Workflow

```bash
# 1. Get Google API Key from console.cloud.google.com

# 2. Set it (one-time)
set GOOGLE_API_KEY=your_key_here

# 3. Run scraper (takes 30-90 min)
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"
node lead-scraper.js

# 4. Check results
# Open leads.csv and verify

# 5. Update messages (if template changed)
node update-whatsapp-messages.js

# 6. Use in dashboard
# Rename leads.csv to firstleads.csv or upload manually
# Start dashboard: node server.js
# Share public URL with team
```

---

## Next Steps

✅ Get Google API Key: https://console.cloud.google.com/
✅ Set environment variable or use batch file
✅ Run: `node lead-scraper.js`
✅ Wait for completion
✅ Upload results to dashboard
✅ Start sharing with team!

---

## Need Help?

- **Google API Issues?** Check: https://support.google.com/cloud/
- **Node.js Issues?** Check: https://nodejs.org/
- **CSV Format Issues?** See README.md

**Estimated Total Time:**
- Setup API: 15 minutes
- Run scraper: 45-90 minutes
- Total: 1-2 hours for full setup

**That's it!** You'll have fresh leads ready to contact. 🚀
