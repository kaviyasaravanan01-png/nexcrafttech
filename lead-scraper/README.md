# WhatsApp Leads Management System

A professional, dynamic lead management dashboard for sending WhatsApp messages to business leads.

## 📂 Project Structure

```
lead-scraper/
├── lead-scraper.js                    # Main web scraper for Google Places
├── update-whatsapp-messages.js        # Updates WhatsApp messages in CSV files
├── server.js                          # Local network server for dashboard
├── leads_dashboard.html               # Dynamic professional dashboard
├── firstleads.csv                     # Pre-existing leads (updated with new messages)
├── leads.csv                          # Generated leads from scraper
└── README.md                          # This file
```

## 🎯 Features

✅ **Dynamic Dashboard** - Loads leads from CSV files in real-time
✅ **Professional Messaging** - Updated WhatsApp templates from AI Developer perspective
✅ **Search & Filter** - Find leads by name, phone, or address
✅ **Lead Tracking** - Track which leads have been contacted
✅ **Local Network Access** - Share dashboard with team members
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **No Database Required** - Pure CSV-based system

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14+ recommended)
- Google Places API Key (for lead scraping)
- Internet connection

### Step 1: Update Lead Scraper (One-time Setup)

The `lead-scraper.js` has been updated with:
- Improved WhatsApp message template (professional tone)
- Reference to https://nexcrafttech.com/ instead of test URL
- Multiple client projects mention
- Extended business categories and cities

### Step 2: Generate Fresh Leads (Optional)

If you want to scrape new leads:

```bash
cd "c:\Users\Anand\Desktop\project Idea\nexcrafttechwebsite\nexcrafttech\lead-scraper"

# Set your Google API key
$env:GOOGLE_API_KEY="YOUR_API_KEY_HERE"

# Run the scraper (may take 30+ minutes for all queries)
node lead-scraper.js
```

The scraper will save leads to `leads.csv`.

### Step 3: Update Existing Leads with New Messages

If you already have leads in `firstleads.csv`, update their WhatsApp messages:

```bash
node update-whatsapp-messages.js
```

This will:
- Read all leads from `firstleads.csv`
- Generate new WhatsApp links with updated messaging
- Save back to `firstleads.csv`

**Status**: ✅ Already completed - firstleads.csv has been updated with professional messages

### Step 4: Start the Dashboard Server

```bash
node server.js
```

You'll see output like:
```
================================================
🚀 WhatsApp Leads Dashboard Server Started
================================================

📍 Local Access:
   http://localhost:3000
   http://127.0.0.1:3000

🌐 Network Access (for other devices):
   http://192.168.x.x:3000
```

### Step 5: Access the Dashboard

**For you (local machine):**
```
http://localhost:3000
```

**For team members (same network):**
```
http://[YOUR_COMPUTER_IP]:3000
```

## 📊 Using the Dashboard

### Loading Leads
1. Dashboard automatically loads `firstleads.csv` on startup
2. If auto-load fails, click **📁 Load CSV File** to manually select a CSV

### Searching Leads
- Use the search box to filter by:
  - Business name
  - Phone number
  - Address/location

### Contacting Leads
1. Click **💬 Open WhatsApp** button
2. This opens WhatsApp with the pre-filled message
3. Review the message and send
4. The system automatically marks it as "Opened" ✓

### Tracking Progress
- View statistics at the top:
  - **Total Leads**: All leads in the file
  - **Valid WhatsApp Links**: Leads with phone numbers
  - **Opened Leads**: Leads you've contacted

## 📝 CSV File Format

Your CSV must have this header:
```
NAME,PHONE,ADDRESS,WHATSAPP_LINK
```

Example:
```
NAME,PHONE,ADDRESS,WHATSAPP_LINK
BLUE HOMES INTERIORS,096770 67989,"1st Cross St, MGR Nagar, Lakshmi Nagar, Velachery, Chennai, Tamil Nadu 600042, India",https://wa.me/919677067989?text=...
```

## 💬 WhatsApp Message Template

The current message represents you as an **Individual AI & Web Developer**:

```
Hi [Name],

I'm Anand, an AI & Web Developer specializing in custom web solutions.

I noticed your business doesn't have a dedicated online presence yet. 
A professional website can significantly help attract more customers 
and establish credibility.

I've successfully built and currently manage multiple client projects, 
including portfolio sites, service platforms, and e-commerce solutions.

Check out my work and completed projects:
https://nexcrafttech.com/

I can create a custom, modern website tailored to your business needs. 
I also offer a free consultation to understand your requirements.

Looking forward to working with you!
```

To modify the message, edit the `createWhatsAppLink()` function in:
- `lead-scraper.js` (for new scrapes)
- `update-whatsapp-messages.js` (for updating existing leads)

## 🔧 Running in the Background

### Windows - Using Task Scheduler

1. Open Task Scheduler
2. Create new task
3. Set trigger: "At startup"
4. Set action: Run `node.exe` with arguments: `C:\path\to\server.js`

### Windows - Using NPM Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dashboard": "node server.js",
    "scrape": "node lead-scraper.js",
    "update-messages": "node update-whatsapp-messages.js"
  }
}
```

Then run:
```bash
npm run dashboard
```

### Continuous Running (Production)

For production, use PM2:

```bash
npm install -g pm2

# Start
pm2 start server.js --name "leads-dashboard"

# Auto-start on reboot
pm2 startup
pm2 save

# View logs
pm2 logs
```

## 🌐 Firewall Configuration

To allow team members to access from other machines:

**Windows Defender Firewall:**
1. Go to "Advanced settings"
2. Click "Inbound Rules"
3. Create new rule for port 3000
4. Set action to "Allow"

## 📋 Workflow for Team Usage

1. **Lead Generator** runs `lead-scraper.js` to generate leads.csv
2. **Manager** consolidates leads into firstleads.csv
3. **Message Updater** runs `update-whatsapp-messages.js`
4. **Server** runs `server.js` 24/7
5. **Team members** access dashboard via network IP
6. **Team** uses dashboard to send WhatsApp messages
7. **Tracker** monitors progress via statistics

## 🛠️ Troubleshooting

### Dashboard doesn't load on first try
- Check if `firstleads.csv` exists in the same folder
- Ensure CSV file is properly formatted
- Check browser console (F12) for errors

### Can't access from other computers
- Ensure server is running
- Check firewall settings
- Verify network IP is correct: `ipconfig` command
- Test with: `http://[IP]:3000` in browser

### WhatsApp message not pre-filling
- Verify CSV WHATSAPP_LINK column has valid URLs
- Run `update-whatsapp-messages.js` to regenerate links

### Server won't start
- Ensure port 3000 is not in use
- Try different port: `PORT=8080 node server.js`
- Check Node.js installation: `node --version`

## 📈 Performance Tips

- Keep CSV files under 5000 rows for fast loading
- Use the search feature to filter large datasets
- Archive old leads into separate files
- Store CSV files locally (not on network drive)

## 🔒 Security Notes

- Dashboard only reads CSV files - no database
- Search/tracking data stored in browser only (localStorage)
- Server runs only on local network access
- Consider VPN for remote team access

## 📞 Support

For issues or questions, refer to:
- Google Places API: https://developers.google.com/maps/documentation
- Node.js: https://nodejs.org/
- WhatsApp Business API: https://www.whatsapp.com/business/

---

**Made with ❤️ by NexCraftTech**

For professional web development services, visit: https://nexcrafttech.com/
