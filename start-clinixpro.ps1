# ClinixPro Hospital Pharmacy System - Complete Startup Script
# Author: Leandre
# Version: 1.0.0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ClinixPro Hospital Pharmacy System" -ForegroundColor Yellow
Write-Host "Complete Startup Script" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17+ and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Maven is installed
try {
    $mvnVersion = mvn -version | Select-String "Apache Maven"
    Write-Host "✓ Maven found: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "All prerequisites are satisfied!" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Build backend if needed
if (-not (Test-Path "backend\target")) {
    Write-Host "Building backend..." -ForegroundColor Yellow
    Set-Location backend
    mvn clean compile
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Backend compilation failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ..
}

Write-Host ""
Write-Host "Starting ClinixPro System..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Start backend in a new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run" -WindowStyle Normal

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start frontend in a new window
Write-Host "Starting Frontend Application..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ClinixPro is starting up!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:8080" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "API Health: http://localhost:8080/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Please wait for both services to fully start..." -ForegroundColor Yellow
Write-Host "Backend typically takes 30-60 seconds to start" -ForegroundColor Gray
Write-Host "Frontend typically takes 10-20 seconds to start" -ForegroundColor Gray
Write-Host ""

# Wait for user input
Read-Host "Press Enter to open the application in your browser"

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "ClinixPro is now running!" -ForegroundColor Green
Write-Host "Close this window when you're done." -ForegroundColor Yellow
Write-Host ""

# Keep the window open
Read-Host "Press Enter to exit" 