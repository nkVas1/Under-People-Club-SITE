# 🚀 Исправление Деплоя на Vercel

## ❌ Ошибки, которые вы получили

### Ошибка 1: `vercel.json` Schema Validation ✅ ИСПРАВЛЕНО
```
The `vercel.json` schema validation failed: should NOT have additional property `nodeVersion`
```

### Ошибка 2: 404 NOT_FOUND + Build Completed in 58ms ✅ ИСПРАВЛЕНО
- Vercel не собрал Next.js проект
- Просто скопировал файлы, не нашёл что запускать
- Выдал пустую страницу

### Ошибка 3: No Next.js version detected ✅ ИСПРАВЛЕНО
```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies"
```
- Root Directory был неправильно указан
- `outputDirectory` был неправильно установлен

---

## ✅ Что исправлено

### 1️⃣ Исправлен `frontend/vercel.json`

**Было:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next/standalone",  ❌ НЕПРАВИЛЬНО
  "framework": "nextjs",
  "nodeVersion": "18.x"  ❌ УДАЛЕНО
}
```

**Стало:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",  ✅ ПРАВИЛЬНО
  "framework": "nextjs"
}
```

### 2️⃣ Исправлен корневой `vercel.json`

**Было:**
```json
{
  "projects": [
    {
      "src": "frontend",
      "use": "@vercel/static-build",  ❌ НЕПРАВИЛЬНО для Next.js!
      "config": { "distDir": ".next/standalone" }
    }
  ],
  "outputDirectory": "frontend/.next/standalone",  ❌ НЕПРАВИЛЬНО
  "buildCommand": "npm run build"
}
```

**Стало:**
```json
{
  "buildCommand": "cd frontend && npm run build",  ✅ ПРАВИЛЬНО
  "outputDirectory": "frontend/.next",  ✅ ПРАВИЛЬНО
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.underpeople.club/api/:path*"
    }
  ]
}
```

---

## 🔧 Пошаговое исправление на Vercel Dashboard

### Шаг 1: Откройте Vercel Dashboard

