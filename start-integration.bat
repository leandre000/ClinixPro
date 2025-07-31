@echo off
echo ========================================
echo    ClinixPro Integration Startup
echo ========================================
echo.

echo Starting Backend (Spring Boot)...
echo.
cd backend
start "ClinixPro Backend" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
echo.
start "ClinixPro Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Services Starting...
echo ========================================
echo.
echo Backend:  http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Default Login Credentials:
echo Email:    admin@clinixpro.com
echo Password: password
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Integration startup complete!
echo Both services should now be running.
echo.
pause 