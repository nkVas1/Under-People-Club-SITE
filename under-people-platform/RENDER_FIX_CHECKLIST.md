# ✅ Чеклист Восстановления Деплоя на Render

**Статус:** ✅ Ошибка исправлена в коде
**Дата:** 12 декабря 2025
**Коммит:** `Исправлено: Self-referencing FK для системы рефералов`

---

## 🔧 Что было исправлено

### Проблема
```
InvalidForeignKey: there is no unique constraint matching given keys for referenced table "users"
```

### Причина
Ошибка "курицы и яйца" в PostgreSQL - внешний ключ ссылается на поле `referral_code` в той же таблице, но база не знала о constraint во время создания.

### Решение
✅ **Обновлена модель `User`** в `backend/app/models/models.py`:
- Добавлен флаг `use_alter=True` к внешнему ключу
- Добавлен явный `name="fk_user_referral_code"` 
- Обновлена relationship с `foreign_keys=[invited_by_code]`

---

## 📋 Пошаговое восстановление деплоя

### Шаг 1: Убедитесь, что код на GitHub обновлён ✅
```bash
git log --oneline -3
# Должно быть:
# f0a7148 Исправлено: Self-referencing FK для системы рефералов
```

### Шаг 2: Очистите БД на Render (ЕСЛИ нужно)

**Важно:** Выполните только если БД в "сломанном" состоянии!

1. Откройте [Render Dashboard](https://dashboard.render.com)
2. Выберите PostgreSQL инстанс `underpeople-db`
3. Нажмите **Connect** → **PSQL**
4. Выполните команды:
```sql
DROP TABLE IF EXISTS user_cards CASCADE;
DROP TABLE IF EXISTS market_listings CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
```
5. Закройте подключение

### Шаг 3: Перезапустите деплой

1. На Web Service `underpeople-api`:
   - Нажмите **Manual Deploy** → **Deploy latest commit**
   - Дождитесь логов: `==> Build successful 🎉`
   - Дождитесь логов: `==> Deployment live 🎉`

### Шаг 4: Проверьте логи на ошибки

Должны появиться логи создания таблиц:
```
Creating table users...
Creating table cards...
Creating table products...
...
All tables created successfully!
```

### Шаг 5: Тестируем API

```bash
# Замените на ваш реальный URL
curl https://underpeople-api.onrender.com/docs

# Должны увидеть Swagger UI с API документацией
```

### Шаг 6: Проверьте Telegram авторизацию

1. Откройте фронтенд: https://underpeople.vercel.app (или ваш URL)
2. Нажмите "Вход через Telegram"
3. Авторизуйтесь
4. Должны увидеть профиль пользователя

---

## 🎯 Что проверить после успешного деплоя

| Компонент | Статус | Проверка |
|-----------|--------|----------|
| **Frontend** | ✅ | https://underpeople.vercel.app → Loads without errors |
| **API Docs** | ✅ | https://underpeople-api.onrender.com/docs → Swagger UI visible |
| **Database** | ✅ | Web Service logs show "All tables created" |
| **Redis** | ✅ | Web Service connects without timeout |
| **Telegram Bot** | ✅ | /start command works in bot |

---

## 🚨 Если ошибка повторяется

### Вариант A: Очистить кэш Build
1. На Web Service → **Settings** → **Rebuild**
2. Дождитесь полной пересборки

### Вариант B: Проверить окружение
1. На Web Service → **Environment**
2. Убедитесь, что установлены:
   - `TELEGRAM_BOT_TOKEN` ✅
   - `SECRET_KEY` ✅
   - `DATABASE_URL` ✅ (должен быть создан автоматически)
   - `REDIS_URL` ✅ (должен быть создан автоматически)

### Вариант C: Посмотрите исходный код на Render
```bash
# На Render Shell (если есть доступ):
cat /opt/render/project/backend/app/models/models.py | grep -A 10 "invited_by_code"

# Должны увидеть:
# use_alter=True
# name="fk_user_referral_code"
```

### Вариант D: Откатитесь на предыдущий коммит (если нужно)
```bash
git revert HEAD
git push origin main
# Render переразвернёт старую версию
```

---

## ✅ Успешное восстановление

Когда деплой успешен, вы должны увидеть:

```
==> Build successful 🎉
==> Deployment live 🎉
Your render app is available at: https://underpeople-api.onrender.com
```

И в логах приложения:
```
INFO: Uvicorn running on 0.0.0.0:10000
INFO: Database connected successfully
INFO: Redis connected successfully
INFO: Telegram bot initialized
```

---

## 📖 Дополнительные ресурсы

- [RENDER_DEPLOYMENT.md](./docs/RENDER_DEPLOYMENT.md) - Полная инструкция деплоя
- [DATABASE.md](./docs/DATABASE.md) - Информация о схеме БД
- [API.md](./docs/API.md) - API документация

---

**Вопросы?** Проверьте логи на Render Dashboard → Web Service → Logs
