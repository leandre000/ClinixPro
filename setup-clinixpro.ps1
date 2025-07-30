# ClinixPro - Complete Setup Script
# This script sets up the entire ClinixPro Hospital Pharmacy Management System

Write-Host "========================================" -ForegroundColor Green
Write-Host "ClinixPro Setup Script" -ForegroundColor Green
Write-Host "Hospital Pharmacy Management System" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Java installation
Write-Host "Step 1: Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java is installed successfully!" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 2: Check Maven installation
Write-Host "Step 2: Checking Maven installation..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version 2>&1
    Write-Host "✅ Maven is installed successfully!" -ForegroundColor Green
    Write-Host $mavenVersion[0] -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 3: Check Node.js installation
Write-Host "Step 3: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -version 2>&1
    Write-Host "✅ Node.js is installed successfully!" -ForegroundColor Green
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 4: Check PostgreSQL connection
Write-Host "Step 4: Checking PostgreSQL connection..." -ForegroundColor Yellow
Write-Host "Testing connection to PostgreSQL on port 5434..." -ForegroundColor Cyan
try {
    $testConnection = psql -h localhost -p 5434 -U postgres -d postgres -c "SELECT version();" 2>$null
    Write-Host "✅ PostgreSQL connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Cannot connect to PostgreSQL" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is running on port 5434" -ForegroundColor Red
    Write-Host "Username: postgres, Password: leandre" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 5: Create database
Write-Host "Step 5: Creating ClinixPro database..." -ForegroundColor Yellow
try {
    $createDB = psql -h localhost -p 5434 -U postgres -d postgres -c "CREATE DATABASE clinixpro;" 2>$null
    Write-Host "✅ Database 'clinixpro' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Database 'clinixpro' already exists or creation failed" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Install backend dependencies
Write-Host "Step 6: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    Write-Host "Cleaning and compiling backend..." -ForegroundColor Cyan
    mvn clean compile
    Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Backend build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 7: Install frontend dependencies
Write-Host "Step 7: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..
try {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
    npm install
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Frontend dependencies installation failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 8: Start services
Write-Host "Step 8: Starting ClinixPro services..." -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 10

# Start frontend in background
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 ClinixPro Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API Test: http://localhost:3000/api-test" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Default Login Credentials:" -ForegroundColor Cyan
Write-Host "   Admin: admin@clinixpro.com / password" -ForegroundColor White
Write-Host ""
Write-Host "📊 Database: clinixpro (PostgreSQL on port 5434)" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Both backend and frontend servers are starting..." -ForegroundColor Green
Write-Host "   Please wait a moment for services to fully initialize." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this setup script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 