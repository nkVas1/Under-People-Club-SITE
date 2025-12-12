# 🚀 ШАГИ ПЕРЕДЕЛКИ ДЕПЛОЯ НА VERCEL

**Дата:** 12 декабря 2025  
**Статус:** ✅ Всё исправлено в коде, готово к переделке деплоя

---

## 📋 Быстрый старт (5 минут)

### 1️⃣ Очистите кэш на Vercel (ОБЯЗАТЕЛЬНО!)

1. Откройте https://vercel.com/dashboard
2. Выберите проект `Under-People-Club-SITE`
3. Нажмите **Settings** → **General** → найдите **Root Directory**
4. Установите: `under-people-platform/frontend`
5. Нажмите **Save**

### 2️⃣ Очистите Build Cache

1. Нажмите **Settings** → **Advanced**
2. Нажмите **Clear build cache**

### 3️⃣ Перезапустите деплой

1. Нажмите **Deployments**
2. Нажмите на три точки (`...`) рядом с последним деплоем
3. Выберите **Redeploy**

### 4️⃣ Дождитесь успеха

В логах должно быть:
```
✅ Running "npm install"
✅ Running "next build"
✅ Compiling pages...
✅ Production (under-people.vercel.app) is ready
```

**Время:** 1-2 минуты (НЕ 58ms!)

---

## 🔍 Что было исправлено

### Файл: `frontend/vercel.json`
```diff
  {
    "buildCommand": "npm run build",
-   "outputDirectory": ".next/standalone",
+   "outputDirectory": ".next",
    "framework": "nextjs"
  }
```

### Файл: `vercel.json` (в корне)
```diff
+ "buildCommand": "cd frontend && npm run build",
+ "outputDirectory": "frontend/.next",
+ "framework": "nextjs",
- "projects": [...static-build...]  // ❌ удалено
```

---

## 🧪 Проверка после деплоя

```bash
# 1. Проверить что сайт отвечает
curl https://under-people.vercel.app/

# Результат: HTML страница (200 OK), НЕ 404!

# 2. Проверить Swagger API
curl https://under-people.vercel.app/docs

# Результат: Документация Next.js в браузере
```

---

## 📖 Если что-то не сработало

### Проверка 1: Root Directory

```
Settings → General → Root Directory
```

**Должно быть одно из:**
- `under-people-platform/frontend`
- `frontend`

**Проверьте на GitHub какая у вас структура:**
```
Under-People-Club-SITE/
├── under-people-platform/
│   ├── frontend/          ← вот эта папка
│   │   ├── package.json
│   │   └── vercel.json
│   ├── backend/
│   └── vercel.json
```

Если структура как выше → `under-people-platform/frontend`

### Проверка 2: Build Settings

```
Settings → Build & Development
```

Должны быть:
- **Framework Preset:** `Next.js` ✅
- **Build Command:** Пусто (используется из vercel.json)
- **Output Directory:** `.next` или Пусто (Vercel определит)

### Проверка 3: Логи ошибок

На странице **Deployments** → нажмите на деплой → **Logs**

**Ищите эти строки:**

✅ **Хорошо:**
```
Running "npm install"
Running "next build"
Compiling /...
Successfully compiled pages
Production is ready
```

❌ **Плохо:**
```
Build Completed in 58ms (too fast!)
No Next.js version detected
Can't find package.json
404: NOT_FOUND
```

---

## 🔧 Если ошибка повторяется

### Вариант A: Полная переустановка (nuclear option)

1. На Vercel нажмите три точки → **Delete**
2. Нажмите **Add New** → **Project**
3. Импортируйте GitHub репо заново
4. На шаге **Configure Project**:
   - **Root Directory:** `under-people-platform/frontend`
   - **Framework:** `Next.js`
5. Нажмите **Deploy**

### Вариант B: Проверить локально

```bash
# Убедитесь что всё собирается локально
cd frontend
npm install
npm run build
npm start

# Откройте http://localhost:3000
# Должна загрузиться страница (не 404)
```

Если локально не работает:
```bash
# Проверить что установлены все зависимости
npm ls next

# Должно вывести версию, например: next@14.1.0
```

---

## ✅ Окончательный чек-лист

```
☐ Код запушен на GitHub (коммит 69d6c5e)
☐ Root Directory на Vercel = "under-people-platform/frontend"
☐ Build Cache очищен
☐ Проект переразвёрнут (Redeploy)
☐ Логи показывают "next build"
☐ Сайт доступен (https://under-people.vercel.app)
☐ Нет 404 ошибок
☐ Время сборки 1-2 минуты (не 58ms)
```

---

## 📚 Дополнительная информация

- **Гайд по ошибкам:** [VERCEL_FIX.md](VERCEL_FIX.md)
- **Быстрый справочник:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Документация Vercel:** https://vercel.com/docs

---

**Вопросы?** Проверьте логи на Vercel Deployment → Logs 🚀
