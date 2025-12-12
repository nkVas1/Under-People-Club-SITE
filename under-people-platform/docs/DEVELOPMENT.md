# Development Setup Guide

## Prerequisites

- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Python 3.11+ ([python.org](https://www.python.org))
- PostgreSQL 15+ ([postgresql.org](https://www.postgresql.org))
- Redis 7+ ([redis.io](https://redis.io))

## Quick Start (Docker)

The easiest way to set up the project:

```bash
git clone https://github.com/yourusername/under-people-platform.git
cd under-people-platform

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

Services available:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

## Manual Setup

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit environment variables
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_BOT_NAME=your_bot_name

# Start development server
npm run dev

# Visit http://localhost:3000
```

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit environment variables
# DATABASE_URL=postgresql://user:pass@localhost:5432/underworld
# TELEGRAM_BOT_TOKEN=your_token_here
# SECRET_KEY=your_secret_key

# Create database
createdb underworld

# Run migrations (if using Alembic)
alembic upgrade head

# Start server
python -m app.main

# Visit http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE underworld;
CREATE USER under_admin WITH PASSWORD 'your_password';
ALTER ROLE under_admin SET client_encoding TO 'utf8';
ALTER ROLE under_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE under_admin SET default_transaction_deferrable TO on;
ALTER ROLE under_admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE underworld TO under_admin;
\q
```

### Initialize Schema

```bash
cd backend
python -m app.models.models  # Auto-creates tables
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BOT_NAME=your_bot_name
```

### Backend (.env)

```env
DATABASE_URL=postgresql://under_admin:your_password@localhost:5432/underworld
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_NAME=your_bot_name
SECRET_KEY=your_secret_key_here
REDIS_URL=redis://localhost:6379
DEBUG=True
```

## Development Tools

### Code Formatting

**Frontend:**
```bash
cd frontend
npm run lint     # Check code
npm run format   # Auto-format code
```

**Backend:**
```bash
cd backend
black app/      # Format Python code
pylint app/     # Check code quality
```

### Testing

**Frontend:**
```bash
cd frontend
npm run test    # Run tests
npm run test:watch  # Watch mode
```

**Backend:**
```bash
cd backend
pytest          # Run tests
pytest -v       # Verbose
pytest --cov    # Coverage report
```

## Useful Commands

### Docker

```bash
# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v

# Rebuild images
docker-compose up -d --build
```

### Frontend

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Backend

```bash
# Run server
python -m app.main

# Run with reload
uvicorn app.main:app --reload

# Run tests
pytest -xvs

# Database migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000        # Frontend
lsof -i :8000        # Backend
lsof -i :5432        # Database
lsof -i :6379        # Redis

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U under_admin -d underworld

# Check if Redis is running
redis-cli ping
```

### Dependencies Issues

```bash
# Frontend
npm ci              # Clean install
npm cache clean --force

# Backend
pip install --upgrade pip
pip install --force-reinstall -r requirements.txt
```

## Project Structure

```
under-people-platform/
├── frontend/              # Next.js app
│   ├── app/              # Pages and layouts
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities
│   ├── store/            # Zustand stores
│   └── package.json
├── backend/              # FastAPI app
│   ├── app/
│   │   ├── core/        # Configuration
│   │   ├── models/      # ORM models
│   │   ├── routers/     # API routes
│   │   └── main.py      # Entry point
│   ├── bot/             # Telegram bot
│   └── requirements.txt
└── docker-compose.yml    # Docker configuration
```

---

**Need help?** Check the [docs](../docs/) folder or open an issue on GitHub.
