# 🚀 Deployment Guide - Architecture Session #7

Инструкции по развертыванию новых функций (Redis, Events API, Public Profiles).

---

## 📋 Pre-Deployment Checklist

- [ ] Все тесты прошли локально
- [ ] Frontend компилируется без ошибок
- [ ] Backend запускается без ошибок
- [ ] Git commits pushed to GitHub
- [ ] Environment variables подготовлены
- [ ] Database backups созданы

---

## 🔧 Backend Deployment (Railway)

### Step 1: Update Dependencies
```bash
# Убедитесь что requirements.txt обновлен
pip install -r requirements.txt

# Проверьте версии
pip list | grep -E "(aioredis|fastapi|redis)"
```

**Изменения в requirements.txt:**
```
aioredis>=2.0.1  # NEW - Redis async client
redis>=5.0.3     # EXISTING - Redis connection pool
fastapi>=0.110.0 # EXISTING
```

### Step 2: Configure Environment Variables

**На Railway:**

1. Откройте проект → Settings → Variables
2. Добавьте/обновите:

```env
# Redis Configuration (NEW)
REDIS_URL=redis://default:PASSWORD@HOST:PORT

# Database (existing)
DATABASE_URL=postgresql://user:pass@host/db

# API Configuration (existing)
NEXT_PUBLIC_API_URL=https://api.yoursite.com
API_TITLE=Under People API
API_VERSION=1.0.0
DEBUG=false
ALLOWED_ORIGINS=https://yoursite.com,https://www.yoursite.com
```

### Step 3: Database Migration (if needed)

**Для создания Event table:**

```bash
# Если используете Alembic
alembic revision --autogenerate -m "Add events table"
alembic upgrade head

# ИЛИ просто перезапустите backend
# SQLAlchemy создаст таблицу автоматически через Base.metadata.create_all()
```

### Step 4: Deploy

```bash
git push  # Автоматический deploy на Railway при push
```

**Проверка статуса:**
- Откройте Railway Dashboard
- Посмотрите логи в Deployments
- Проверьте что backend успешно запустился

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Build

```bash
cd frontend
npm run build
```

**Убедитесь что:**
- ✅ 12/12 страниц скомпилировано
- ✅ Нет TypeScript ошибок
- ✅ Все dependencies resolved

### Step 2: Commit & Push

```bash
git add .
git commit -m "feat: events and public profiles"
git push origin main
```

**Vercel автоматически:**
- Обнаружит новый push
- Запустит build
- Развернет на production

### Step 3: Verify Deployment

1. Откройте Vercel Dashboard
2. Проверьте последний deployment
3. Посещите https://yoursite.com/events
4. Проверьте /u/[referralCode] для public profile

---

## 🔗 Connectivity Check

### Backend API Health

```bash
# Проверьте что backend доступен
curl https://api.yoursite.com/health

# Response:
# {"status":"ok","message":"Under People API is running"}
```

### Test New Endpoints

```bash
# Events API
curl https://api.yoursite.com/api/v1/events/upcoming?limit=5

# Public Profile (should be accessible without auth)
curl https://api.yoursite.com/api/users/u/UP-ABC123

# Redis status check (should not return error)
# Это видно в backend логах: "[REDIS] Connected" или "[REDIS] Using in-memory storage"
```

### Frontend to Backend

```javascript
// In browser console
fetch('https://api.yoursite.com/api/v1/events/upcoming?limit=5')
  .then(r => r.json())
  .then(console.log)
```

---

## 🐛 Troubleshooting

### Problem: "REDIS_URL not configured"

**Решение:**
```bash
# Проверьте что переменная установлена на Railway
# Settings → Variables → REDIS_URL

# Если не установлена, backend перейдет на in-memory storage
# Это безопасно, но auth коды не переживут рестарты
```

### Problem: "Event table not found"

**Решение:**
```bash
# Option 1: Run migration
alembic upgrade head

# Option 2: Delete and recreate database
# (backend создаст все таблицы автоматически)
```

### Problem: "404 on /api/users/me"

**Решение:**
```bash
# Убедитесь что:
# 1. Маршрут зарегистрирован в main.py
# app.include_router(users.router, prefix="/api")

# 2. Endpoint определен в users.py
# @router.get("/me")

# 3. Перезапустите backend после изменений
```

### Problem: "Referral code still showing 'UP-GUEST'"

**Решение:**
```bash
# Убедитесь что:
# 1. User model включает generate_referral_code() метод
# 2. Все новые пользователи созданы ПОСЛЕ деплоя
# 3. Старые пользователи могут использовать обновить используя миграцию:

# SQL для заполнения пустых referral_codes:
UPDATE users 
SET referral_code = 'UP-' || SUBSTRING(id::text, 1, 6) 
WHERE referral_code IS NULL OR referral_code = 'UP-GUEST';
```

