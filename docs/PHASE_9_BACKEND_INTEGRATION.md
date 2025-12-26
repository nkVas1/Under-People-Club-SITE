# 🔗 Backend Integration Guide (Phase 9)

**Дата:** December 26, 2025  
**Статус:** 🟡 In Progress  
**Требуется:** Настройка Python Backend на Railway

---

## 📋 Архитектура

```
┌─────────────────────────────────────────────────────┐
│                 Telegram Widget                      │
│              (в браузере пользователя)              │
└──────────────────┬──────────────────────────────────┘
                   │ user_id, hash, auth_date...
                   ↓
┌─────────────────────────────────────────────────────┐
│         FRONTEND (Next.js на Vercel)                │
│  frontend/components/auth/TelegramAuth.tsx          │
│  POST /api/auth/telegram → {user_data, hash}       │
└──────────────────┬──────────────────────────────────┘
                   │ 
                   │ POST ${NEXT_PUBLIC_API_URL}/api/auth/telegram
                   │ (отправляем всё в backend)
                   ↓
┌─────────────────────────────────────────────────────┐
│      BACKEND (Python Flask/FastAPI на Railway)      │
│  1. Проверяет криптографическую подпись HMAC-SHA256│
│  2. Ищет или создает пользователя в БД (Postgres)  │
│  3. Генерирует JWT токен (Access Token)            │
│  4. Возвращает: { user, access_token }             │
└──────────────────┬──────────────────────────────────┘
                   │ 
                   │ {
                   │   user: { id, username, up_coins, ... },
                   │   access_token: "eyJhbGc..."
                   │ }
                   ↓
┌─────────────────────────────────────────────────────┐
│    ZUSTAND STORE (на фронтенде)                     │
│  Сохраняет токен в localStorage                     │
│  Все последующие запросы включают этот токен        │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Что уже сделано на фронтенде

### 1. **TelegramAuth.tsx** — Отправка данных на Backend
```typescript
// Когда пользователь кликнет на виджет Telegram:
// 1. Виджет вызовет window.onTelegramAuth(user)
// 2. Наш код отправит это на backend: 
POST ${API_URL}/api/auth/telegram
{
  "id": 123456789,
  "first_name": "John",
  "username": "john_doe",
  "photo_url": "https://...",
  "hash": "abcdef1234567890",
  "auth_date": 1703079600
}

