#!/bin/bash

# ClinixPro Hospital Pharmacy Management System - Production Build Script
# Author: Leandre
# Version: 1.0.0

set -e  # Exit on any error

echo "🏥 ClinixPro Hospital Pharmacy Management System"
echo "🚀 Starting Production Build Process..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking build requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 17+"
        exit 1
    fi
    
    # Check Maven
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven"
        exit 1
    fi
    
    print_success "All build requirements are satisfied"
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    
    # Clean frontend
    if [ -d "frontend/.next" ]; then
        rm -rf frontend/.next
    fi
    
    # Clean backend
    if [ -d "backend/target" ]; then
        rm -rf backend/target
    fi
    
    # Clean node_modules (optional, uncomment if needed)
    # if [ -d "node_modules" ]; then
    #     rm -rf node_modules
    # fi
    
    print_success "Build directories cleaned"
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    if [ -f "package.json" ]; then
        npm ci --production=false
        print_success "Frontend dependencies installed"
    else
        print_warning "No package.json found in root directory"
    fi
}

# Build frontend
build_frontend() {
    print_status "Building frontend application..."
    
    if [ -f "package.json" ]; then
        # Set production environment
        export NODE_ENV=production
        export NEXT_PUBLIC_API_URL=https://api.clinixpro.com
        
        # Build the application
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Frontend build completed successfully"
        else
            print_error "Frontend build failed"
            exit 1
        fi
    else
        print_warning "No package.json found, skipping frontend build"
    fi
}

# Run frontend tests
test_frontend() {
    print_status "Running frontend tests..."
    
    if [ -f "package.json" ]; then
        # Run linting
        npm run lint
        
        if [ $? -eq 0 ]; then
            print_success "Frontend linting passed"
        else
            print_warning "Frontend linting issues found"
        fi
    else
        print_warning "No package.json found, skipping frontend tests"
    fi
}

# Build backend
build_backend() {
    print_status "Building backend application..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Clean and compile
        mvn clean compile
        
        if [ $? -eq 0 ]; then
            print_success "Backend compilation completed"
        else
            print_error "Backend compilation failed"
            exit 1
        fi
        
        cd ..
    else
        print_warning "Backend directory not found"
    fi
}

# Run backend tests
test_backend() {
    print_status "Running backend tests..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Run tests
        mvn test
        
        if [ $? -eq 0 ]; then
            print_success "Backend tests passed"
        else
            print_error "Backend tests failed"
            exit 1
        fi
        
        cd ..
    else
        print_warning "Backend directory not found, skipping tests"
    fi
}

