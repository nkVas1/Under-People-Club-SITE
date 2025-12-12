# 🎯 КРИТИЧНАЯ ОШИБКА ДЕПЛОЯ И КАК ЕЁ ИСПРАВИТЬ

## ❌ Ошибка, которую вы получили

```
bash: line 1: cd: backend: No such file or directory
```

## ✅ Решение: Обновленный `render.yaml`

Файл `render.yaml` в **корне проекта** (где лежит `package.json`, `requirements.txt`, `.git`) уже обновлен правильно:

```yaml
buildCommand: "pip install -r backend/requirements.txt"
startCommand: "cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT"
```

**Ключ:** `$PORT` - это переменная, которую автоматически подставляет Render (обычно 10000).

## 🔄 Как пересоздать деплой (ПОЛНЫЙ ПРОЦЕСС)

### 1️⃣ Локально убедитесь, что структура правильная

```bash
# Вы должны быть в папке под-people-platform/
# (где лежит render.yaml)

ls -la render.yaml
ls -la backend/requirements.txt
ls -la backend/app/main.py
```

Должны увидеть все эти файлы!

### 2️⃣ Дополните `.env` файлы

**backend/.env** (если не существует, создать):
```env
# Бд из Render PostgreSQL
DATABASE_URL=postgresql://user:password@dpg-xyz.onrender.com/underpeople_db

# Telegram Bot Token от @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmnoPQRstuvWXYZ

# Сгенерировать: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-secret-key-here-min-32-chars

# Redis URL из Render Redis
REDIS_URL=redis://default:password@redis.onrender.com:6379

# CORS разрешить для фронтэнда
ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
```

### 3️⃣ Запушьте изменения на GitHub

```bash
git add .
git commit -m "Исправлена конфигурация Render деплоя / Fix Render deployment config"
git push origin main
```

### 4️⃣ В Render Dashboard

1. Откройте https://dashboard.render.com
2. Выберите сервис `under-people-api`
3. Нажмите **Manual Deploy** → **Deploy latest commit**
4. Дождитесь логов

## 📊 Последовательность в логах (когда всё правильно)

```
==> Building...
==> Running 'pip install -r backend/requirements.txt'
Collecting fastapi==0.124.2
Collecting uvicorn[standard]==0.38.0
...
Successfully installed 45 packages
==> Build successful 🎉
==> Deploying...
==> Running 'cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:10000'
[2025-12-12 01:43:12 +0000] [1] [INFO] Starting gunicorn 23.0.0
[2025-12-12 01:43:12 +0000] [1] [INFO] Listening at: http://0.0.0.0:10000 (1)
[2025-12-12 01:43:12 +0000] [1] [INFO] Using worker class: uvicorn.workers.UvicornWorker
[2025-12-12 01:43:13 +0000] [8] [INFO] Uvicorn running on http://0.0.0.0:10000
[2025-12-12 01:43:13 +0000] [8] [INFO] Application startup complete
```

## 🧪 Тестирование после деплоя

```bash
# Замените на ваш URL из Render
API_URL="https://under-people-api.onrender.com"

# 1. Проверяем здоровье API
curl "$API_URL/api/health"
# Должно вернуть: {"status":"ok"}

# 2. Проверяем документацию
curl "$API_URL/docs"
# Должна открыться Swagger UI

# 3. Тестируем авторизацию (когда включен бот)
curl -X POST "$API_URL/api/auth/login/telegram" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456789,
    "first_name": "Test",
    "username": "testuser",
    "photo_url": "",
    "auth_date": 1702419792,
    "hash": "abc123"
  }'
```

## 🆘 Если всё ещё не работает

### Проверка 1: Файл render.yaml в корне

```bash
# В корне под-people-platform должен быть файл render.yaml
# Его содержание (главные строки):

cat render.yaml | grep -A 5 "startCommand"
# Должно вывести:
# startCommand: "cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT"
```

### Проверка 2: Структура папок на GitHub

```
under-people-platform/
├── backend/                    ← ЭТА ПАПКА
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   └── db/
│   ├── requirements.txt        ← ЭТО ФАЙЛ
│   └── bot/
├── frontend/
├── docs/
├── render.yaml                 ← В КОРНЕ!
└── .git
```

### Проверка 3: requirements.txt формат

```bash
# backend/requirements.txt должен содержать:
fastapi>=0.104.0
uvicorn[standard]>=0.38.0
gunicorn>=23.0.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0
...
```

**НЕ должно быть:**
- Относительных путей типа `../../../requirements.txt`
- Пробелов в начале строк
- Комментариев с Unicode символами

### Проверка 4: Переменные окружения в Render

Откройте Render Dashboard → `under-people-api` → **Environment**

Должны быть:
- ✅ `DATABASE_URL` (с dpg-)
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `SECRET_KEY`
- ✅ `REDIS_URL`

## 🚀 Финальный чек-лист перед пушем

```
☐ render.yaml в корне проекта (проверить buildCommand и startCommand)
☐ backend/requirements.txt содержит все пакеты
☐ backend/app/main.py запускает на $PORT (не на 8000)
☐ backend/.env заполнен правильными значениями
☐ Все изменения закоммичены: git status (должен быть clean)
☐ Последний коммит на GitHub: git log --oneline (1 последний коммит)
☐ В Render Dashboard добавлены все переменные окружения
☐ PostgreSQL база создана в Render
☐ Redis создан в Render
```

## ✅ Когда всё готово

1. Выполнить: `git push origin main`
2. Render автоматически запустит деплой
3. В Logs должно появиться "Build successful 🎉"
4. API доступен по адресу: `https://under-people-api.onrender.com`
5. Фронтэнд обновляет на `NEXT_PUBLIC_API_URL=https://under-people-api.onrender.com`

🎉 **Всё готово к использованию!**