[https://vercel.com/dashboard](https://vercel.com/dashboard)

### Шаг 2: Выберите ваш проект

Нажмите на проект `under-people-platform` или `Under-People-Club-SITE`

### Шаг 3: Перейдите в Settings

1. Нажмите **Settings** (в верхнем меню)
2. Слева выберите **General**

### Шаг 4: Укажите Root Directory

1. Найдите раздел **Root Directory**
2. Нажмите **Edit**
3. **Выберите из списка или введите:** `frontend`
   - Если список предлагает, выберите `frontend` ✅
   - Если вводить вручную, напишите ровно: `frontend`
4. Нажмите **Save**

**Должно выглядеть так:**
```
Root Directory: frontend/
                ↑↑↑
             Важно!
```

### Шаг 5: Проверьте Build & Development Settings

1. Найдите раздел **Build & Development Settings** (или **Build Settings**)
2. Убедитесь:

| Параметр | Значение |
|----------|----------|
| **Framework Preset** | `Next.js` ✅ |
| **Build Command** | `npm run build` (или пусто) |
| **Output Directory** | `.next` или `.next/standalone` |
| **Install Command** | `npm ci` (или пусто) |

3. Нажмите **Save**

### Шаг 6: Добавьте Environment Variables (если нужны)

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте:

```
NEXT_PUBLIC_API_URL = https://api.underpeople.club
NEXT_PUBLIC_BOT_NAME = under_people_bot
NEXT_PUBLIC_APP_ID = 1234567890
```

**Важно:** `NEXT_PUBLIC_` prefix - это нужно для доступа переменных в браузере!

---

## 🔄 Пересоберите проект

### Вариант A: Redeploy (рекомендуется)

1. Откройте вкладку **Deployments**
2. Найдите последний (неудачный) деплой
3. Нажмите на три точки (`...`)
4. Выберите **Redeploy**
5. Выберите **Redeploy without Git changes** или дождитесь нового коммита

### Вариант B: Push новый коммит на GitHub

```bash
git add .
git commit -m "Исправлены конфигурации Vercel / Fix Vercel configs"
git push origin main
```

Vercel автоматически перезапустит деплой! 🚀

---

## 📊 Проверяем успешную сборку

### В логах деплоя должно быть:

✅ **Правильно:**
```
Running "npm install"...
> Installing dependencies

Running "npm run build"...
> next build

Creating an optimized production build...
Compiled successfully
✓ 1234 pages
✓ 567 static assets

Generated .next/standalone folder
```

❌ **Неправильно (не должно быть):**
```
Build Completed in [58ms]  ← Слишком быстро!
No files found
404: NOT_FOUND
```

### Проверяем доступ

После успешной сборки:

```bash
# Откройте в браузере ваш Vercel URL:
https://under-people-club.vercel.app

# Или используйте curl:
curl https://under-people-club.vercel.app
# Должна вернуться HTML страница (не 404)
```

---

## 🆘 Если ошибка остаётся

### Проверка 1: Структура папок

Убедитесь, что на GitHub есть:

```
under-people-platform/
├── frontend/
│   ├── package.json        ✅
│   ├── next.config.js      ✅
│   ├── vercel.json         ✅
│   ├── app/
│   ├── components/
│   └── public/
├── backend/
├── docs/
├── vercel.json             ✅ (в корне)
└── .git/
```

### Проверка 2: Frontend есть в .gitignore?

```bash
# На локальной машине:
cat .gitignore | grep -i frontend

# Там НЕ должно быть строк вроде:
# /frontend
# frontend/
```

Если есть - удалите! Нужно, чтобы папка была на GitHub!

### Проверка 3: package.json валидный?

```bash
# На локальной машине:
cd frontend
npm install --dry-run
# Должно успешно завершиться

# Или проверьте синтаксис JSON:
npm list (должен вывести дерево зависимостей)
```

### Проверка 4: Очистить кэш Vercel

1. На странице проекта → **Settings** → **Advanced** → **Clear Build Cache**
2. Redeploy

### Проверка 5: Пересоздать деплой

1. **Deployments** → на неудачном деплое → **...** → **Delete**
2. Нажмите **Deploy** и выберите ветку `main`

---

## 🎯 Правильный финальный процесс

### Локально

```bash
# 1. Убедитесь что всё скоммичено
git status
# nothing to commit, working tree clean

# 2. Проверьте структуру
ls -la | grep frontend
ls frontend/package.json

# 3. Если есть изменения:
git add .
git commit -m "Исправлены конфигурации Vercel"
git push origin main
```

### На Vercel Dashboard

1. ✅ Root Directory: `frontend`
2. ✅ Framework: `Next.js`
3. ✅ Build Command: `npm run build`
4. ✅ Нет лишних параметров в vercel.json
5. ✅ Environment variables установлены
6. ✅ Redeploy выполнен

---

## ✅ Когда всё готово

**Вы должны увидеть:**

```
✅ Build successful
✅ Deployment live
✅ Pages compiled: 1234
✅ Static assets: 567

Your project is live at:
https://under-people-club.vercel.app
```

**В браузере:**
- Открывается главная страница (не 404)
- Логотип загружается
- Нет ошибок в консоли (можно открыть F12)

---

## 🔗 Полезные ссылки

- [Vercel Docs - Monorepos](https://vercel.com/docs/concepts/monorepos)
- [Vercel Docs - Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Docs - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment on Vercel](https://nextjs.org/docs/deployment/vercel)

---

## 📞 Нужна помощь?

Проверьте:
1. Logs в Vercel Dashboard (вкладка Deployments)
2. Браузерную консоль (F12) на развёрнутом сайте
3. GitHub - папка `frontend` видна в репо

Если всё ещё не работает, предоставьте скриншот:
- Vercel logs (вкладка Deployments)
- Структура в GitHub
- Содержимое root `vercel.json`
