# ✅ Checklist Vercel Configuration (Debug CORS Issue)

**Дата:** December 27, 2025  
**Проблема:** "Failed to fetch" при авторизации через Telegram WebApp  
**Решение:** Проверка переменных окружения в Vercel

---

## 🔧 Шаг 1: Проверьте NEXT_PUBLIC_API_URL в Vercel

1. **Откройте Vercel Dashboard:**
   - https://vercel.com
   - Выберите проект `Under-People-Club-SITE`

2. **Перейдите в Settings → Environment Variables:**
   - Settings (вкладка в проекте)
   - Scroll down to "Environment Variables"

3. **Найдите переменную `NEXT_PUBLIC_API_URL`:**
   - ✅ **Должна быть:** `https://upcworldbot-production.up.railway.app`
   - ❌ **Не должна быть:** `http://localhost:8000` или без https://

4. **Если переменную нужно добавить/изменить:**
   - Нажмите "Edit" (если существует) или "Add New"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://upcworldbot-production.up.railway.app`
   - Environment: `Production` (или Production + Preview)
   - Нажмите "Save"

---

## 🚀 Шаг 2: Trigger Redeploy

**ВАЖНО!** Просто изменить переменную недостаточно - нужно пересобрать проект!

1. **Перейдите в Deployments:**
   - В меню проекта выберите "Deployments"
   - Найдите последний deployment (обычно сверху)

2. **Нажмите меню "..." и выберите "Redeploy":**
   - Это пересоберет проект с новыми переменными

3. **Дождитесь завершения:**
   - Статус должен стать "Ready" (зелёный)
   - Займет примерно 2-3 минуты

---

## 🧪 Шаг 3: Тестирование

### Локально (быстрая проверка):
```bash
# 1. Откройте .env.local в frontend папке
# 2. Убедитесь что там:
NEXT_PUBLIC_API_URL=https://upcworldbot-production.up.railway.app

# 3. Запустите dev сервер
cd frontend
npm run dev

# 4. Откройте DevTools (F12) → Console
# 5. Нажмите "Войти через Telegram" на /shelter
# 6. Вы должны увидеть логи:
#    🔐 [AUTH CALLBACK] Starting auth flow
#    Code: xxx
#    API URL: https://...
#    📨 [AUTH] Response status: 200 (или 201)
#    ✅ [AUTH] Received data: {...}
```

### На Production (Vercel):
1. **Откройте** https://under-people-club.vercel.app/shelter
2. **Кликните** "Войти через Telegram"
3. **Telegram откроет WebApp** → `/auth/callback?code=...`
4. **Проверьте:**
   - ✅ Показывает "ESTABLISHING SECURE LINK..."
   - ✅ Затем "ACCESS GRANTED. REDIRECTING..."
   - ✅ Редирект на `/shelter` с авторизованным юзером
   - ❌ Если видите "ACCESS DENIED" → смотрите "Diagnostic Report"

---

## 🔍 Отладка ошибок

### Ошибка: "CORS/Network Error"
```
Причина: Backend не возвращает правильные CORS заголовки или адрес API неверный

Решения:
1. Проверьте NEXT_PUBLIC_API_URL (должна быть HTTPS!)
2. На backend'е добавьте CORS headers:
   - Access-Control-Allow-Origin: https://under-people-club.vercel.app
   - Access-Control-Allow-Methods: GET, POST, OPTIONS
   - Access-Control-Allow-Headers: Content-Type
3. Backend должен отвечать на OPTIONS запросы (preflight)
```

### Ошибка: "Server Error (404)"
```
Причина: Эндпоинт /api/auth/callback не существует на backend'е

Решение:
1. На backend'е (Python) создайте эндпоинт:
   POST /api/auth/callback
   {code: string}
   → {access_token: string, user: {...}}
```

### Ошибка: "Invalid JSON response"
```
Причина: Backend вернул не-JSON ответ (HTML, текст, и т.д.)

Решение:
1. На backend'е убедитесь что возвращаете JSON
2. Используйте правильный header: Content-Type: application/json
```

---

## 📋 Дополнительная информация

### Текущий URL API:
```
Production: https://upcworldbot-production.up.railway.app
```

### Эндпоинты для backend'а:
```
POST /api/auth/callback
Inputs:  { code: "abc123" }
Output:  {
  access_token: "eyJhbGc...",
  user: {
    id: "123456789",
    username: "john_doe",
    telegram_id: 123456789,
    up_coins: 50,
    role: "ranger",
    clan: "Novice",
    ref_code: "UP-6789",
    avatar_url: "https://...",
    is_verified: true
  }
}
```

---

## ✅ Чеклист

- [ ] NEXT_PUBLIC_API_URL установлена в Vercel Environment Variables
- [ ] Значение переменной: https://upcworldbot-production.up.railway.app (HTTPS!)
- [ ] Сделан Redeploy проекта в Vercel
- [ ] Backend эндпоинт /api/auth/callback реализован
- [ ] Backend возвращает JSON с access_token и user
- [ ] Backend имеет CORS настройки для Vercel домена
- [ ] Локальное тестирование работает
- [ ] Production тестирование работает
- [ ] Авторизация через Telegram полностью работает ✨

---

**Когда всё работает:** Вы нажимаете "Войти через Telegram" → вас редиректит в бота → вы нажимаете кнопку → вы возвращаетесь на сайт авторизованными!

