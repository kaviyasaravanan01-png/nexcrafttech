@echo off
rem Run Lead Scraper

echo.
echo ================================================
echo Lead Scraper - Google Places
echo ================================================
echo.

cd /d "%~dp0"

echo ⚠️  IMPORTANT: You need a Google Places API key
echo.
echo Steps:
echo 1. Get API key from: https://developers.google.com/maps
echo 2. Set environment variable: set GOOGLE_API_KEY=YOUR_KEY
echo.

echo 🔍 Checking for GOOGLE_API_KEY environment variable...

if not defined GOOGLE_API_KEY (
    echo ❌ ERROR: GOOGLE_API_KEY not set
    echo.
    echo To set it for this session, run:
    echo set GOOGLE_API_KEY=your_key_here
    echo.
    pause
    exit /b 1
)

echo ✅ API key found!
echo.
echo ⏱️  Starting lead scraper...
echo ⚠️  This may take 30+ minutes to complete
echo.

node lead-scraper.js

echo.
echo ✅ Scraping complete! Check leads.csv for results
echo.
pause
