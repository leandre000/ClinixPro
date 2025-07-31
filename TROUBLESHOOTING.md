# ClinixPro Troubleshooting Guide

## Quick Start

### Option 1: Use the Complete Startup Script (Recommended)
```bash
# Windows (PowerShell)
.\start-clinixpro.ps1

# Windows (Command Prompt)
start-clinixpro.bat
```

### Option 2: Manual Startup
```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend
npm run dev
```

## Common Issues and Solutions

### 1. "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**Problem**: Frontend is receiving HTML instead of JSON from backend.

**Causes**:
- Backend server is not running
- Backend is running on wrong port
- Database connection issues
- Backend compilation errors

**Solutions**:

#### Check if Backend is Running
```bash
# Check if port 8080 is in use
netstat -an | findstr :8080

# Test backend health
curl http://localhost:8080/api/health
```

#### Start Backend Properly
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

#### Check Backend Logs
Look for these messages in the backend console:
- "Started PharmacyApplication" - Backend started successfully
- "HikariPool-1 - Starting..." - Database connection starting
- "HikariPool-1 - Start completed" - Database connected successfully

### 2. Database Connection Issues

**Problem**: Backend cannot connect to PostgreSQL.

**Solutions**:

#### Check PostgreSQL Installation
```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL if not running
pg_ctl start
```

#### Verify Database Configuration
Check `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5434/clinixpro
spring.datasource.username=postgres
spring.datasource.password=leandre
```

#### Create Database if Missing
```sql
CREATE DATABASE clinixpro;
```

### 3. Frontend Build Issues

**Problem**: Frontend fails to build or start.

**Solutions**:

#### Clear Cache and Reinstall Dependencies
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Check Node.js Version
```bash
node --version  # Should be 18+ for Next.js 15
npm --version
```

### 4. Port Conflicts

**Problem**: Port 3000 or 8080 is already in use.

**Solutions**:

#### Find and Kill Process Using Port
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

#### Use Different Ports
```bash
# Backend on different port
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081

# Frontend on different port
npm run dev -- -p 3001
```

### 5. Java/Maven Issues

**Problem**: Backend won't compile or start.

**Solutions**:

#### Check Java Version
```bash
java -version  # Should be 17+
mvn -version
```

#### Clean and Rebuild
```bash
cd backend
mvn clean
mvn compile
mvn spring-boot:run
```

### 6. Authentication Issues

**Problem**: Login fails or users can't authenticate.

**Solutions**:

#### Check User Data
The system creates default users on startup. Check if they exist:
- Email: admin@clinixpro.com, Password: admin123
- Email: doctor@clinixpro.com, Password: doctor123
- Email: pharmacist@clinixpro.com, Password: pharmacist123
- Email: receptionist@clinixpro.com, Password: receptionist123

#### Reset Database
```sql
-- Drop and recreate database
DROP DATABASE clinixpro;
CREATE DATABASE clinixpro;
```

### 7. CORS Issues

**Problem**: Frontend can't communicate with backend due to CORS.

**Solutions**:

#### Check CORS Configuration
Verify in `backend/src/main/resources/application.properties`:
```properties
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

### 8. Memory Issues

**Problem**: Backend runs out of memory or crashes.

**Solutions**:

#### Increase JVM Memory
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx2g -Xms1g"
```

## Health Checks

### Test Backend Health
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T12:00:00",
  "database": "Connected",
  "version": "1.0.0"
}
```

### Test Frontend Health
```bash
curl http://localhost:3000/api/health
```

### Test Database Connection
```bash
# Connect to PostgreSQL
psql -h localhost -p 5434 -U postgres -d clinixpro

# Check tables
\dt
```

## Log Files

### Backend Logs
- Console output when running `mvn spring-boot:run`
- Check for ERROR level messages
- Look for database connection messages

### Frontend Logs
- Browser Developer Tools Console (F12)
- Terminal where `npm run dev` is running
- Check for network errors in Network tab

## Environment Variables

### Required Environment Variables
```bash
# Backend
DATABASE_URL=postgresql://localhost:5434/clinixpro
JWT_SECRET=your-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Performance Issues

### Slow Backend Startup
- Check database connection
- Verify all dependencies are downloaded
- Consider using SSD storage

### Slow Frontend
- Clear browser cache
- Check network connectivity
- Verify backend response times

## Security Issues

### JWT Token Issues
- Check JWT secret configuration
- Verify token expiration settings
- Clear browser localStorage if needed

### Database Security
- Change default passwords
- Enable SSL connections
- Restrict database access

## Getting Help

### Debug Mode
Enable debug logging in `backend/src/main/resources/application.properties`:
```properties
logging.level.com.hospital.pharmacy=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Connection refused" | Backend not running | Start backend server |
| "Invalid credentials" | Wrong username/password | Use default credentials |
| "Database connection failed" | PostgreSQL not running | Start PostgreSQL |
| "Port already in use" | Another service using port | Kill process or change port |
| "Module not found" | Dependencies not installed | Run `npm install` |

### Support
If you continue to have issues:
1. Check this troubleshooting guide
2. Review the logs for specific error messages
3. Ensure all prerequisites are installed
4. Try the complete startup script
5. Create an issue with detailed error information

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space

### Recommended Requirements
- **OS**: Windows 11+, macOS 12+, Ubuntu 20.04+
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 10GB+ SSD

### Software Requirements
- **Node.js**: 18.0.0+
- **Java**: 17+
- **Maven**: 3.6+
- **PostgreSQL**: 13+
- **Git**: 2.30+ 