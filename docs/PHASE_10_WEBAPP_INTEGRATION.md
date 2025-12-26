# 🚀 Telegram WebApp Integration Guide (Phase 10)

**Дата:** December 27, 2025  
**Статус:** 🟢 Frontend Ready  
**Требуется:** Backend WebApp Implementation

---

## 📋 Что такое Telegram WebApp?

**WebApp** — это современный способ открывать веб-приложения из Telegram:
- ✅ **Мгновенная авторизация** - юзер уже авторизован в Telegram
- ✅ **Нет необходимости вводить телефон** - всё сразу
- ✅ **Deep linking** - бот может отправить ссылку и пользователь откроет app
- ✅ **Двусторонняя коммуникация** - WebApp может отправлять данные боту

---

## 🔄 Новая архитектура авторизации

```
┌──────────────────────────────────────┐
│   Пользователь в Telegram            │
│   (или открыл браузер)               │
└───────────┬──────────────────────────┘
            │
            ↓
    ┌──────────────────┐
    │  Frontend Site   │
    │  /shelter        │
    │                  │
    │  "Войти" кнопка  │
    │  (TelegramAuth)  │
    └────────┬─────────┘
             │
             │ href="https://t.me/upc_world_bot?start=login"
             │
             ↓
    ┌────────────────────────────────────┐
    │   Telegram Bot (@upc_world_bot)    │
    │                                    │
    │   /start=login handler:            │
    │   1. Пользователь уже авторизован  │
    │   2. Генерируем code               │
    │   3. Генерируем WebApp ссылку:    │
    │      https://site.com/auth/callback│
    │      ?code=xxx&user_id=123         │
    │   4. Открываем WebApp              │
    └────────┬───────────────────────────┘
             │
             │ Telegram открывает WebApp в iframe
             │
             ↓
    ┌────────────────────────────────────┐
    │   Frontend                         │
    │   /auth/callback?code=xxx          │
    │                                    │
    │   1. Берет code из URL             │
    │   2. Отправляет на backend:        │
    │      POST /api/auth/callback       │
    │      { code: "xxx" }               │
    │   3. Backend проверяет code        │
    │   4. Возвращает { user, token }   │
    │   5. Frontend сохраняет токен     │
    │   6. Редирект на /shelter          │
    └────────┬───────────────────────────┘
             │
             ↓
    ┌─────────────────────┐
    │  Пользователь      │
    │  авторизован ✓      │
    │  на сайте           │
    └─────────────────────┘
```

---

## ✨ Что изменилось на Frontend'е

### 1. **TelegramAuth.tsx** - Простая кнопка со ссылкой
```tsx
// Было: сложный виджет с коллбеками
// Теперь: просто ссылка на бота
<a href="https://t.me/upc_world_bot?start=login" target="_blank">
  Войти через Telegram
</a>
```

### 2. **Новая страница** - `/auth/callback`
```
GET /auth/callback?code=abc123def456
  ↓
  Обмениваем code на токен на backend'е
  ↓
  Сохраняем токен в store
  ↓
  Редирект на /shelter
```

### 3. **NEXT_PUBLIC_API_URL** - Определяет где backend
```bash
# Должен быть доступен из браузера!
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## ⚙️ Что нужно реализовать на Backend (Python)

### Эндпоинт 1: `GET /auth/start` (обработка /start=login из бота)

```python
@bot.message_handler(commands=['start'])
def handle_start(message):
    args = message.text.split()[1] if len(message.text.split()) > 1 else None
    
    if args == 'login':
        # 1. Генерируем код авторизации
        user_id = message.from_user.id
        code = generate_secure_code()  # uuid или random
        
        # 2. Сохраняем в cache на 5 минут
        cache.set(f"auth_code:{code}", user_id, expire=300)
        
        # 3. Генерируем WebApp ссылку
        callback_url = f"{FRONTEND_URL}/auth/callback?code={code}"
        
        # 4. Создаем InlineKeyboardButton для открытия WebApp
        keyboard = types.InlineKeyboardMarkup()
        webapp_button = types.InlineKeyboardButton(
            text="📱 Открыть Убежище",
            web_app=types.WebAppInfo(url=callback_url)
        )
        keyboard.add(webapp_button)
        
        # 5. Отправляем сообщение с кнопкой
        bot.send_message(
            message.chat.id,
            f"🔐 Нажмите кнопку ниже для входа в систему",
            reply_markup=keyboard
        )
    else:
        # Обычный /start
        bot.send_message(message.chat.id, "Добро пожаловать в UPC World Bot!")
```

### Эндпоинт 2: `POST /api/auth/callback` (обмен кода на токен)

```python
@app.route('/api/auth/callback', methods=['POST'])
def auth_callback():
    data = request.json
    code = data.get('code')
    
    if not code:
        return {'error': 'Missing code'}, 400
    
    # 1. Ищем код в cache
    user_id = cache.get(f"auth_code:{code}")
    if not user_id:
        return {'error': 'Invalid or expired code'}, 401
    
    # 2. Удаляем код (одноразовый)
    cache.delete(f"auth_code:{code}")
    
    # 3. Получаем данные юзера из Telegram Bot API
    try:
        # Если у нас есть информация о юзере в нашей БД
        user = User.query.filter_by(telegram_id=user_id).first()
        
        if not user:
            # Создаем нового пользователя
            # (можем получить инфу из Telegram Bot API или создать минимальный аккаунт)
            user = User(
                telegram_id=user_id,
                username=f"user_{user_id}",
                up_coins=50,  # Бонус новичка
                role='ranger',
                clan='Novice',
                is_verified=True
            )
            db.session.add(user)
            db.session.commit()
        
        # 4. Генерируем JWT токен
        access_token = create_access_token(user_id=user.id)
        
        # 5. Возвращаем пользователя и токен
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
    
    except Exception as e:
        return {'error': str(e)}, 500
