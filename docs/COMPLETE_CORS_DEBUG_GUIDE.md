# 🔧 Полный Гайд: Отладка "Failed to Fetch" Ошибки

**Дата:** December 27, 2025  
**Проблема:** При нажатии "Войти через Telegram" видите "ACCESS DENIED / Failed to fetch"  
**Решение:** Этот гайд поможет выявить истинную причину и исправить её

---

## 📋 Возможные причины (в порядке вероятности)

| # | Причина | Признаки | Решение |
|---|---------|----------|--------|
| 1 | CORS не настроен на backend'е | Ошибка в консоли браузера: "CORS policy" | Добавить CORS headers на backend |
| 2 | API_URL в Vercel неправильный | Status: "API URL NOT CONFIGURED" | Проверить Vercel Environment Variables |
| 3 | Backend не отвечает | Долгая загрузка → timeout | Проверить что backend работает |
| 4 | Неверный эндпоинт | Status: "Server Error (404)" | Создать `/api/auth/callback` на backend |
| 5 | Backend вернул невалидный JSON | Ошибка: "Invalid JSON response" | Убедиться что backend возвращает JSON |

---

## 🧪 Пошаговая Диагностика

### Шаг 1: Проверьте Консоль Браузера

1. **Откройте DevTools** (F12 → Console tab)
2. **Нажмите "Войти через Telegram"**
3. **Посмотрите логи в консоли:**

✅ **Если видите:**
```
🔐 [AUTH CALLBACK] Starting auth flow
Code: abc123def456
API URL: https://upcworldbot-production.up.railway.app
📨 [AUTH] Response status: 200
✅ [AUTH] Received data: {...}
```
→ **Проблема не в коде фронтенда**. Идите на Шаг 3 (Backend).

❌ **Если видите:**
```
ERROR: API URL NOT CONFIGURED
```
→ **Идите на Шаг 2** (Vercel переменные).

❌ **Если видите:**
```
CORS/Network Error: Check API URL or Backend CORS settings
```
→ **Идите на Шаг 3** (Backend CORS).

---

### Шаг 2: Проверьте Vercel Environment Variables

#### 2A. В Vercel Dashboard:

1. **Vercel.com** → Project → **Settings** → **Environment Variables**
2. **Найдите** `NEXT_PUBLIC_API_URL`
3. **Проверьте значение:**
   - ✅ Должна быть: `https://upcworldbot-production.up.railway.app`
   - ❌ Не должна быть: `http://localhost:8000` или пуста

4. **Если изменили:**
   - Перейдите в **Deployments**
   - Нажмите "..." на последнем deployment
   - Выберите **Redeploy**
   - Дождитесь завершения (статус "Ready")

#### 2B. Локальная проверка:

```bash
# В frontend папке откройте .env.local
cat .env.local

# Должно быть:
NEXT_PUBLIC_API_URL=https://upcworldbot-production.up.railway.app

# Если используете localhost (разработка):
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Шаг 3: Проверьте Backend

#### 3A. Является ли Backend запущенным?

```bash
# Проверить URL в браузере
https://upcworldbot-production.up.railway.app/health

# Должно вернуть 200 и какие-то данные
# Если 404 или timeout → backend не работает
```

#### 3B. Проверьте CORS настройки на Backend

**В консоли браузера (DevTools → Network tab):**

1. **Нажмите "Войти через Telegram"**
2. **Найдите запрос к `/api/auth/callback`**
3. **Посмотрите Response Headers:**

✅ **Должны быть:**
```
access-control-allow-origin: https://under-people-club.vercel.app
access-control-allow-methods: GET, POST, OPTIONS
access-control-allow-headers: Content-Type
```

❌ **Если их нет** → Добавьте CORS на backend:

**Для Flask:**
```python
from flask_cors import CORS
CORS(app, origins=['https://under-people-club.vercel.app', 'http://localhost:3000'])
```

**Для FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://under-people-club.vercel.app', 'http://localhost:3000'],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 3C. Проверьте эндпоинт на Backend

```bash
# Попробуйте отправить запрос через curl
curl -X POST https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "test123"}'

# Должно вернуть JSON:
# {
#   "access_token": "eyJhbGc...",
#   "user": {...}
# }

