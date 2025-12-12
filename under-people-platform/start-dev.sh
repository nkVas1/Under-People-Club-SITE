#!/bin/bash
# Development startup script for Under People Club

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════╗"
    echo "║     UNDER PEOPLE CLUB - Development Setup     ║"
    echo "║         Cyberpunk Community Platform          ║"
    echo "╚═══════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}→ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        return 0
    else
        print_warning "Docker not found. Install from https://docker.com"
        return 1
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        return 0
    else
        print_warning "Docker Compose not found"
        return 1
    fi
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        version=$(node -v)
        print_success "Node.js $version is installed"
        return 0
    else
        print_warning "Node.js not found. Install from https://nodejs.org"
        return 1
    fi
}

# Check if Python is installed
check_python() {
    if command -v python3 &> /dev/null; then
        version=$(python3 --version)
        print_success "Python $version is installed"
        return 0
    else
        print_warning "Python3 not found"
        return 1
    fi
}

# Main setup
setup_environment() {
    print_banner
    
    print_info "Checking environment..."
    echo ""
    
    check_docker || true
    check_docker_compose || true
    check_node || true
    check_python || true
    
    echo ""
    
    # Copy environment files if they don't exist
    if [ ! -f "backend/.env" ]; then
        print_info "Creating backend/.env from template..."
        cp backend/.env.example backend/.env
        print_warning "Edit backend/.env with your configuration"
    fi
    
    if [ ! -f "frontend/.env.local" ]; then
        print_info "Creating frontend/.env.local from template..."
        cp frontend/.env.example frontend/.env.local
    fi
    
    echo ""
    print_info "Starting services with Docker Compose..."
    docker-compose up -d
    
    echo ""
    print_success "Services started!"
    echo ""
    echo "Available at:"
    echo -e "${BLUE}  Frontend:  http://localhost:3000${NC}"
    echo -e "${BLUE}  API:       http://localhost:8000${NC}"
    echo -e "${BLUE}  API Docs:  http://localhost:8000/docs${NC}"
    echo -e "${BLUE}  Database:  localhost:5432${NC}"
    echo -e "${BLUE}  Redis:     localhost:6379${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Edit backend/.env with your Telegram bot token"
    echo "  2. Visit http://localhost:3000 in your browser"
    echo "  3. Check logs: docker-compose logs -f"
    echo ""
}

# Stop services
cleanup() {
    print_info "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Main execution
case "${1:-start}" in
    start)
        setup_environment
        ;;
    stop)
        cleanup
        ;;
    restart)
        cleanup
        sleep 2
        setup_environment
        ;;
    logs)
        docker-compose logs -f
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs}"
        echo ""
        echo "  start   - Start development environment (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - View Docker logs"
        exit 1
        ;;
esac
