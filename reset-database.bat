@echo off
echo ========================================
echo ClinixPro Database Reset Script
echo ========================================
echo.
echo This script will reset your database and initialize it with secure user credentials.
echo.
echo Default users will be created with BCrypt hashed passwords:
echo - Admin: admin@clinixpro.com (password: admin123)
echo - Doctor: doctor@clinixpro.com (password: doctor123)
echo - Pharmacist: pharmacist@clinixpro.com (password: pharmacist123)
echo - Receptionist: receptionist@clinixpro.com (password: receptionist123)
echo.
echo WARNING: This will delete all existing data!
echo.
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Database reset cancelled.
    pause
    exit /b 1
)

echo.
echo Resetting database...
echo.

REM Check if PostgreSQL is running
pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo ERROR: PostgreSQL is not running or not accessible.
    echo Please start PostgreSQL and try again.
    pause
    exit /b 1
)

REM Reset the database
psql -U postgres -f reset-database.sql

if errorlevel 1 (
    echo.
    echo ERROR: Database reset failed!
    echo Please check your PostgreSQL installation and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database reset completed successfully!
echo ========================================
echo.
echo You can now start the ClinixPro application.
echo.
pause 