@echo off
echo ========================================
echo Hospital Pharmacy Management System
echo Backend Setup Script
echo ========================================
echo.

echo Step 1: Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo Java is installed successfully!
echo.

echo Step 2: Checking Maven installation...
mvn -version
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven
    pause
    exit /b 1
)
echo Maven is installed successfully!
echo.

echo Step 3: Checking PostgreSQL connection...
echo Testing connection to PostgreSQL on port 5434...
psql -h localhost -p 5434 -U postgres -d postgres -c "SELECT version();" > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to PostgreSQL
    echo Please ensure PostgreSQL is running on port 5434
    echo Username: postgres, Password: leandre
    pause
    exit /b 1
)
echo PostgreSQL connection successful!
echo.

echo Step 4: Creating database if it doesn't exist...
psql -h localhost -p 5434 -U postgres -d postgres -c "CREATE DATABASE pharmacydb;" > nul 2>&1
if %errorlevel% equ 0 (
    echo Database 'pharmacydb' created successfully!
) else (
    echo Database 'pharmacydb' already exists or creation failed
)
echo.

echo Step 5: Installing Maven dependencies...
cd backend
mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Maven build failed
    pause
    exit /b 1
)
echo Maven dependencies installed successfully!
echo.

echo Step 6: Starting the backend server...
echo The backend will start on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
mvn spring-boot:run

pause 