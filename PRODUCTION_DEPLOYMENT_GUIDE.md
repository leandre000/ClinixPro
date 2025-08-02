# 🚀 ClinixPro Production Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying ClinixPro Hospital Pharmacy Management System in a production environment with proper security, performance, and monitoring.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Frontend      │    │   Backend API   │
│   (Port 80/443) │───▶│   (Port 3000)   │───▶│   (Port 8080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   PostgreSQL    │
                                              │   (Port 5434)   │
                                              └─────────────────┘
```

## 🔧 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended) or Windows with WSL2
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 20GB free space
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Software Installation

#### 1. Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

#### 2. Install Docker Compose
```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Windows
# Included with Docker Desktop
```

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd clinixPro

# Make deployment script executable
chmod +x deploy.sh

# Deploy the entire stack
./deploy.sh deploy
```

### Option 2: Manual Deployment
```bash
# 1. Set up environment
cp env.example .env
# Edit .env with your production values

# 2. Create SSL certificates
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=ClinixPro/CN=your-domain.com"

# 3. Deploy with Docker Compose
docker-compose up -d
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_PASSWORD=your-secure-password
DATABASE_URL=jdbc:postgresql://postgres:5432/clinixpro

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=production
```

### Production Configuration Files

#### 1. Backend Production Config (`backend/src/main/resources/application-prod.properties`)
- Optimized database connection pooling
- Production logging levels
- Security headers
- Performance optimizations

#### 2. Frontend Production Config (`next.config.js`)
- Security headers
- Performance optimizations
- API proxy configuration
- Image optimization

#### 3. Nginx Configuration (`nginx.conf`)
- SSL/TLS configuration
- Rate limiting
- Security headers
- Load balancing

## 🔐 Security Configuration

### 1. SSL/TLS Certificates

For production, use proper SSL certificates:

```bash
# Using Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
```

### 2. Database Security
```sql
-- Create dedicated database user
CREATE USER clinixpro_user WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE clinixpro TO clinixpro_user;
```

### 3. Firewall Configuration
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080/api/health`
- **Database**: `docker-compose exec postgres pg_isready -U postgres`

### Monitoring Commands
```bash
# Check service status
./deploy.sh status

# View logs
./deploy.sh logs

# Monitor resource usage
docker stats

# Check container health
docker-compose ps
```

## 🔄 Deployment Commands

### Available Commands
```bash
./deploy.sh deploy    # Deploy the entire stack
./deploy.sh status    # Show deployment status
./deploy.sh logs      # Show service logs
./deploy.sh stop      # Stop all services
./deploy.sh restart   # Restart all services
./deploy.sh cleanup   # Stop and clean up volumes
```

### Manual Docker Commands
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# Update and restart
docker-compose pull
docker-compose up -d
```

## 🗄️ Database Management

### Reset Database
```bash
# Using the provided script
./reset-database.bat    # Windows
./reset-database.ps1    # PowerShell
psql -U postgres -f reset-database.sql  # Linux/Mac
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres clinixpro > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres clinixpro < backup.sql
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :8080
sudo netstat -tulpn | grep :3000

# Kill processes if needed
sudo kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d clinixpro -c "SELECT 1;"
```

#### 3. Memory Issues
```bash
# Check available memory
free -h

# Increase Docker memory limit in Docker Desktop settings
```

#### 4. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Regenerate certificates
rm ssl/cert.pem ssl/key.pem
./deploy.sh deploy
```

### Log Analysis
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs postgres

# Nginx logs
docker-compose logs nginx
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON clinixpro.users(email);
CREATE INDEX idx_patients_status ON clinixpro.patients(status);
CREATE INDEX idx_medicines_stock ON clinixpro.medicines(stock);
```

### 2. Application Optimization
- Enable caching in production
- Use CDN for static assets
- Optimize images
- Enable compression

### 3. System Optimization
```bash
# Increase file descriptors
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# Optimize kernel parameters
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
sysctl -p
```

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh restart

# Or manually
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Regular Maintenance
```bash
# Clean up unused Docker resources
docker system prune -f

# Update base images
docker-compose pull

# Monitor disk usage
df -h
```

## 📞 Support & Documentation

### Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@clinixpro.com | admin123 |
| **Doctor** | doctor@clinixpro.com | doctor123 |
| **Pharmacist** | pharmacist@clinixpro.com | pharmacist123 |
| **Receptionist** | receptionist@clinixpro.com | receptionist123 |

### Service URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5434
- **Health Check**: http://localhost:8080/api/health

### Documentation Files
- `DATABASE_RESET_GUIDE.md` - Database reset instructions
- `INTEGRATION_STATUS.md` - Integration status report
- `ClinixPro_API_Endpoints.md` - API documentation
- `TROUBLESHOOTING.md` - Troubleshooting guide

## ⚠️ Security Notes

1. **Change Default Passwords**: Immediately change all default passwords after deployment
2. **Use Strong JWT Secrets**: Generate strong, unique JWT secrets for production
3. **Enable HTTPS**: Always use HTTPS in production
4. **Regular Updates**: Keep all components updated
5. **Backup Strategy**: Implement regular database backups
6. **Monitoring**: Set up proper monitoring and alerting

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database secured with strong passwords
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Default passwords changed
- [ ] Health checks passing
- [ ] Performance optimized
- [ ] Security headers enabled

---

**Note**: This deployment guide is for production use. For development, use the simpler setup instructions in the main README. 