---

## 📊 Performance Monitoring

### Check API Response Times

```bash
# Events endpoint (должно быть <100ms)
curl -w "\nResponse time: %{time_total}s\n" \
  https://api.yoursite.com/api/v1/events/upcoming

# Public profile (должно быть <50ms)
curl -w "\nResponse time: %{time_total}s\n" \
  https://api.yoursite.com/api/users/u/UP-ABC123
```

### Monitor Cache Hit Rate

**На backend:**
```python
# Add logging to /api/users/me
@router.get("/me")
async def get_current_user(response: Response):
    # Проверьте логи что возвращается Cache-Control заголовок
    print(f"Cache headers: {response.headers}")
```

### Check Redis Connection

```bash
# На Railway CLI
redis-cli -u $REDIS_URL PING
# Response: PONG
```

---

## 🔐 Security Checklist

- [ ] REDIS_URL не содержит пароль в коде (только в env vars)
- [ ] Public profile endpoint не возвращает sensitive data
- [ ] Auth codes имеют TTL и one-time use
- [ ] CORS правильно настроен (только ваш домен)
- [ ] HTTPS используется везде
- [ ] Database backups регулярные

---

## 📝 Post-Deployment Steps

### 1. Create Sample Events (if needed)

```python
# Script для добавления тестовых событий
from app.models.models import Event
from app.db.session import SessionLocal
from datetime import datetime, timedelta

db = SessionLocal()

events = [
    Event(
        title="Grand Tournament",
        description="Epic battle royale with prizes",
        start_date=datetime.now() + timedelta(days=7),
        end_date=datetime.now() + timedelta(days=7, hours=4),
        location="Shelter Arena",
        price=50,
        capacity=100,
        is_active=True
    ),
    # ... add more events
]

db.add_all(events)
db.commit()
```

### 2. Test User Registration Flow

```bash
# 1. Generate auth code
curl -X POST http://localhost:8000/api/auth/generate-code \
  -d '{"telegram_id": 999999}'

# 2. Verify token received
# 3. Check user created with referral_code

# 4. Verify code format: UP-XXXXXX
```

### 3. Test Public Profile Sharing

```bash
# 1. Get referral code from /api/users/me
# 2. Navigate to /u/{referral_code}
# 3. Verify profile displays correctly
# 4. Share link - should work for anyone
```

### 4. Monitor First Day

- Проверьте backend логи на ошибки Redis
- Проверьте frontend console на API ошибки
- Убедитесь что caching работает (проверьте headers)
- Проверьте auth flow end-to-end

---

## 📅 Rollback Plan

Если что-то сломалось:

### Option 1: Quick Fix (if minor bug)
```bash
git revert 35c0074  # Ваш commit hash
git push
# Vercel автоматически deploy предыдущей версии
```

### Option 2: Full Rollback
```bash
# На Railway:
1. Deployment History → Select previous version
2. Click "Redeploy"

# На Vercel:
1. Deployments → Select previous
2. Click "Promote to Production"
```

### Option 3: Data Cleanup (if corrupted)
```sql
-- Очистить event таблицу если нужно
TRUNCATE TABLE events;

-- Очистить старые auth коды (в Redis)
redis-cli -u $REDIS_URL FLUSHDB
```

---

## 🎯 Success Criteria

После деплоя убедитесь что:

✅ **Backend:**
- [ ] Health check возвращает 200
- [ ] Events API доступен
- [ ] Public profiles доступны
- [ ] Auth callback работает
- [ ] Кэширование работает (проверьте headers)

✅ **Frontend:**
- [ ] /events страница загружается
- [ ] /u/[code] страница загружается
- [ ] Auth callback перенаправляет на /shelter
- [ ] Referral codes отображаются с UP- префиксом
- [ ] Нет console ошибок

✅ **Integration:**
- [ ] Frontend делает API запросы
- [ ] Данные отображаются корректно
- [ ] Пагинация работает
- [ ] Публичный профиль можно шарить

✅ **Performance:**
- [ ] Events API < 100ms
- [ ] Public profile < 50ms
- [ ] Cache-Control headers присутствуют
- [ ] No N+1 queries

---

## 📞 Support

Если встречаются проблемы:

1. Проверьте логи (Railway/Vercel dashboard)
2. Посмотрите console ошибки (браузер F12)
3. Проверьте что все env vars установлены
4. Проверьте git commit успешно deployed
5. Проверьте database migrations applied

---

## 🎉 Completion

После успешного деплоя:

```bash
# Обновите документацию
git log --oneline | head -5  # Verify commits

# Обновите README с новыми endpoints
# Уведомьте team о новых функциях
# Запланируйте тестирование пользователями
```

**Поздравляем! 🚀 Новая архитектура успешно развернута!**

