# ClinixPro Render Deployment Guide

## 🚀 Backend Deployment to Render

### Prerequisites
- Render account (free tier available)
- GitHub repository connected to Render
- PostgreSQL database (Render provides this)

### Step 1: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name:** `clinixpro-backend`
   - **Environment:** `Java`
   - **Region:** Choose closest to your users
   - **Branch:** `main` or `master`
   - **Root Directory:** `backend` (if your backend is in a subdirectory)

   **Build & Deploy:**
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/*.jar`
   - **Auto-Deploy:** ✅ Enabled

5. **Click "Create Web Service"**

### Step 2: Configure Environment Variables

In your Render service dashboard, go to **Environment** tab and add:

```bash
# Required Environment Variables
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Database Configuration (will be auto-populated)
DATABASE_URL=from_database_service
DATABASE_USERNAME=from_database_service
DATABASE_PASSWORD=from_database_service

# CORS Configuration
ALLOWED_ORIGINS=https://clinixpro.vercel.app,https://clinixpro.com,http://localhost:3000
SPRING_WEB_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
SPRING_WEB_CORS_ALLOWED_HEADERS=*
SPRING_WEB_CORS_ALLOW_CREDENTIALS=true

# Email Configuration (update with your email service)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Application Configuration
APP_NAME=ClinixPro
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
```

### Step 3: Create PostgreSQL Database

1. **In Render Dashboard, click "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name:** `clinixpro-db`
   - **Database:** `clinixpro`
   - **User:** `clinixpro_user`
   - **Plan:** `Free` (or paid for production)
3. **Click "Create Database"**
4. **Copy the connection details**

### Step 4: Link Database to Backend

1. **Go back to your backend service**
2. **In Environment tab, click "Link Database"**
3. **Select your `clinixpro-db`**
4. **Render will auto-populate:**
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`

### Step 5: Deploy Frontend to Vercel

1. **Push your updated code to GitHub**
2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
3. **Import your repository**
4. **Configure:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (root of your project)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. **Deploy**

### Step 6: Update Frontend API Configuration

Your `vercel.json` is already configured to point to:
```json
"NEXT_PUBLIC_API_URL": "https://clinixpro-backend.onrender.com/api"
```

### Step 7: Test the Integration

1. **Test Backend Health:**
   ```
   GET https://clinixpro-backend.onrender.com/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try logging in/registering
   - Check browser console for API calls

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Maven wrapper permissions: `chmod +x mvnw`
   - Verify Java version (17 required)
   - Check build logs in Render

2. **Database Connection Fails:**
   - Verify database is running
   - Check environment variables
   - Ensure database is linked to service

3. **CORS Errors:**
   - Verify `ALLOWED_ORIGINS` includes your Vercel domain
   - Check backend CORS configuration

4. **Health Check Fails:**
   - Verify `/api/health` endpoint exists
   - Check application startup logs

### Monitoring:

- **Render Dashboard:** Monitor service health, logs, and performance
- **Vercel Dashboard:** Monitor frontend deployments and performance
- **Application Logs:** Check Render service logs for backend issues

## 🚀 Production Considerations

1. **Upgrade Plans:**
   - Consider paid plans for production workloads
   - Enable auto-scaling for high traffic

2. **Custom Domain:**
   - Configure custom domain in Render
   - Update CORS origins accordingly

3. **SSL/HTTPS:**
   - Render provides free SSL certificates
   - Vercel provides free SSL certificates

4. **Backup:**
   - Enable database backups in Render
   - Regular code backups to GitHub

## 📱 Final URLs

- **Backend API:** `https://clinixpro-backend.onrender.com/api`
- **Frontend:** `https://clinixpro.vercel.app` (or your custom domain)
- **Health Check:** `https://clinixpro-backend.onrender.com/api/health`

## ✅ Success Checklist

- [ ] Backend deployed to Render
- [ ] Database created and linked
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] API integration working
- [ ] Health check endpoint responding
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] All features functional

Your ClinixPro application is now fully deployed and ready for production! 🎉
