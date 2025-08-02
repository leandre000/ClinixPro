# Hospital Pharmacy Management System - Setup Instructions

## Prerequisites

Before setting up the system, ensure you have the following installed:

1. **Java 17 or higher**
2. **Maven 3.6+**
3. **PostgreSQL 12+**
4. **Node.js 18+**
5. **npm or yarn**

## Database Setup

### 1. PostgreSQL Configuration
Your PostgreSQL is configured with:
- **Port**: 5434
- **Username**: postgres
- **Password**: leandre

### 2. Create Database
```sql
-- Connect to PostgreSQL
psql -h localhost -p 5434 -U postgres

-- Create the database
CREATE DATABASE clinixpro;

-- Verify the database was created
\l

-- Exit psql
\q
```

## Backend Setup

### Option 1: Using the Setup Script (Recommended)

#### For Windows (Command Prompt):
```cmd
setup-backend.bat
```

#### For Windows (PowerShell):
```powershell
.\setup-backend.ps1
```

### Option 2: Manual Setup

#### 1. Navigate to Backend Directory
```cmd
cd backend
```

#### 2. Install Maven Dependencies
```cmd
mvn clean install -DskipTests
```

#### 3. Start the Backend Server
```cmd
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

### 1. Install Node.js Dependencies
```cmd
npm install
```

### 2. Start the Frontend Development Server
```cmd
npm run dev
```

The frontend will start on `http://localhost:3000`

## Verification Steps

### 1. Test Backend Connection
Visit: `http://localhost:8080/actuator/health`

Expected response:
```json
{
  "status": "UP"
}
```

### 2. Test Frontend Connection
Visit: `http://localhost:3000`

You should see the login page.

### 3. Test API Connection
Visit: `http://localhost:3000/api-test`

This page will show the connection status between frontend and backend.

## Default Login Credentials

After the first startup, the following accounts are automatically created:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Pharmacist | pharmacist@hospital.com | pharmacist123 |
| Receptionist | receptionist@hospital.com | receptionist123 |

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Ensure PostgreSQL is running on port 5434
- Verify username: `postgres` and password: `leandre`
- Check if the `clinixpro` database exists

#### 2. Maven Build Failed
- Ensure Java 17+ is installed and in PATH
- Ensure Maven is installed and in PATH
- Try running `mvn clean` before `mvn install`

#### 3. Frontend Cannot Connect to Backend
- Ensure backend is running on port 8080
- Check CORS configuration in `application.properties`
- Verify the API proxy configuration in `next.config.js`

#### 4. Port Already in Use
- Backend port 8080: Change in `application.properties`
- Frontend port 3000: Change in `package.json` scripts

### Database Reset (if needed)

If you need to reset the database:

```sql
-- Connect to PostgreSQL
psql -h localhost -p 5434 -U postgres

-- Drop and recreate the database
DROP DATABASE IF EXISTS clinixpro;
CREATE DATABASE clinixpro;

-- Exit
\q
```

Then restart the backend server.

## Development Commands

### Backend Development
```cmd
# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR file
mvn clean package
```

### Frontend Development
```cmd
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## File Structure

```
pharmastock/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Configuration files
│   │   └── test/           # Test files
│   ├── pom.xml             # Maven configuration
│   └── setup-backend.bat   # Setup script
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── package.json           # Node.js dependencies
├── next.config.js         # Next.js configuration
└── setup-backend.ps1      # PowerShell setup script
```

## Environment Variables

The system uses the following environment variables:

### Backend (.env or application.properties)
- `spring.datasource.url`: Database connection URL
- `spring.datasource.username`: Database username
- `spring.datasource.password`: Database password
- `jwt.secret`: JWT secret key
- `jwt.expiration`: JWT expiration time

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080)

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all services are running on the correct ports
4. Check the database connection
5. Review the troubleshooting section above

## Security Notes

- Change default passwords after first login
- Update JWT secret in production
- Configure proper CORS settings for production
- Use HTTPS in production environment
- Regularly update dependencies for security patches 