# Если возвращает 404 → эндпоинт не создан
# Если возвращает 500 → ошибка в коде
```

---

## 🎯 Полный Чеклист Отладки

### Frontend (Vercel)

- [ ] DevTools Console показывает логи без ошибок
- [ ] `NEXT_PUBLIC_API_URL` установлена в Vercel (HTTPS!)
- [ ] Сделан Redeploy проекта в Vercel
- [ ] `/auth/callback` страница открывается (не 404)
- [ ] Network tab показывает POST запрос на backend

### Backend (Railway)

- [ ] Backend запущен и отвечает на запросы
- [ ] CORS настроен для домена Vercel
- [ ] Эндпоинт `POST /api/auth/callback` существует
- [ ] Эндпоинт возвращает JSON с `access_token` и `user`
- [ ] Обработаны OPTIONS запросы (preflight)
- [ ] Логи Railway не показывают ошибки

### Интеграция

- [ ] Локальное тестирование работает
- [ ] Production Telegram WebApp авторизация работает
- [ ] Токен сохраняется в localStorage
- [ ] Редирект на `/shelter` работает

---

## 💡 Частые Ошибки и Решения

### "CORS/Network Error"

**DevTools Error:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://under-people-club.vercel.app' 
has been blocked by CORS policy
```

**Решение:**
1. На backend'е добавьте CORS headers (см. выше)
2. Убедитесь что URL в `NEXT_PUBLIC_API_URL` верная
3. Backend должен отвечать на OPTIONS запросы

### "Server Error (404)"

**DevTools Error:**
```
404 Not Found
```

**Решение:**
- На backend'е нет эндпоинта `/api/auth/callback`
- Создайте этот эндпоинт, он должен:
  - Принимать POST запросы
  - Брать `code` из body
  - Возвращать JSON с `access_token` и `user`

### "Invalid JSON response"

**Ошибка:**
```
SyntaxError: Unexpected token < in JSON at position 0
```

**Решение:**
- Backend возвращает HTML (ошибка 500) вместо JSON
- Проверьте логи backend'а: `Railway Logs` → `Deployments` → последний
- Исправьте ошибку в коде backend'а

### "Token missing in response"

**Ошибка:**
```
Error: Token or user data missing in response
```

**Решение:**
- Backend вернул JSON, но без `access_token` или `user`
- Убедитесь что backend возвращает оба поля:
```json
{
  "access_token": "...",
  "user": {
    "id": "...",
    "username": "...",
    ...
  }
}
```

---

## 🚀 Полный Тестовый Цикл

### 1. Локально

```bash
# Terminal 1: Backend
cd backend
python main.py  # Слушает на http://localhost:8000

# Terminal 2: Frontend
cd frontend
# .env.local должен содержать:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev  # Слушает на http://localhost:3000

# Terminal 3: Откройте браузер
# http://localhost:3000/shelter
# Нажмите "Войти через Telegram"
# Проверьте Console для логов
```

### 2. На Production

```bash
# 1. Push всё на GitHub
git add .
git commit -m "Ready for production"
git push origin main

# 2. Railway автоматически пересоберет backend

# 3. Vercel автоматически пересоберет frontend

# 4. Откройте https://under-people-club.vercel.app/shelter

# 5. Нажмите "Войти через Telegram"

# 6. Проверьте что авторизация работает
```

---

## 📊 Диагностические Логи

### Что видеть в Browser Console

✅ **Успешно:**
```
🔐 [AUTH CALLBACK] Starting auth flow
Code: abc123
API URL: https://upcworldbot-production.up.railway.app
📨 [AUTH] Response status: 200
✅ [AUTH] Received data: {user: {...}, access_token: "..."}
🚀 [AUTH] Redirecting to /shelter
```

❌ **Ошибка:**
```
❌ [AUTH CALLBACK ERROR] Error: CORS/Network Error
```

### Что видеть в Railway Logs

✅ **Успешно:**
```
[INFO] POST /api/auth/callback - Status: 200
[DEBUG] User authenticated: user_id=123456789
[DEBUG] Access token generated
```

❌ **Ошибка:**
```
[ERROR] Unhandled exception in /api/auth/callback
[ERROR] CORS headers not configured
```

---

## 🎓 Дополнительные Ресурсы

- **CORS объяснение:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Vercel Deployment:** https://vercel.com/docs/deployments
- **Flask-CORS:** https://flask-cors.readthedocs.io/

---

## 📞 Когда ничего не помогает

1. **Проверьте все три источника ошибок:**
   - Browser Console (Frontend)
   - Vercel Logs (Frontend build)
   - Railway Logs (Backend)

2. **Сделайте скриншоты:**
   - Browser Console error
   - Network tab (Request + Response)
   - Railway Logs error

3. **Убедитесь что:**
   - Git commit с CORS изменениями на backend'е запушен
   - Railway пересоберал проект
   - Vercel Redeploy сделан

---

**Status:** ✨ Когда все шаги выполнены - авторизация работает как часы!

