@echo off
rem Quick Start Dashboard Server for Windows

echo.
echo ================================================
echo WhatsApp Leads Dashboard - Quick Start
echo ================================================
echo.

rem Change to script directory
cd /d "%~dp0"

echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found

echo.
echo 📂 Starting Dashboard Server...
echo.
echo Accessing the dashboard:
echo   Local: http://localhost:3000
echo   Network: http://%COMPUTERNAME%:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
