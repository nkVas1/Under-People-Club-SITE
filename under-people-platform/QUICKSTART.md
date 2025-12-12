# 🚀 QUICK START GUIDE

**Welcome to Under People Club!** Here's everything you need to get started.

---

## ⚡ 30-Second Setup (Recommended)

### Prerequisites
- Docker Desktop ([download here](https://www.docker.com/products/docker-desktop))
- That's it! Everything else is containerized.

### Start Development

**Windows:**
```powershell
start-dev.bat
```

**macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Manual:**
```bash
cp backend/.env.example backend/.env
docker-compose up -d
```

✅ **Done!** Services running at:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

---

## 🎯 What's Next?

### 1. Configure Telegram Bot

You need a Telegram bot to enable login:

1. Open Telegram, find [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow instructions
3. Copy your **Bot Token**
4. Edit `backend/.env`:
   ```env
   TELEGRAM_BOT_TOKEN=YOUR_TOKEN_HERE
   TELEGRAM_BOT_NAME=your_bot_name
   ```
5. Restart Docker: `docker-compose restart api`

### 2. View the Application

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs (interactive)
- **Database**: Admin panel coming soon

### 3. Check Logs

```bash
docker-compose logs -f           # All services
docker-compose logs -f api       # Just API
docker-compose logs -f web       # Just Frontend
```

### 4. Stop Everything

```bash
docker-compose down              # Stop containers
docker-compose down -v           # Stop & remove volumes (reset DB)
```

---

## 📚 Full Documentation

- **Development**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Telegram Bot**: [docs/TELEGRAM_BOT.md](docs/TELEGRAM_BOT.md)
- **API Reference**: [docs/API.md](docs/API.md)
- **Database Schema**: [docs/DATABASE.md](docs/DATABASE.md)

---

## 🏗️ Project Structure

```
under-people-platform/
├── frontend/              # Next.js web app
├── backend/              # FastAPI server
├── docs/                 # Documentation
├── docker-compose.yml    # Container setup
└── README.md             # Full guide
```

---

## ⚙️ Common Tasks

### Restart Services
```bash
docker-compose restart
```

### View Database
```bash
# Access PostgreSQL directly
docker-compose exec db psql -U underadmin -d underworld
```

### View Logs
```bash
docker-compose logs -f
```

### Reset Database
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Ports Already in Use?
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Docker Not Starting?
```bash
# Check Docker status
docker ps

# Rebuild everything
docker-compose up -d --build
```

### Database Connection Error?
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

## 💬 Need Help?

- 📖 Read the [full README.md](README.md)
- 📚 Check [docs/](docs/) folder
- 🐛 Open an [issue on GitHub](https://github.com/yourusername/under-people-platform/issues)
- 💬 Start a [discussion](https://github.com/yourusername/under-people-platform/discussions)

---

## 🎭 Ready to Explore?

Your Under People Club development environment is ready!

**Next Steps:**
1. ✅ Services running (Docker)
2. 🔑 Configure Telegram Bot (if not done)
3. 🌐 Open http://localhost:3000
4. 📖 Explore the codebase
5. 🚀 Start building!

**Questions?** Check the [documentation](docs/) or ask the community.

---

**Made with 🖤 by OdinLab Studios**

*"Welcome to the Under. Where the night is endless and the community is eternal."*