```

---

## 🧪 Тестирование локально

### Шаг 1: Backend на localhost:8000
```bash
cd backend
python main.py
```

### Шаг 2: Frontend на localhost:3000
```bash
cd frontend
# .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Шаг 3: Тестируем авторизацию
1. Откройте http://localhost:3000/shelter
2. Кликните "Войти через Telegram"
3. Вас перенаправит на https://t.me/upc_world_bot?start=login
4. **Важно:** Тестировать в реальном Telegram боте (или в Telegram Desktop)
5. После нажатия "Открыть Убежище" должно открыться WebApp
6. Вас редиректит на http://localhost:3000/auth/callback?code=...
7. Страница обрабатывает код и сохраняет токен
8. Редирект на /shelter с авторизованным пользователем

---

## 🔐 Безопасность WebApp

### Что Telegram гарантирует:
```python
# Когда пользователь открывает WebApp, 
# Telegram передает initData с подписью:

# В браузере доступно:
window.Telegram.WebApp.initData
# Пример:
# "user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22..."

# Это можно валидировать на backend'е:
# 1. Распарсить initData
# 2. Проверить подпись (HMAC-SHA256 с BOT_TOKEN)
# 3. Проверить timestamp (не старше 300 секунд)
```

### Проверка initData на backend'е:
```python
from hashlib import sha256
import hmac
from urllib.parse import unquote_plus, parse_qs
import json
from datetime import datetime

def verify_telegram_webapp(init_data: str, bot_token: str) -> dict:
    """Проверяет подпись WebApp initData"""
    
    # Распарсиваем
    data = parse_qs(init_data)
    
    # Берем подпись
    hash_value = data.get('hash', [''])[0]
    
    # Готовим данные для проверки (без самой подписи)
    check_data = {k: v[0] for k, v in data.items() if k != 'hash'}
    
    # Сортируем и форматируем
    data_check_string = '\n'.join(
        f'{k}={v}' for k, v in sorted(check_data.items())
    )
    
    # Вычисляем HMAC-SHA256
    secret = sha256(bot_token.encode()).digest()
    computed_hash = hmac.new(
        secret,
        data_check_string.encode(),
        sha256
    ).hexdigest()
    
    # Проверяем подпись
    if computed_hash != hash_value:
        raise ValueError('Invalid signature')
    
    # Проверяем timestamp (не старше 5 минут)
    auth_date = int(check_data.get('auth_date', 0))
    current_time = int(datetime.utcnow().timestamp())
    
    if current_time - auth_date > 300:
        raise ValueError('Auth data is too old')
    
    # Парсим user data
    user_data = json.loads(unquote_plus(check_data.get('user', '{}')))
    
    return user_data
```

---

## ✅ Чеклист реализации

### Frontend (ГОТОВО ✓)
- [x] TelegramAuth.tsx — простая кнопка со ссылкой в бота
- [x] /auth/callback страница — обработка кода
- [x] Zustand store сохраняет токен
- [x] localStorage персистенция

### Backend (ТРЕБУЕТСЯ ⏳)
- [ ] `/start=login` handler в боте (генерирует code и WebApp ссылку)
- [ ] `POST /api/auth/callback` эндпоинт (обмен кода на токен)
- [ ] Cache для хранения кодов (Redis или памяти)
- [ ] JWT токен генерация
- [ ] Проверка initData из WebApp (опционально, но рекомендуется)
- [ ] CORS для фронтенда

---

## 📊 Сравнение старого и нового подходов

| Фактор | Login Widget | WebApp |
|--------|-------------|--------|
| **Ввод телефона** | ❌ Да, требуется | ✅ Нет |
| **Скорость входа** | 🟡 5-10 сек | ✅ 1-2 сек |
| **UX** | 🟡 Нужно заполнять форму | ✅ Один клик |
| **Безопасность** | ✅ HMAC-SHA256 | ✅ HMAC-SHA256 + initData |
| **Поддержка мобилы** | 🟡 Ограничена | ✅ Полная |
| **Deep linking из бота** | ❌ Не поддерживает | ✅ Встроено |
| **Двусторонняя связь** | ❌ Нет | ✅ Да |

---

## 🎯 Следующие шаги

### Phase 10 (Backend WebApp)
1. Реализовать `/start=login` handler в боте
2. Реализовать `POST /api/auth/callback` эндпоинт
3. Добавить cache для кодов авторизации
4. Опционально: проверка initData

### Phase 11 (Оптимизация)
1. Deep linking из бота в приложение
2. Отправка сообщений из WebApp боту
3. Refresh token логика
4. Push notifications

---

## 📚 Полезные ссылки

- [Telegram WebApp Docs](https://core.telegram.org/bots/webapps)
- [Telegram Bot API Reference](https://core.telegram.org/bots/api)
- [WebApp Security](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)

---

**Status:** 🟢 **Frontend Ready** | 🟡 **Backend In Progress**