// Ожидаем ответ:
{
  "user": {
    "id": "123456789",
    "username": "john_doe",
    "telegram_id": 123456789,
    "up_coins": 100,
    "role": "ranger",
    "clan": "Novice",
    "ref_code": "UP-6789",
    "avatar_url": "https://...",
    "is_verified": true
  },
  "access_token": "eyJhbGc..." // ← JWT ТОКЕН!
}
```

### 2. **authStore.ts** — Сохраняет JWT токен
```typescript
// Токен сохраняется в store и localStorage:
user: {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Этот токен нужно отправлять в header'e при всех запросах:
Authorization: Bearer eyJhbGc...
```

### 3. **NEXT_PUBLIC_API_URL** — Переменная окружения
```bash
# .env.local (для разработки)
NEXT_PUBLIC_API_URL=http://localhost:8000

# В Vercel (Settings → Environment Variables)
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

---

## ⚙️ Что нужно сделать на Backend (Python)

### Эндпоинт 1: `POST /api/auth/telegram`

**Входные данные:**
```json
{
  "id": 123456789,
  "first_name": "John",
  "username": "john_doe",
  "photo_url": "https://...",
  "hash": "abcdef...",
  "auth_date": 1703079600
}
```

**Логика:**
```python
from hashlib import sha256
import hmac
import json

# 1. Проверяем подпись (HMAC-SHA256)
def verify_telegram_auth(auth_data, bot_token):
    """Проверяет криптографическую подпись Telegram"""
    
    # Берем BOT_TOKEN и хешируем его как ключ
    secret_key = sha256(bot_token.encode()).digest()
    
    # Подготавливаем данные для проверки (в алфавитном порядке)
    check_hash = auth_data.pop('hash')  # Отделяем сам хеш
    data_check_string = '\n'.join(
        f'{k}={v}' for k, v in sorted(auth_data.items())
    )
    
    # Хешируем HMAC-SHA256
    computed_hash = hmac.new(
        secret_key, 
        data_check_string.encode(),
        sha256
    ).hexdigest()
    
    # Сравниваем
    return computed_hash == check_hash

# 2. Ищем или создаем пользователя в БД
user = User.query.filter_by(telegram_id=auth_data['id']).first()
if not user:
    user = User(
        telegram_id=auth_data['id'],
        username=auth_data.get('username') or auth_data['first_name'],
        up_coins=50,  # Бонус новичка
        role='ranger',
        clan='Novice',
        avatar_url=auth_data.get('photo_url'),
        is_verified=True
    )
    db.session.add(user)
    db.session.commit()

# 3. Генерируем JWT токен
import jwt
from datetime import datetime, timedelta

access_token = jwt.encode({
    'user_id': str(user.id),
    'telegram_id': user.telegram_id,
    'exp': datetime.utcnow() + timedelta(days=30)  # Токен валиден 30 дней
}, BOT_TOKEN, algorithm='HS256')

# 4. Возвращаем пользователя и токен
return {
    'user': {
        'id': str(user.id),
        'username': user.username,
        'telegram_id': user.telegram_id,
        'up_coins': user.up_coins,
        'role': user.role,
        'clan': user.clan,
        'ref_code': user.ref_code,
        'avatar_url': user.avatar_url,
        'is_verified': True
    },
    'access_token': access_token
}
```

---

## 🔐 Защита API (Token Validation)

Когда фронтенд отправляет запрос с токеном:

```typescript
// На фронтенде (в будущих запросах):
const response = await fetch(`${API_URL}/api/profile`, {
  headers: {
    'Authorization': `Bearer ${user.token}` // ← Отправляем токен
  }
});
```

На backend'е проверяем токен:

```python
from functools import wraps
import jwt

def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        try:
            payload = jwt.decode(token, BOT_TOKEN, algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.query.get(user_id)
        except jwt.ExpiredSignatureError:
            return {'error': 'Token expired'}, 401
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}, 401
        
        # Передаем пользователя в функцию
        return f(user, *args, **kwargs)
    return decorated

@app.route('/api/profile', methods=['GET'])
@require_token
def get_profile(user):
    return {
        'user': {
            'id': user.id,
            'username': user.username,
            'up_coins': user.up_coins,
            # ... остальные поля
        }
    }
```

---

## 🧪 Тестирование интеграции

### Локально (Development)

1. **Backend на localhost:8000:**
   ```bash
   cd backend
   python main.py  # или Flask/FastAPI приложение
   ```

2. **Frontend на localhost:3000:**
   ```bash
   cd frontend
   npm run dev
   # В .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Откройте браузер и тестируйте:**
   - Зайдите на http://localhost:3000
   - Кликните на виджет Telegram
   - Проверьте Network tab в DevTools
   - Должен быть POST запрос на `http://localhost:8000/api/auth/telegram`
   - Ответ должен содержать `user` и `access_token`

### На Production (Railway)

1. **Добавьте переменные окружения в Railway:**
   ```
   DATABASE_URL=postgresql://...
   BOT_TOKEN=8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw
   FLASK_ENV=production
   ```

2. **Настройте Vercel Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
   ```

3. **Проверьте CORS на backend'е:**
   ```python
   from flask_cors import CORS
   
   # Разрешаем запросы с фронтенда
   CORS(app, origins=[
       'https://under-people-club.vercel.app',
       'http://localhost:3000'
   ])
   ```

---

## ✅ Чеклист интеграции

- [ ] Backend имеет эндпоинт `POST /api/auth/telegram`
- [ ] Backend проверяет криптографическую подпись HMAC-SHA256
- [ ] Backend создает пользователя в БД (Postgres)
- [ ] Backend возвращает `{user, access_token}`
- [ ] Frontend имеет `NEXT_PUBLIC_API_URL` в .env
- [ ] Frontend отправляет данные на backend (TelegramAuth.tsx обновлен)
- [ ] Frontend сохраняет JWT токен в store
- [ ] Токен сохраняется в localStorage (персистенция)
- [ ] CORS настроен на backend'е
- [ ] Tested локально и на production

---

## 🚨 Критические моменты

### 1. **Bot Token НИКОГДА не в .env.example**
```bash
# ❌ НЕПРАВИЛЬНО
NEXT_PUBLIC_BOT_TOKEN=8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw

# ✅ ПРАВИЛЬНО
# Backend only:
BOT_TOKEN=8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw (в Railway secrets)
```

### 2. **HMAC-SHA256 подпись (одна из самых частых ошибок)**
```python
# ❌ НЕПРАВИЛЬНО
hmac_new(bot_token.encode(), data.encode(), sha256)

# ✅ ПРАВИЛЬНО
secret = sha256(bot_token.encode()).digest()  # ← Сначала хешируем токен!
hmac.new(secret, data.encode(), sha256)
```

### 3. **JWT токен должен быть уникален и защищен**
```python
# ✅ ПРАВИЛЬНО
jwt.encode({
    'user_id': str(user.id),
    'exp': datetime.utcnow() + timedelta(days=30)
}, BOT_TOKEN, algorithm='HS256')  # ← Используем BOT_TOKEN как secret
```

---

## 📚 Дополнительные ресурсы

- [Telegram Login Widget Docs](https://core.telegram.org/widgets/login)
- [Telegram Bot API Reference](https://core.telegram.org/bots/api)
- [JWT.io Debugger](https://jwt.io)
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)

---

## 🎯 Следующие шаги (Phase 10)

После интеграции:
1. Реализовать `GET /api/profile` — получение профиля с токеном
2. Реализовать `POST /api/profile/qr` — генерация QR-кода
3. Реализовать `GET /u/[code]` — публичный профиль (без токена)
4. Добавить refresh token логику

---

**Status:** 🟢 **Ready for Backend Integration**
