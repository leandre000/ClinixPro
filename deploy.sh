#!/bin/bash

# ClinixPro Production Deployment Script
# This script deploys the entire ClinixPro application stack

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ClinixPro"
VERSION="1.0.0"
DOCKER_COMPOSE_FILE="docker-compose.yml"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to create SSL certificates (self-signed for development)
create_ssl_certificates() {
    print_status "Creating SSL certificates..."
    
    if [ ! -d "ssl" ]; then
        mkdir -p ssl
    fi
    
    if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
        print_warning "Creating self-signed SSL certificates for development..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=ClinixPro/CN=localhost"
        print_success "SSL certificates created!"
    else
        print_success "SSL certificates already exist!"
    fi
}

# Function to set environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# ClinixPro Production Environment Variables
DATABASE_PASSWORD=leandre
JWT_SECRET=clinixpro-hospital-management-system-jwt-secret-key-2024-enterprise-grade-security-production
ALLOWED_ORIGINS=http://localhost:3000,https://clinixpro.com
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
        print_success "Environment file created!"
    else
        print_success "Environment file already exists!"
    fi
}

# Function to build and deploy
deploy() {
    print_status "Starting deployment of $APP_NAME v$VERSION..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
}

# Function to check service health
check_service_health() {
    print_status "Checking service health..."
    
    # Check database
    if docker-compose exec -T postgres pg_isready -U postgres -d clinixpro &> /dev/null; then
        print_success "Database is healthy!"
    else
        print_error "Database health check failed!"
        return 1
    fi
    
    # Check backend
    if curl -f http://localhost:8080/api/health &> /dev/null; then
        print_success "Backend API is healthy!"
    else
        print_error "Backend API health check failed!"
        return 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is healthy!"
    else
        print_error "Frontend health check failed!"
        return 1
    fi
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    docker-compose ps
    echo ""
    print_status "Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080/api"
    echo "  Database: localhost:5434"
    echo ""
    print_status "Default Login Credentials:"
    echo "  Admin: admin@clinixpro.com / admin123"
    echo "  Doctor: doctor@clinixpro.com / doctor123"
    echo "  Pharmacist: pharmacist@clinixpro.com / pharmacist123"
    echo "  Receptionist: receptionist@clinixpro.com / receptionist123"
}

# Function to show logs
show_logs() {
    print_status "Showing service logs..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped!"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed!"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_prerequisites
        create_ssl_certificates
        setup_environment
        deploy
        show_status
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_services
        ;;
    "cleanup")
        cleanup
        ;;
    "restart")
        stop_services
        deploy
        show_status
        ;;
    *)
        echo "Usage: $0 {deploy|status|logs|stop|cleanup|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy the entire application stack"
        echo "  status   - Show deployment status and service URLs"
        echo "  logs     - Show service logs"
        echo "  stop     - Stop all services"
        echo "  cleanup  - Stop services and clean up volumes"
        echo "  restart  - Restart all services"
        exit 1
        ;;
esac 