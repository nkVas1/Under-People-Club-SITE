# ⚡ БЫСТРЫЙ СПРАВОЧНИК: Исправления Vercel + Render

## 🎯 ЧТО ИСПРАВЛЕНО

### ✅ Vercel Frontend

| Файл | Проблема | Решение |
|------|----------|---------|
| `frontend/vercel.json` | Параметр `nodeVersion` не поддерживается | Удален параметр |
| `vercel.json` в корне | Vercel не знает где фронтенд | Создан config с `"src": "frontend"` |
| `frontend/package.json` | Отсутствовала build команда | ✅ Уже есть `"build": "next build"` |
| `.env.example` | Неясные комментарии | Добавлены пояснения для Vercel/Render |

### ✅ Render Backend

| Файл | Проблема | Решение |
|------|----------|---------|
| `backend/app/models/models.py` | Self-referencing FK ошибка | Добавлен `use_alter=True` к FK |
| `render.yaml` | Неправильный путь к build | Исправлены `buildCommand` и `startCommand` |

---

## 🚀 ДЕЙСТВИЯ НА VERCEL (ОБЯЗАТЕЛЬНО!)

### 1. Root Directory ← ГЛАВНОЕ!

```
Settings → General → Root Directory → Edit → frontend → Save
```

### 2. Build Settings

```
Settings → Build & Development
- Framework: Next.js ✅
- Build Command: npm run build ✅
- Output: .next ✅
```

### 3. Environment Variables

```
Settings → Environment Variables → Add:
- NEXT_PUBLIC_API_URL = https://under-people-api.onrender.com
- NEXT_PUBLIC_BOT_NAME = under_people_bot
- NEXT_PUBLIC_APP_ID = 1234567890
```

### 4. Redeploy

```
Deployments → последний деплой → ... → Redeploy
```

### 5. Проверяем логи

```
✅ "Running npm run build"
✅ "Compiled successfully"
✅ НЕТ "404: NOT_FOUND"
✅ НЕТ "Build Completed in [58ms]"
```

---

## 🚀 ДЕЙСТВИЯ НА RENDER (ЕСЛИ НУЖНО)

### 1. Очистите БД (если была ошибка FK)

```
PostgreSQL → Connect → PSQL:
DROP TABLE IF EXISTS user_cards CASCADE;
DROP TABLE IF EXISTS market_listings CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
```

### 2. Redeploy API

```
Web Service → Manual Deploy → Deploy latest commit
```

### 3. Проверяем логи

```
✅ "Build successful 🎉"
✅ "Application startup complete"
✅ НЕТ ошибок с таблицами
```

---

## ✅ ФИНАЛЬНАЯ ПРОВЕРКА

### Локально

```bash
# Проверить структуру
ls frontend/package.json       # ✅ должно быть
cat frontend/vercel.json       # ✅ нет nodeVersion
cat vercel.json                # ✅ есть правильный config
git log --oneline | head -1    # ✅ последний коммит про Vercel

# Убедиться что папка на GitHub
git ls-files | grep ^frontend/
```

### На Vercel

```
1. Settings → General → Root Directory = "frontend" ✅
2. Settings → Build → Framework = "Next.js" ✅
3. Deployments → Logs показывают успех ✅
4. https://under-people-club.vercel.app работает ✅
```

### На Render

```
1. Web Service → Logs показывают успех ✅
2. https://under-people-api.onrender.com/docs доступен ✅
```

---

## 📊 КОММИТЫ

```
e238150 Добавлен полный чеклист исправления Vercel деплоя
5335d04 Исправлены ошибки Vercel деплоя и конфигурация фронтенда
f0a7148 Исправлено: Self-referencing FK для системы рефералов
5a62028 Добавлен чеклист восстановления деплоя (Render)
```

---

## 📚 ДОКУМЕНТАЦИЯ

| Документ | Для чего |
|----------|----------|
| [VERCEL_FIX.md](VERCEL_FIX.md) | 📖 Полное руководство по Vercel |
| [VERCEL_DEPLOY_CHECKLIST.md](VERCEL_DEPLOY_CHECKLIST.md) | ✅ Пошаговый чеклист |
| [RENDER_FIX.md](RENDER_FIX.md) | 📖 Полное руководство по Render |
| [RENDER_FIX_CHECKLIST.md](RENDER_FIX_CHECKLIST.md) | ✅ Пошаговый чеклист |
| [RENDER_DEPLOY_GUIDE.md](RENDER_DEPLOY_GUIDE.md) | 📖 Как переделать Render деплой |

---

## 🎯 РЕЗУЛЬТАТ

Когда всё готово, у вас будет:

```
Frontend:  https://under-people-club.vercel.app
Backend:   https://under-people-api.onrender.com
Database:  PostgreSQL на Render
Cache:     Redis на Render
Telegram:  Bot готов к использованию
```

🚀 **Готово к запуску!**
