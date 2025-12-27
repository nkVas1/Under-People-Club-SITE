# 📚 Under People Club: Полная Документация

**Версия:** 1.0 Production Ready  
**Дата:** December 27, 2025  
**Статус:** ✅ Все компоненты готовы к запуску

---

## 📑 Оглавление

1. [Обзор Проекта](#обзор)
2. [Архитектура](#архитектура)
3. [Быстрый Старт](#быстрый-старт)
4. [Развертывание](#развертывание)
5. [Отладка](#отладка)
6. [FAQ](#faq)

---

## 🎯 Обзор {#обзор}

**Under People Club** - это Telegram Mini App для игры с экономикой, боевой системой и кланами.

### Ключевые Компоненты

| Компонент | Технология | Статус |
|-----------|-----------|--------|
| **Frontend** | Next.js 14, React 18, TypeScript | ✅ Production |
| **Backend** | Python (Flask/FastAPI) | ✅ Production |
| **БД** | PostgreSQL | ✅ Railway |
| **Бот** | Telegram (@upc_world_bot) | ✅ Working |
| **Хостинг Frontend** | Vercel | ✅ Production |
| **Хостинг Backend** | Railway | ✅ Production |

### URLs Production

```
🌐 Frontend:  https://under-people-club.vercel.app
🤖 Backend:   https://upcworldbot-production.up.railway.app
📱 Telegram:  @upc_world_bot
🔗 WebApp:    Открывается через кнопку в боте
```

---

## 🏗️ Архитектура {#архитектура}

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── shelter/                # Main game page
│   │   └── page.tsx
│   ├── profile/                # User profile
│   │   └── page.tsx
│   └── auth/callback/          # OAuth callback
│       └── page.tsx
├── components/
│   ├── auth/
│   │   └── TelegramAuth.tsx    # Login button
│   ├── game/                   # Game components
│   ├── common/                 # Shared components
│   └── ...
├── store/
│   └── authStore.ts           # Zustand auth store
├── lib/
│   ├── apiClient.ts           # API client with JWT
│   └── ...
└── package.json
```

### Backend (Python)

```
backend/
├── main.py                     # App entry point
├── routes/
│   ├── auth.py                # Telegram auth endpoints
│   ├── game.py                # Game logic routes
│   ├── user.py                # User management
│   └── ...
├── models/
│   └── database.py            # DB models
├── config.py                  # Configuration
├── requirements.txt           # Dependencies
└── .env                       # Environment variables
```

### Обмен Данными

```
User Device (Browser)
         ↓ (HTTPS)
   Telegram WebApp
         ↓ (Sends code)
   Vercel Frontend (Next.js)
         ↓ (JWT Token)
   Railway Backend (Python API)
         ↓ (Database)
   PostgreSQL Database
```

---

## 🚀 Быстрый Старт {#быстрый-старт}

### Для Разработки (Локально)

#### Backend Setup

```bash
# 1. Клонируйте проект
git clone https://github.com/yourusername/under-people-club.git
cd backend

# 2. Виртуальная среда
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Зависимости
pip install -r requirements.txt

# 4. .env файл
echo "BOT_TOKEN=your_bot_token_here" > .env
echo "DATABASE_URL=postgresql://user:pass@localhost/db" >> .env
echo "SECRET_KEY=your_secret_key" >> .env

# 5. БД миграции
python -m flask db upgrade

# 6. Запуск
python main.py
# Слушает на: http://localhost:8000
```

#### Frontend Setup

```bash
# 1. В отдельной папке/терминале
cd frontend

# 2. .env.local для разработки
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Зависимости
npm install

# 4. Запуск в режиме разработки
npm run dev
# Слушает на: http://localhost:3000
```

#### Тестирование

```bash
# 1. Откройте в браузере
http://localhost:3000/shelter

# 2. Нажмите "Войти через Telegram"

# 3. Бот откроется в WebApp

# 4. Проверьте консоль DevTools
# Должны видеть: 🔐 [AUTH CALLBACK] Starting auth flow
```

---

## 📦 Развертывание {#развертывание}

### Production Setup: 5 Минут

**Полная инструкция:** Смотрите [QUICK_START_5MIN.md](QUICK_START_5MIN.md)

#### Шаг 1: Vercel Environment Variables

```bash
# 1. https://vercel.com → under-people-club project
# 2. Settings → Environment Variables
# 3. Добавьте/проверьте:
#    NEXT_PUBLIC_API_URL = https://upcworldbot-production.up.railway.app
# 4. Redeploy
```

#### Шаг 2: Railway CORS Configuration

```python
# main.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'https://under-people-club.vercel.app',
    'http://localhost:3000'
])
```

```bash
# Push на GitHub
git add .
git commit -m "feat: добавить CORS конфигурацию"
git push origin main
# Railway автоматически пересоберет
```

#### Шаг 3: Диагностика

```bash
# Откройте в браузере
https://under-people-club.vercel.app/debug

# Нажмите "Run Full Diagnostics"
# Должны видеть все ✅ зелёные
```

#### Шаг 4: Тестирование

```bash
# 1. https://under-people-club.vercel.app/shelter
# 2. Нажмите "Войти через Telegram"
# 3. Проверьте что авторизация работает
```

---

## 🔧 Отладка {#отладка}

### Диагностические Инструменты

#### 1. Диагностическая Страница

```
https://under-people-club.vercel.app/debug
```

Автоматически проверяет:
- ✅ Environment переменные
- ✅ Backend connectivity
- ✅ CORS настройки
- ✅ Auth endpoint
- ✅ Browser storage

#### 2. Browser Console

```javascript
// При авторизации видите логи:
🔐 [AUTH CALLBACK] Starting auth flow
📨 [AUTH] Response status: 200
✅ [AUTH] Received data: {...}

// Или ошибки:
❌ [AUTH CALLBACK ERROR] Error: CORS/Network Error
```

#### 3. DevTools Network Tab

1. Откройте DevTools (F12)
2. Перейдите на Network tab
3. Нажмите "Войти через Telegram"
4. Найдите запрос к `/api/auth/callback`
5. Проверьте:
   - Status: должен быть 200
   - Response: должна быть JSON с `access_token`
   - Headers: должны быть CORS headers

#### 4. Vercel Logs

```
https://vercel.com → Deployments → [latest] → Function Logs
```

Показывает:
- Build errors
- Runtime errors
- Request logs

#### 5. Railway Logs

```
https://railway.app → Deployments → [latest] → Logs
```

Показывает:
- Backend errors
- Database queries
- Auth process details

### Частые Проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| "CORS/Network Error" | CORS не настроен | Добавить CORS на backend (STEP 2) |
| "API URL NOT CONFIGURED" | Vercel переменная пуста | Добавить в Vercel → Redeploy (STEP 1) |
| "Server Error (404)" | Эндпоинт не создан | Создать `/api/auth/callback` |
| "Token missing in response" | Backend возвращает неполный JSON | Проверить что backend возвращает `access_token` |
| "Long loading" | Backend не отвечает | Проверить Railway logs |

### Полный Гайд Отладки

**Детальная инструкция:** Смотрите [COMPLETE_CORS_DEBUG_GUIDE.md](COMPLETE_CORS_DEBUG_GUIDE.md)

---

## ❓ FAQ {#faq}

### Q: Как добавить новый эндпоинт на backend'е?

**A:** 

```python
from flask import Blueprint, jsonify, request

# Создайте blueprint
api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    # ... ваша логика ...
    return jsonify({"success": True})

# Зарегистрируйте в main.py
from routes.my_routes import api
app.register_blueprint(api)
```

### Q: Как обновить фронтенд компоненты?

**A:**

```typescript
// frontend/components/my-component.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function MyComponent() {
  const { user } = useAuthStore();
  
  return (
    <div>
      {/* ваше содержимое */}
    </div>
  );
}
```

### Q: Как добавить новый тип БД колонки?

**A:**

```python
# backend/models.py
from sqlalchemy import Column, String

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(255))
    new_field = Column(String(255))  # ← Новое поле

# Создайте миграцию
# flask db migrate -m "add new_field to users"
# flask db upgrade
```

### Q: Как развернуть обновления на Production?

**A:**

```bash
# 1. Проверьте локально все работает
npm run dev  # frontend
python main.py  # backend

# 2. Коммитьте изменения
git add .
git commit -m "feat: описание изменений"
git push origin main

# 3. Автоматическое развертывание:
#    - Vercel пересоберет frontend (2-3 мин)
#    - Railway пересоберет backend (2-3 мин)

# 4. Проверьте production
# https://under-people-club.vercel.app/debug → Run Diagnostics
```

### Q: Где найти логи ошибок?

**A:**

**Frontend ошибки:**
1. Browser Console (F12 → Console)
2. Vercel Deployments → Function Logs

**Backend ошибки:**
1. Railway Deployments → Logs
2. Browser DevTools → Network tab

**Диагностика обеих:**
1. Откройте `/debug` страницу
2. Нажмите "Run Full Diagnostics"

### Q: Как тестировать локально перед production?

**A:**

```bash
# 1. Запустите frontend и backend
npm run dev           # Terminal 1: frontend
python main.py        # Terminal 2: backend

# 2. .env.local должен быть
NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Откройте http://localhost:3000

# 4. Тестируйте авторизацию:
# - Нажмите "Войти через Telegram"
# - Проверьте Console логи
# - Убедитесь что всё работает

# 5. Когда всё работает локально:
git push origin main  # Автоматический deployment на production
```

---

## 📞 Служба Поддержки

### Если что-то сломалось:

1. **Откройте диагностику:** `/debug`
2. **Проверьте логи:**
   - Frontend: Vercel Dashboard
   - Backend: Railway Dashboard
3. **Следуйте гайду:** [COMPLETE_CORS_DEBUG_GUIDE.md](COMPLETE_CORS_DEBUG_GUIDE.md)
4. **Если всё ещё не работает:**
   - GitHub Issues
   - Telegram: @your_support_bot
   - Email: support@underpeople.club

---

## 📝 Лицензия

Проприетарный проект. Все права защищены.

---

## 🎉 Готово!

Ваш проект полностью готов к запуску! 

**Следующие шаги:**

1. ✅ Убедитесь что все URL работают
2. ✅ Запустите диагностику `/debug`
3. ✅ Протестируйте авторизацию
4. ✅ Монитор логов в production

**Контрольный список:**

- [ ] Frontend развернут на Vercel
- [ ] Backend развернут на Railway
- [ ] CORS настроен на backend'е
- [ ] Vercel переменные установлены
- [ ] Диагностика показывает все ✅
- [ ] Авторизация работает

**Результат:** Production-ready приложение с полной поддержкой Telegram WebApp! 🚀

---

**Last Updated:** December 27, 2025  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

