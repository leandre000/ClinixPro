@echo off
echo Starting ClinixPro Backend Server...
echo ======================================

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

REM Navigate to backend directory
cd backend

REM Clean and compile
echo Building backend...
mvn clean compile

if %errorlevel% neq 0 (
    echo ERROR: Backend compilation failed
    pause
    exit /b 1
)

REM Start the application
echo Starting backend server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

mvn spring-boot:run

pause 