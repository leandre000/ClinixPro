# 🔧 Render Manual Setup Guide

## ❌ **Current Issue**
The automatic database environment variable mapping in `render.yaml` isn't working. The application is still failing to connect to the database.

## ✅ **Manual Setup Required**

### **Step 1: Create PostgreSQL Database in Render**
1. Go to your Render dashboard
2. Click **"New"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `clinixpro-db`
   - **Database**: `clinixpro_db`
   - **User**: `clinixpro_user`
   - **Plan**: Starter (Free)
4. Click **"Create Database"**

### **Step 2: Get Database Credentials**
1. Click on your newly created database service
2. Copy these values from the **"Connections"** section:
   - **External Database URL** (hostname)
   - **Database Name**
   - **Username**
   - **Password**

### **Step 3: Create Web Service**
1. Go back to dashboard
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `clinixpro-backend`
   - **Environment**: Java
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Plan**: Starter (Free)

### **Step 4: Set Environment Variables**
In your web service, go to **"Environment"** tab and add these variables:

```bash
# Application Configuration
SPRING_PROFILES_ACTIVE=production
SERVER_SERVLET_CONTEXT_PATH=/api

# Database Configuration (REPLACE WITH YOUR ACTUAL VALUES)
SPRING_DATASOURCE_URL=jdbc:postgresql://[YOUR_DB_HOST]:5432/clinixpro_db
SPRING_DATASOURCE_USERNAME=clinixpro_user
SPRING_DATASOURCE_PASSWORD=[YOUR_DB_PASSWORD]
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# JWT Configuration
JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS Configuration
ALLOWED_ORIGINS=https://clinixpro.vercel.app,https://clinixpro.com,http://localhost:3000
SPRING_WEB_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
SPRING_WEB_CORS_ALLOWED_HEADERS=*
SPRING_WEB_CORS_ALLOW_CREDENTIALS=true

# Application Info
APP_NAME=ClinixPro
APP_VERSION=1.0.0
APP_ENVIRONMENT=production

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=clinixpro@hospital.com
MAIL_PASSWORD=your-app-password
```

### **Step 5: Replace Database Placeholders**
Replace the placeholders with your actual database values:
- `[YOUR_DB_HOST]` → Your database hostname (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
- `[YOUR_DB_PASSWORD]` → Your database password

### **Step 6: Example Configuration**
Your database variables should look like this:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-abc123-a.oregon-postgres.render.com:5432/clinixpro_db
SPRING_DATASOURCE_USERNAME=clinixpro_user
SPRING_DATASOURCE_PASSWORD=your_actual_password_here
```

### **Step 7: Deploy**
1. Click **"Save Changes"**
2. Render will automatically deploy your service
3. Monitor the logs for successful startup

## 🔍 **Verification**
After setting the environment variables, you should see:
- ✅ `HikariPool-1 - Starting...` followed by success
- ✅ `Started PharmacyApplication`
- ✅ No more `PSQLException: The connection attempt failed`

## 🆘 **Troubleshooting**
If you still have issues:
1. **Check database service status** - Make sure it's running
2. **Verify credentials** - Double-check username/password
3. **Test connection** - Try connecting from Render's shell
4. **Check logs** - Look for specific error messages

## 📋 **Important Notes**
- The `render.yaml` file is now simplified and doesn't use automatic database mapping
- You must manually set all environment variables in the Render dashboard
- The database name uses underscores (`clinixpro_db`) not hyphens
- Make sure both services (database and web) are in the same Render account
