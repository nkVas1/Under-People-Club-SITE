# Under People Club - Cyberpunk Community Platform

<div align="center">

![Under People](https://via.placeholder.com/400x100.png?text=UNDER+PEOPLE+CLUB)

**A dark cyberpunk community platform for students and enthusiasts**

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Deployment](#deployment) • [Documentation](#documentation)

</div>

## Overview

Under People Club is a comprehensive web platform designed for managing a student community with a unique dark cyberpunk aesthetic. It combines:

- 🎭 **Immersive UI/UX** with cinematic animations
- 🎮 **Collectible Card Game (TCG)** with P2P marketplace
- 💰 **Economy System** with internal currency (UP Coins)
- 🌐 **Telegram Integration** for seamless authentication
- 📊 **Referral System** with rewards
- 🏆 **Leaderboards** and achievement tracking

## Features

### Phase 1: Genesis - Visual Foundation
- Pulsating intro animation
- Melting logo transition
- Dramatic column-based navigation
- Grunge/cyberpunk aesthetic

### Phase 2: Identification - User System
- Telegram Widget authentication
- Personal cabinet (Shelter)
- QR-code generation for event access
- User profile and statistics

### Phase 3: Arsenal - E-commerce
- Product catalog (tickets, merchandise)
- Custom payment flow via Telegram Bot
- Order tracking
- Cashback system with UP Coins

### Phase 4: Raid - Gaming
- Collectible Card Game (TCG)
- Card packs with rarity system
- P2P marketplace
- Real-time trading

### Phase 5: Legacy - Social & Timeline
- Event timeline with photo galleries
- User directory with filtering
- Achievement system
- Network building features

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP, Three.js (3D effects)
- **State**: Zustand
- **UI**: Custom components with cyberpunk design

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Bot**: Aiogram (Telegram)
- **API**: RESTful with OpenAPI docs

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend), Heroku/VPS (Backend)
- **Monitoring**: Logs & Health Checks

## Architecture

```
under-people-platform/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   │   ├── intro/          # Intro animations
│   │   ├── layout/         # Navigation & layouts
│   │   ├── dashboard/      # User profile
│   │   ├── arsenal/        # Shop
│   │   ├── game/           # TCG UI
│   │   ├── chronicles/     # Timeline
│   │   └── social/         # User directory
│   ├── store/              # Zustand state
│   ├── lib/                # Utilities
│   └── public/             # Assets
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── core/           # Config, security
│   │   ├── models/         # SQLAlchemy ORM
│   │   ├── routers/        # API endpoints
│   │   ├── db/             # Database setup
│   │   └── main.py         # App entry point
│   └── bot/                # Telegram bot
│       └── handlers/       # Command handlers
│
├── docs/                    # Documentation
├── docker-compose.yml      # Container orchestration
└── .github/                # GitHub workflows
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone repository**
```bash
git clone https://github.com/yourusername/under-people-platform.git
cd under-people-platform
```

2. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Visit `http://localhost:3000`

3. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m app.main
```
API available at `http://localhost:8000`
Docs at `http://localhost:8000/docs`

### Using Docker Compose

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Check status
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy with `npm run build`

See [Vercel Deployment Guide](docs/DEPLOYMENT_VERCEL.md)

### Backend (Heroku/Railway/VPS)

1. Create PostgreSQL database
2. Set environment variables
3. Deploy using Docker

See [Backend Deployment Guide](docs/DEPLOYMENT_BACKEND.md)

## Configuration

### Environment Variables

**Frontend** (`.env.local`)
```
NEXT_PUBLIC_API_URL=https://api.underpeople.club
NEXT_PUBLIC_BOT_NAME=under_people_bot
```

**Backend** (`.env`)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
TELEGRAM_BOT_TOKEN=your_token_here
SECRET_KEY=your_secret_key
REDIS_URL=redis://localhost:6379
```

## Development

### Code Structure

- **Frontend**: React components with TypeScript
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL with SQLAlchemy migrations
- **Real-time**: WebSocket ready (for future features)

### Running Tests

```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && pytest
```

### Linting & Formatting

```bash
# Frontend
npm run lint

# Backend
pylint app/
black app/
```

## Documentation

- [Architecture Decision Records](docs/ADR.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Telegram Bot Setup](docs/TELEGRAM_BOT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/yourusername/under-people-platform/issues)
- 💬 [Discussions](https://github.com/yourusername/under-people-platform/discussions)
- 🌐 [Website](https://underpeople.club)

## Credits

**Created by OdinLab Studios**

- Design & Concept
- Full-stack Development
- Deployment & Infrastructure

---

<div align="center">

**© 2025 Under People Club. All rights reserved.**

*"Welcome to the Under. Where the night is endless and the community is eternal."*

</div>
