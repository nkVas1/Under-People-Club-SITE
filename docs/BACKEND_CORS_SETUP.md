# 🔐 Backend CORS Configuration Guide

**Для:** Python Flask/FastAPI backend на Railway  
**Проблема:** Frontend (Vercel) не может достучаться до Backend из-за CORS

---

## 📋 Что такое CORS?

**CORS (Cross-Origin Resource Sharing)** — механизм браузера, который блокирует запросы с одного домена на другой для безопасности.

```
Frontend: https://under-people-club.vercel.app
Backend:  https://upcworldbot-production.up.railway.app

Браузер видит разные домены и блокирует запрос ❌
Нужно добавить CORS headers на backend'е ✅
```

---

## 🛠️ Решение для Flask

### Вариант 1: Простой (рекомендуется)

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Разрешаем CORS для Vercel домена
CORS(app, origins=[
    'https://under-people-club.vercel.app',
    'http://localhost:3000'  # Для разработки
])

@app.route('/api/auth/callback', methods=['POST'])
def auth_callback():
    # Ваш код авторизации
    return {
        'access_token': token,
        'user': user_data
    }
```

### Вариант 2: Детальный контроль

```python
@app.before_request
def handle_preflight():
    """Обработка OPTIONS запросов (preflight)"""
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", 
                           "https://under-people-club.vercel.app")
        response.headers.add("Access-Control-Allow-Headers", 
                           "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", 
                           "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Max-Age", "3600")
        return response

@app.after_request
def after_request(response):
    """Добавляем CORS headers ко всем ответам"""
    response.headers.add('Access-Control-Allow-Origin',
                        'https://under-people-club.vercel.app')
    response.headers.add('Access-Control-Allow-Headers',
                        'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                        'GET, POST, PUT, DELETE, OPTIONS')
    return response
```

---

## 🛠️ Решение для FastAPI

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://under-people-club.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/callback")
async def auth_callback(data: dict):
    # Ваш код авторизации
    return {
        "access_token": token,
        "user": user_data
    }
```

---

## ✅ Проверка CORS

### В браузере (DevTools):

1. **Откройте DevTools** (F12)
2. **Network tab**
3. **Нажмите "Войти через Telegram"**
4. **Найдите POST запрос на `/api/auth/callback`**
5. **Проверьте Response Headers:**

✅ **Должны быть:**
```
Access-Control-Allow-Origin: https://under-people-club.vercel.app
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

❌ **Если их нет** → CORS не настроен

### Из терминала (curl):

```bash
curl -X OPTIONS https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Origin: https://under-people-club.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Должны увидеть заголовки `Access-Control-Allow-*` в ответе.

---

## 🔧 Установка зависимостей

### Для Flask:
```bash
pip install flask-cors
```

### Для FastAPI:
```bash
# FastAPI уже имеет встроенный CORS middleware
# Ничего устанавливать не нужно
```

---

## 📝 Полный пример (Flask)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS Configuration
CORS(app, origins=[
    'https://under-people-club.vercel.app',
    'http://localhost:3000'
])

@app.route('/api/auth/callback', methods=['POST', 'OPTIONS'])
def auth_callback():
    if request.method == 'OPTIONS':
        return '', 204  # Respuesta vacía para OPTIONS
    
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return {'error': 'Missing code'}, 400
    
    try:
        # Ваша логика: обмен кода на токен
        user_id = cache.get(f'auth_code:{code}')
        
        if not user_id:
            return {'error': 'Invalid code'}, 401
        
        # Ищем/создаем пользователя
        user = User.query.filter_by(telegram_id=user_id).first()
        if not user:
            user = User(telegram_id=user_id, username=f'user_{user_id}')
            db.session.add(user)
            db.session.commit()
        
        # Генерируем токен
        access_token = create_access_token(user_id=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': str(user.id),
                'username': user.username,
                'telegram_id': user.telegram_id,
                'up_coins': user.up_coins,
                'role': user.role,
                'clan': user.clan,
                'ref_code': user.ref_code,
                'is_verified': True
            }
        })
    
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
```

---

## 🚀 Развертывание на Railway

1. **Добавьте CORS в код**
2. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "Add CORS configuration for Vercel integration"
   git push origin main
   ```
3. **Railway автоматически пересоберёт проект**
4. **Проверьте логи:** Railway Dashboard → Deployments
5. **Тестируйте с Vercel**: https://under-people-club.vercel.app/shelter

---

## 🧪 Полный тестовый цикл

```bash
# 1. Локально (с CORS):
npm run dev              # Frontend на localhost:3000
python main.py          # Backend на localhost:8000

# .env.local для фронтенда:
NEXT_PUBLIC_API_URL=http://localhost:8000

# 2. Тестируем авторизацию:
# - Откроем http://localhost:3000/shelter
# - Нажмем "Войти через Telegram"
# - Проверим логи в браузере и backend'е

# 3. На production (Railway + Vercel):
# - URL: https://under-people-club.vercel.app/shelter
# - То же самое, но с production API
```

---

## ✅ Чеклист

- [ ] Flask-cors установлена (`pip install flask-cors`)
- [ ] CORS middleware добавлена в app
- [ ] allow_origins содержит Vercel домен
- [ ] Backend обрабатывает OPTIONS запросы
- [ ] Эндпоинт POST /api/auth/callback реализован
- [ ] Возвращает JSON с access_token и user
- [ ] Все изменения закоммичены и запушены на Railway
- [ ] Railway пересобрал проект
- [ ] Локальное тестирование работает
- [ ] Production авторизация работает ✨

---

**Когда это работает:** Frontend и Backend могут общаться через интернет, авторизация работает на Vercel → Railway!

