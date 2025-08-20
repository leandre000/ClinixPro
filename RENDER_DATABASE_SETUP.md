# 🔧 Render Database Setup Guide

## ❌ **Current Issue**
The automatic database environment variable mapping in `render.yaml` isn't working. The application is still trying to connect to `YOUR_DATABASE_HOST` instead of the actual Render database.

## ✅ **Manual Setup Required**

### **Step 1: Get Your Database Credentials**
1. Go to your Render dashboard
2. Find your PostgreSQL database service named `clinixpro-db`
3. Click on it to open the details page
4. Copy these values:
   - **External Database URL** (hostname)
   - **Database Name**
   - **Username**
   - **Password**

### **Step 2: Set Environment Variables in Render**
1. Go to your web service (`clinixpro-backend`)
2. Click on **Environment** tab
3. Add these environment variables manually:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://[YOUR_DB_HOST]:5432/clinixpro
SPRING_DATASOURCE_USERNAME=clinixpro_user
SPRING_DATASOURCE_PASSWORD=[YOUR_DB_PASSWORD]
```

### **Step 3: Replace Placeholders**
Replace the placeholders with your actual values:
- `[YOUR_DB_HOST]` → Your database hostname (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
- `[YOUR_DB_PASSWORD]` → Your database password

### **Step 4: Example Configuration**
Your environment variables should look like this:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-abc123-a.oregon-postgres.render.com:5432/clinixpro
SPRING_DATASOURCE_USERNAME=clinixpro_user
SPRING_DATASOURCE_PASSWORD=your_actual_password_here
```

### **Step 5: Redeploy**
1. Click **Save Changes**
2. Render will automatically redeploy your service
3. Monitor the logs for successful database connection

## 🔍 **Verification**
After setting the environment variables, you should see:
- ✅ `HikariPool-1 - Starting...` followed by success
- ✅ `Started PharmacyApplication`
- ✅ No more `UnknownHostException: YOUR_DATABASE_HOST`

## 📋 **Complete Environment Variables List**
Make sure you have all these variables set in Render:

```bash
# Application
SPRING_PROFILES_ACTIVE=production
SERVER_SERVLET_CONTEXT_PATH=/api

# Database (SET THESE MANUALLY)
SPRING_DATASOURCE_URL=jdbc:postgresql://[YOUR_DB_HOST]:5432/clinixpro
SPRING_DATASOURCE_USERNAME=clinixpro_user
SPRING_DATASOURCE_PASSWORD=[YOUR_DB_PASSWORD]
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# JWT
JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS
ALLOWED_ORIGINS=https://clinixpro.vercel.app,https://clinixpro.com,http://localhost:3000
SPRING_WEB_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
SPRING_WEB_CORS_ALLOWED_HEADERS=*
SPRING_WEB_CORS_ALLOW_CREDENTIALS=true

# Application Info
APP_NAME=ClinixPro
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
```

## 🆘 **Troubleshooting**
If you still have issues:
1. **Check database service status** - Make sure it's running
2. **Verify credentials** - Double-check username/password
3. **Test connection** - Try connecting from Render's shell
4. **Check logs** - Look for specific error messages
