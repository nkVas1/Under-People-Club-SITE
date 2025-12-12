# ⚠️ ВАЖНО: Telegram Bot Token Security

**НИКОГДА НЕ КОММИТЬТЕ СЕКРЕТЫ НА GITHUB!**

---

## 🔐 Ваш Bot Token

```
ТОКЕН: 8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw
БОТ: UPCworld_bot
```

### ❌ НИКОГДА не делайте это:
- ❌ Не пишите токен в коде
- ❌ Не коммитьте .env с токеном
- ❌ Не делитесь токеном по чату
- ❌ Не добавляйте в public files

### ✅ ПРАВИЛЬНО делайте так:

#### 1. Сохраните токен в BACKEND .env
```
# backend/.env (НЕ коммитьте!)
TELEGRAM_BOT_TOKEN=8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw
TELEGRAM_BOT_NAME=UPCworld_bot
BOT_WEBHOOK_URL=https://under-people-club-api.onrender.com/webhooks/telegram
```

#### 2. Добавьте в .gitignore
```
# backend/.gitignore
.env
.env.local
.env.*.local
*.key
*.secret
```

#### 3. На Vercel (FRONTEND) - только PUBLIC переменные
```
NEXT_PUBLIC_BOT_NAME=UPCworld_bot
NEXT_PUBLIC_APP_URL=https://under-people-club.vercel.app
```

#### 4. На Render (BACKEND) - все переменные через Settings
Перейди: Render Dashboard → Your Service → Environment
```
TELEGRAM_BOT_TOKEN=8446133461:AAEmeqQXUjNjzwgSLqJX2uOf_lVLgN2-VIw
DATABASE_URL=postgresql://...
SECRET_KEY=...
```

---

## 🚨 Если токен был случайно закоммичен:

1. **Немедленно** regenerate bot token в BotFather:
   - Message: `/mybots`
   - Select: `UPCworld_bot`
   - Edit Bot
   - API Token → Generate new token

2. Remove from git history:
```bash
# На локальной машине:
git filter-branch --tree-filter 'rm -f backend/.env' HEAD
git push --force origin main
```

3. Убедитесь что токен больше НЕ в истории

---

## 📋 Security Checklist

- [ ] Токен сохранён только в backend/.env
- [ ] backend/.env в .gitignore
- [ ] Токен НЕ в коде (не в компонентах)
- [ ] Токен НЕ в .env.example (только примеры)
- [ ] Render имеет токен в Environment Variables
- [ ] Git history чист (нет токена в коммитах)
- [ ] .gitignore правильно настроен

---

## 🔄 Текущее Состояние

**FRONTEND (Vercel):**
- ✅ @telegram-auth/react widget используется
- ✅ NEXT_PUBLIC_BOT_NAME = UPCworld_bot
- ✅ Демо fallback работает без токена
- ✅ Токена нет в коде ✓

**BACKEND (Render):**
- ⏳ Нужно реализовать webhook
- ⏳ Нужно хранить токен в Environment
- ⏳ Нужно обрабатывать Telegram данные
- ⏳ Нужна валидация подписи

---

## 📞 Дальше

1. **УДАЛИТЕ** этот файл (он только для справки)
2. **НЕ КОММИТЬТЕ** токен нигде
3. **ДОБАВЬТЕ** токен только в Render Environment Variables
4. **ТЕСТИРУЙТЕ** локально с .env файлом

---

**⚠️ БЕЗОПАСНОСТЬ - ПРИОРИТЕТ #1! ⚠️**
