# Hospital Pharmacy Management System Backend Setup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "Hospital Pharmacy Management System" -ForegroundColor Green
Write-Host "Backend Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Java installation
Write-Host "Step 1: Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java is installed successfully!" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 2: Check Maven installation
Write-Host "Step 2: Checking Maven installation..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version 2>&1
    Write-Host "Maven is installed successfully!" -ForegroundColor Green
    Write-Host $mavenVersion[0] -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 3: Check PostgreSQL connection
Write-Host "Step 3: Checking PostgreSQL connection..." -ForegroundColor Yellow
Write-Host "Testing connection to PostgreSQL on port 5434..." -ForegroundColor Cyan
try {
    $testConnection = psql -h localhost -p 5434 -U postgres -d postgres -c "SELECT version();" 2>$null
    Write-Host "PostgreSQL connection successful!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot connect to PostgreSQL" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is running on port 5434" -ForegroundColor Red
    Write-Host "Username: postgres, Password: leandre" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 4: Create database if it doesn't exist
Write-Host "Step 4: Creating database if it doesn't exist..." -ForegroundColor Yellow
try {
    $createDB = psql -h localhost -p 5434 -U postgres -d postgres -c "CREATE DATABASE clinixpro;" 2>$null
    Write-Host "Database 'clinixpro' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Database 'clinixpro' already exists or creation failed" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Install Maven dependencies
Write-Host "Step 5: Installing Maven dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    mvn clean install -DskipTests
    Write-Host "Maven dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Maven build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 6: Start the backend server
Write-Host "Step 6: Starting the backend server..." -ForegroundColor Yellow
Write-Host "The backend will start on http://localhost:8080" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""
mvn spring-boot:run 