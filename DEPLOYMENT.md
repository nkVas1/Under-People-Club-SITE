# 🎮 Under People Club: Production Deployment Guide

**Status:** ✅ READY FOR PRODUCTION  
**Last Updated:** December 27, 2025

---

## 🚀 QUICK START (5 минут)

### 1️⃣ STEP 1: Vercel Environment Variables (2 мин)

```
https://vercel.com
  ↓
Settings → Environment Variables
  ↓
NEXT_PUBLIC_API_URL = https://upcworldbot-production.up.railway.app
  ↓
Redeploy Project
```

**Полная инструкция:** [VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md)

### 2️⃣ STEP 2: Backend CORS (2 мин)

```python
# main.py
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=['https://under-people-club.vercel.app', 'http://localhost:3000'])
```

```bash
# Push на GitHub (Railway автоматически обновится)
git add . && git commit -m "CORS: добавить конфигурацию" && git push
```

### 3️⃣ STEP 3: Диагностика (1 мин)

```
https://under-people-club.vercel.app/debug
  ↓
Нажимаем "🚀 Run Full Diagnostics"
  ↓
Ждём все ✅ (зелёные)
```

---

## 📚 Полная Документация

| Документ | Назначение | Время |
|----------|-----------|-------|
| [QUICK_START_5MIN.md](docs/QUICK_START_5MIN.md) | 5-минутный гайд deployment | 5 мин |
| [VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md) | Vercel переменные step-by-step | 2 мин |
| [COMPLETE_CORS_DEBUG_GUIDE.md](docs/COMPLETE_CORS_DEBUG_GUIDE.md) | Полная отладка CORS ошибок | 10 мин |
| [BACKEND_CORS_SETUP.md](docs/BACKEND_CORS_SETUP.md) | Примеры кода для Flask/FastAPI | 5 мин |
| [README_COMPLETE.md](docs/README_COMPLETE.md) | Полная документация проекта | 15 мин |

---

## 🔗 Production URLs

```
🌐 Frontend:     https://under-people-club.vercel.app
🤖 Backend:      https://upcworldbot-production.up.railway.app
📱 Telegram Bot: @upc_world_bot
🔍 Диагностика:  https://under-people-club.vercel.app/debug
```

---

## ✅ Pre-Launch Checklist

- [ ] Vercel NEXT_PUBLIC_API_URL установлена
- [ ] Redeploy завершился (статус "Ready")
- [ ] Backend CORS добавлен
- [ ] Backend пересоберан (Railway deploy успешен)
- [ ] Диагностика `/debug` показывает все ✅
- [ ] Авторизация работает на production

---

## 📋 Если Ошибка

### 1️⃣ Откройте диагностику

```
https://under-people-club.vercel.app/debug
```

### 2️⃣ Посмотрите какой error

- **"Environment Variables error"** → [VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md)
- **"CORS Configuration error"** → [BACKEND_CORS_SETUP.md](docs/BACKEND_CORS_SETUP.md)
- **"Backend Connectivity error"** → Railway logs
- **Другие ошибки** → [COMPLETE_CORS_DEBUG_GUIDE.md](docs/COMPLETE_CORS_DEBUG_GUIDE.md)

---

## 🎯 Architecture Overview

```
┌─────────────────────┐
│  User's Browser     │
└──────────┬──────────┘
           │ https
           ↓
┌─────────────────────────────────────┐
│  Vercel: Next.js Frontend           │
│  https://under-people-club.app      │
└──────────┬──────────────────────────┘
           │ API Request (with JWT)
           ↓
┌─────────────────────────────────────┐
│  Railway: Python Backend            │
│  https://backend.railway.app        │
└──────────┬──────────────────────────┘
           │ SQL
           ↓
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  Railway Managed                    │
└─────────────────────────────────────┘
```

---

## 🛠️ Development Setup

### Local Development

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
python main.py

# Terminal 2: Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm install
npm run dev

# Open http://localhost:3000 in browser
```

---

## 📞 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check CORS in backend (Step 2) |
| "API URL NOT CONFIGURED" | Check Vercel variables (Step 1) |
| "504 Gateway Timeout" | Railway backend not responding → check logs |
| Long loading | Check network tab in DevTools |

### Get Help

1. Check error message in browser console (F12)
2. Check `/debug` page diagnostics
3. Check Vercel Logs (Deployments → Function Logs)
4. Check Railway Logs (Deployments → Logs)
5. Follow [COMPLETE_CORS_DEBUG_GUIDE.md](docs/COMPLETE_CORS_DEBUG_GUIDE.md)

---

## 📦 Project Structure

```
Under-People-Club-SITE/
├── frontend/                    # Next.js App
│   ├── app/
│   │   ├── page.tsx            # Landing
│   │   ├── shelter/            # Main Game
│   │   ├── auth/callback/      # OAuth Handler
│   │   └── debug/              # Diagnostics
│   ├── components/             # React Components
│   ├── store/                  # Zustand Auth Store
│   └── lib/
│       └── apiClient.ts        # API Client with JWT
│
├── backend/                     # Python API
│   ├── main.py                 # Entry Point
│   ├── routes/                 # API Endpoints
│   ├── models/                 # DB Models
│   └── requirements.txt
│
└── docs/                        # Documentation
    ├── QUICK_START_5MIN.md
    ├── VERCEL_ENV_SETUP.md
    ├── BACKEND_CORS_SETUP.md
    ├── COMPLETE_CORS_DEBUG_GUIDE.md
    └── README_COMPLETE.md
```

---

## 🎓 Key Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 14.2.35 |
| React | 18.3.1 | |
| Styling | Tailwind CSS | 3.4.1 |
| State | Zustand | 4.4.7 |
| Animations | GSAP | 3.12.2 |
| Backend | Flask/FastAPI | Latest |
| Database | PostgreSQL | 14+ |
| Hosting Frontend | Vercel | Latest |
| Hosting Backend | Railway | Managed |
| Bot | Telegram | Bot API |

---

## 🔐 Security Notes

- JWT tokens stored in localStorage
- CORS whitelist configured for production domain
- Environment variables for sensitive data
- HTTPS enforced on production
- HMAC-SHA256 validation for Telegram data

---

## ✨ Final Checklist

Before considering deployment complete:

- [ ] All documentation reviewed
- [ ] Environment variables configured
- [ ] CORS setup completed
- [ ] Local testing passed
- [ ] Diagnostics page shows all ✅
- [ ] Production URLs working
- [ ] Git commits pushed
- [ ] Team notified of deployment

---

## 🎉 You're Ready!

Once all steps are complete, your application is production-ready!

```
✅ Frontend: Vercel
✅ Backend: Railway  
✅ Database: PostgreSQL
✅ Authentication: Telegram WebApp
✅ API: Fully Integrated
✅ Diagnostics: Available
```

---

**Last Updated:** December 27, 2025  
**Version:** 1.0.0 Production Ready  
**Status:** ✅ DEPLOYED

For detailed information, see [README_COMPLETE.md](docs/README_COMPLETE.md)

