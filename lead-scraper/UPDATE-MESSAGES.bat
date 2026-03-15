@echo off
rem Update WhatsApp Messages in CSV

echo.
echo ================================================
echo Update WhatsApp Messages - Batch Update
echo ================================================
echo.

cd /d "%~dp0"

echo ✅ Updating WhatsApp messages in firstleads.csv...
echo.

node update-whatsapp-messages.js

echo.
echo ✅ Update complete!
echo.
pause