# Package backend
package_backend() {
    print_status "Packaging backend application..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Create JAR package
        mvn package -DskipTests
        
        if [ $? -eq 0 ]; then
            print_success "Backend packaged successfully"
            
            # Copy JAR to root for deployment
            cp target/*.jar ../clinixpro-backend.jar
            print_success "Backend JAR copied to root directory"
        else
            print_error "Backend packaging failed"
            exit 1
        fi
        
        cd ..
    else
        print_warning "Backend directory not found"
    fi
}

# Create production configuration
create_production_config() {
    print_status "Creating production configuration..."
    
    # Create production environment file
    cat > .env.production << EOF
# ClinixPro Production Environment Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.clinixpro.com
NEXT_PUBLIC_APP_NAME=ClinixPro
NEXT_PUBLIC_APP_VERSION=1.0.0

# Database Configuration (to be set by deployment)
DATABASE_URL=postgresql://clinixpro:password@localhost:5432/clinixpro_prod
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=clinixpro_prod
DATABASE_USER=clinixpro
DATABASE_PASSWORD=secure_password_here

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRATION=86400000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=clinixpro@hospital.com
SMTP_PASSWORD=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/uploads

# Security Configuration
CORS_ORIGINS=https://clinixpro.com,https://www.clinixpro.com
SESSION_SECRET=your-super-secure-session-secret-here
EOF
    
    print_success "Production configuration created"
}

# Create Docker files
create_docker_files() {
    print_status "Creating Docker configuration files..."
    
    # Frontend Dockerfile
    cat > Dockerfile.frontend << 'EOF'
# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
EOF

    # Backend Dockerfile
    cat > Dockerfile.backend << 'EOF'
# Backend Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy JAR file
COPY clinixpro-backend.jar app.jar

# Create non-root user
RUN addgroup --system --gid 1001 clinixpro
RUN adduser --system --uid 1001 clinixpro

# Change ownership
RUN chown clinixpro:clinixpro /app/app.jar
USER clinixpro

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_OPTS="-Xmx512m -Xms256m"

CMD ["java", "-jar", "app.jar"]
EOF

    # Docker Compose for development
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: clinixpro-postgres
    environment:
      POSTGRES_DB: clinixpro
      POSTGRES_USER: clinixpro
      POSTGRES_PASSWORD: clinixpro_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - clinixpro-network

  # Backend API
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: clinixpro-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/clinixpro
      SPRING_DATASOURCE_USERNAME: clinixpro
      SPRING_DATASOURCE_PASSWORD: clinixpro_password
      SPRING_PROFILES_ACTIVE: production
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - clinixpro-network

  # Frontend Application
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: clinixpro-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/api
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - clinixpro-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: clinixpro-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - clinixpro-network

volumes:
  postgres_data:

networks:
  clinixpro-network:
    driver: bridge
EOF

    print_success "Docker configuration files created"
}

# Create Nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8080;
    }

    server {
        listen 80;
        server_name clinixpro.com www.clinixpro.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name clinixpro.com www.clinixpro.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/clinixpro.crt;
        ssl_certificate_key /etc/nginx/ssl/clinixpro.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API routes
        location /api/ {
            proxy_pass http://backend/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check
        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }
    }
}
EOF

    print_success "Nginx configuration created"
}

# Create deployment script
create_deployment_script() {
    print_status "Creating deployment script..."
    
    cat > deploy.sh << 'EOF'
#!/bin/bash

# ClinixPro Deployment Script
# Author: Leandre
# Version: 1.0.0

set -e

echo "🚀 Deploying ClinixPro Hospital Pharmacy Management System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images
echo "🧹 Cleaning old images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."

# Check backend health
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 ClinixPro deployment completed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080/api"
echo "📊 Health Check: http://localhost:8080/api/health"
EOF

    chmod +x deploy.sh
    print_success "Deployment script created"
}

# Create README for production
create_production_readme() {
    print_status "Creating production README..."
    
    cat > PRODUCTION_README.md << 'EOF'
# ClinixPro Hospital Pharmacy Management System - Production Deployment

## Overview
ClinixPro is a comprehensive hospital pharmacy management system designed for healthcare facilities to manage patients, medicines, appointments, and billing efficiently.

## System Requirements

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recommended)
- **Storage**: 50GB+ SSD
- **Network**: Stable internet connection

### Software Requirements
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **PostgreSQL**: 13+ (if not using Docker)
- **Node.js**: 18+ (if not using Docker)
- **Java**: 17+ (if not using Docker)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/clinixpro.git
cd clinixpro
```

### 2. Configure Environment
```bash
# Copy and edit production configuration
cp .env.production .env
nano .env
```

### 3. Deploy with Docker
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 4. Access the Application
- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/api/health

## Configuration

### Environment Variables
Key environment variables to configure:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_PASSWORD=secure_password_here

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### SSL Certificate
For production, obtain an SSL certificate and place it in the `ssl/` directory:
- `ssl/clinixpro.crt` - SSL certificate
- `ssl/clinixpro.key` - Private key

## Security Considerations

### 1. Database Security
- Use strong, unique passwords
- Enable SSL connections
- Regular backups
- Access control

### 2. Application Security
- Change default JWT secret
- Use HTTPS only
- Implement rate limiting
- Regular security updates

### 3. Server Security
- Firewall configuration
- SSH key authentication
- Regular system updates
- Monitoring and logging

## Monitoring

### Health Checks
- Application health: `/api/health`
- Database connectivity
- Service status

### Logs
```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Performance Monitoring
- CPU and memory usage
- Database performance
- Response times
- Error rates

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U clinixpro clinixpro > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U clinixpro clinixpro < backup.sql
```

### Application Backup
- Configuration files
- Uploaded files
- SSL certificates
- Environment variables

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify network connectivity
   - Check database service status

2. **Application Won't Start**
   - Check environment variables
   - Verify port availability
   - Check Docker logs

3. **SSL Certificate Issues**
   - Verify certificate validity
   - Check file permissions
   - Restart Nginx service

### Support
For technical support, contact:
- Email: support@clinixpro.com
- Documentation: https://docs.clinixpro.com
- Issues: https://github.com/your-org/clinixpro/issues

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Version
ClinixPro v1.0.0
EOF

    print_success "Production README created"
}

# Main build process
main() {
    echo "🏥 ClinixPro Production Build Process"
    echo "====================================="
    
    # Check requirements
    check_requirements
    
    # Clean previous builds
    clean_builds
    
    # Install dependencies
    install_frontend_deps
    
    # Run tests
    test_frontend
    test_backend
    
    # Build applications
    build_frontend
    build_backend
    
    # Package backend
    package_backend
    
    # Create production files
    create_production_config
    create_docker_files
    create_nginx_config
    create_deployment_script
    create_production_readme
    
    echo ""
    echo "🎉 Production build completed successfully!"
    echo "=========================================="
    echo "📦 Build artifacts:"
    echo "   - Frontend: .next/ (built)"
    echo "   - Backend: clinixpro-backend.jar"
    echo "   - Docker: Dockerfile.frontend, Dockerfile.backend"
    echo "   - Config: .env.production, nginx.conf"
    echo "   - Scripts: deploy.sh"
    echo ""
    echo "🚀 To deploy:"
    echo "   1. Configure .env.production"
    echo "   2. Run: ./deploy.sh"
    echo ""
    echo "🌐 Access URLs:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend: http://localhost:8080/api"
    echo "   - Health: http://localhost:8080/api/health"
}

# Run main function
main "$@" 