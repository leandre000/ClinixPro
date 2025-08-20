# ClinixPro Environment Variables for Render

## 🚀 Essential Environment Variables for Render Deployment

Copy these variables into your Render service dashboard under the **Environment** tab:

### **Required Environment Variables:**

```bash
# Application Configuration
APP_NAME=ClinixPro
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
NODE_ENV=production

# Server Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api
SPRING_PROFILES_ACTIVE=production

# JWT Configuration
JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS Configuration
ALLOWED_ORIGINS=https://clinixpro.vercel.app,https://clinixpro.com,http://localhost:3000
SPRING_WEB_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
SPRING_WEB_CORS_ALLOWED_HEADERS=*
SPRING_WEB_CORS_ALLOW_CREDENTIALS=true

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=clinixpro@hospital.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=clinixpro@hospital.com
MAIL_FROM_NAME=ClinixPro System

# Security Configuration
SECURITY_USER=admin
SECURITY_PASSWORD=admin123
BCRYPT_ROUNDS=12

# File Upload Configuration
MAX_FILE_SIZE=10485760
MAX_REQUEST_SIZE=10485760
UPLOAD_DIRECTORY=uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Logging Configuration
LOG_LEVEL=WARN
LOG_FILE_PATH=logs/clinixpro.log
LOG_MAX_SIZE=10MB
LOG_MAX_FILES=5

# Cache Configuration
CACHE_TYPE=caffeine
CACHE_MAX_SIZE=1000
CACHE_EXPIRE_AFTER_WRITE=1800
CACHE_EXPIRE_AFTER_ACCESS=900

# Monitoring Configuration
ENABLE_HEALTH_CHECK=true
ENABLE_METRICS=true
ENABLE_ACTUATOR=true
HEALTH_CHECK_PATH=/api/health

# Development Tools (disable in production)
ENABLE_DEV_TOOLS=false
ENABLE_H2_CONSOLE=false
ENABLE_SWAGGER=false

# Performance Configuration
DATABASE_CONNECTION_POOL_SIZE=20
DATABASE_CONNECTION_TIMEOUT=30000
DATABASE_IDLE_TIMEOUT=600000
DATABASE_MAX_LIFETIME=1800000

# Feature Flags
ENABLE_USER_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_TWO_FACTOR_AUTH=false
ENABLE_AUDIT_LOGGING=true
```

### **Database Variables (Auto-populated by Render):**

These will be automatically set when you link your database:
- `DATABASE_URL`
- `DATABASE_USERNAME` 
- `DATABASE_PASSWORD`

### **Frontend Environment Variables (for Vercel):**

```bash
NEXT_PUBLIC_API_URL=https://clinixpro-backend.onrender.com/api
NEXT_PUBLIC_APP_NAME=ClinixPro
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENVIRONMENT=production
```

## 🔧 How to Set These in Render:

1. **Go to your Render service dashboard**
2. **Click on the "Environment" tab**
3. **Click "Add Environment Variable"**
4. **Add each variable one by one**
5. **Click "Save Changes"**

## ⚠️ Important Notes:

- **JWT_SECRET**: Change this to a unique, secure key for production
- **MAIL_PASSWORD**: Use your actual email app password
- **Database variables**: Will be auto-populated when you link the database
- **CORS origins**: Update with your actual Vercel domain after deployment

## 🚀 After Setting Variables:

1. **Redeploy your service**
2. **Check the logs for any errors**
3. **Test the health endpoint**: `/api/health`
4. **Verify CORS is working**
5. **Test database connection**
