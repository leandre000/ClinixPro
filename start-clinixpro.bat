@echo off
echo ========================================
echo ClinixPro Hospital Pharmacy System
echo Complete Startup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17+ and try again
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven and try again
    pause
    exit /b 1
)

echo All prerequisites are satisfied!
echo.

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

REM Build backend if needed
if not exist "backend\target" (
    echo Building backend...
    cd backend
    mvn clean compile
    if %errorlevel% neq 0 (
        echo ERROR: Backend compilation failed
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo Starting ClinixPro System...
echo ============================
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "ClinixPro Backend" cmd /k "cd backend && mvn spring-boot:run"

REM Wait a moment for backend to start
timeout /t 10 /nobreak >nul

REM Start frontend in a new window
echo Starting Frontend Application...
start "ClinixPro Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo ClinixPro is starting up!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo API Health: http://localhost:8080/api/health
echo.
echo Please wait for both services to fully start...
echo Backend typically takes 30-60 seconds to start
echo Frontend typically takes 10-20 seconds to start
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo ClinixPro is now running!
echo Close this window when you're done.
echo.
pause 