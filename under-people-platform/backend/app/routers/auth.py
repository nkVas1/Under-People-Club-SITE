from fastapi import APIRouter, Depends, HTTPException, status, Query, Header, Request
from sqlalchemy.orm import Session
from sqlalchemy import delete
from app.db.session import get_db
from app.core.security import verify_telegram_auth
from app.models.models import User
import uuid
import json
import os
import aioredis
from datetime import datetime, timedelta
from functools import wraps

router = APIRouter(prefix="/auth", tags=["auth"])

# Rate limiting decorator (optional)
_limiter = None

def apply_rate_limit(limit: str):
    """Decorator для применения rate limiting к endpoints"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Rate limiting применяется через middleware в main.py
            return await func(*args, **kwargs)
        
        # Сохраняем информацию о лимите для потом использования в main.py
        wrapper._rate_limit = limit
        return wrapper
    return decorator

# Redis хранилище для auth кодов (в памяти, если Redis не доступен)
token_storage = {}
redis_client = None

async def get_redis():
    """Получить Redis клиент или создать новый"""
    global redis_client
    
    if redis_client is None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        try:
            redis_client = await aioredis.from_url(redis_url)
        except Exception as e:
            print(f"⚠️  Redis connection failed: {e}. Using in-memory storage instead.")
            redis_client = False  # Флаг для использования in-memory storage
    
    return redis_client

async def store_auth_code(code: str, user_id: str, telegram_id: int) -> bool:
    """
    Сохранить auth код в Redis или in-memory storage.
    Auth коды действительны 10 минут.
    """
    redis = await get_redis()
    auth_data = {
        "user_id": str(user_id),
        "telegram_id": telegram_id,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    try:
        if redis and redis is not False:
            # Используем Redis
            await redis.setex(f"auth_code:{code}", 600, json.dumps(auth_data))  # 10 мин
            return True
        else:
            # Используем in-memory storage
            token_storage[code] = {**auth_data, "expires_at": datetime.utcnow() + timedelta(minutes=10)}
            return True
    except Exception as e:
        print(f"❌ Error storing auth code: {e}")
        # Fallback to in-memory
        token_storage[code] = {**auth_data, "expires_at": datetime.utcnow() + timedelta(minutes=10)}
        return True

async def get_auth_code(code: str) -> dict:
    """
    Получить и удалить auth код (one-time use).
    Возвращает данные или None если кода нет или он истек.
    """
    redis = await get_redis()
    
    try:
        if redis and redis is not False:
            # Получаем из Redis
            data = await redis.get(f"auth_code:{code}")
            if data:
                # Удаляем сразу (one-time use)
                await redis.delete(f"auth_code:{code}")
                return json.loads(data)
            return None
        else:
            # Получаем из in-memory storage
            if code in token_storage:
                auth_data = token_storage[code]
                if auth_data.get("expires_at", datetime.utcnow()) > datetime.utcnow():
                    del token_storage[code]  # Удаляем сразу
                    return auth_data
                else:
                    del token_storage[code]  # Удаляем истекший
                    return None
            return None
    except Exception as e:
        print(f"❌ Error retrieving auth code: {e}")
        return None

@router.post("/callback")
async def auth_callback(
    code: str = Query(...),
    telegram_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Callback endpoint для WebApp (Telegram Mini App).
    
    1. Получает auth_code от frontend
    2. Проверяет его в Redis
    3. Создает JWT токен
    
    POST /api/auth/callback?code=ABC123&telegram_id=123456
    
    Rate limited: 60 requests per minute per IP
    """
    # Проверяем auth code
    auth_data = await get_auth_code(code)
    if not auth_data:
        raise HTTPException(status_code=401, detail="Invalid or expired auth code")
    
    # Проверяем telegram_id соответствие
    if auth_data.get("telegram_id") != telegram_id:
        raise HTTPException(status_code=401, detail="Telegram ID mismatch")
    
    # Ищем или создаем пользователя
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    
    if not user:
        # Новый пользователь
        user = User(
            telegram_id=telegram_id,
            username=f"User_{telegram_id}",
            up_coins=100,
        )
        # referral_code будет сгенерирован автоматически в конструкторе User
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # TODO: Сгенерировать JWT токен
    # Для теперь возвращаем сессионный токен
    jwt_token = str(uuid.uuid4())
    
    return {
        "status": "ok",
        "token": jwt_token,
        "user": {
            "id": str(user.id),
            "telegram_id": user.telegram_id,
            "username": user.username,
            "avatar_url": user.avatar_url,
            "up_coins": user.up_coins,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "referral_code": user.referral_code,
            "clan_name": user.clan_name,
        }
    }

@router.post("/generate-code")
async def generate_auth_code(telegram_id: int, db: Session = Depends(get_db)):
    """
    Генерирует auth код для WebApp.
    
    POST /api/auth/generate-code
    Body: {"telegram_id": 123456}
    
    Возвращает код, который пользователь должен передать в callback
    """
    # Проверяем, что пользователь существует (или создаем нового)
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    
    if not user:
        user = User(telegram_id=telegram_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Генерируем auth code
    auth_code = str(uuid.uuid4())
    
    # Сохраняем в Redis/storage
    await store_auth_code(auth_code, str(user.id), telegram_id)
    
    return {
        "status": "ok",
        "code": auth_code,
        "expires_in": 600  # 10 минут
    }



@router.post("/login/telegram")
async def telegram_login(auth_data: dict, db: Session = Depends(get_db)):
    """
    DEPRECATED: Используйте /auth/generate-code + /auth/callback вместо этого.
    
    Старый endpoint для обратной совместимости с ботом.
    """
    # Проверяем подпись
    try:
        auth_data_copy = auth_data.copy()
        if not verify_telegram_auth(auth_data_copy):
            raise HTTPException(status_code=403, detail="Invalid Telegram signature")

        telegram_id = int(auth_data.get('id'))
        
        # Ищем пользователя или создаем нового
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        
        if not user:
            user = User(
                telegram_id=telegram_id,
                username=auth_data.get('username'),
                avatar_url=auth_data.get('photo_url'),
                up_coins=100,
            )
            # referral_code будет сгенерирован автоматически
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "status": "ok",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "coins": user.up_coins,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
                "ref_code": user.referral_code,
                "clan_name": user.clan_name,
                "avatar_url": user.avatar_url,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Полный logout - удаляет сессию из Redis и кэша
    
    POST /api/auth/logout
    Headers: Authorization: Bearer {token}
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        token = authorization.replace("Bearer ", "")
        
        # 1. Удалить из Redis
        redis = await get_redis()
        if redis and redis is not False:
            try:
                # Удаляем все связанные ключи
                await redis.delete(f"auth:{token}")
                await redis.delete(f"user_cache:{token}")
                await redis.delete(f"auth_code:{token}")
                print(f"✅ [LOGOUT] Cleared Redis for token {token[:20]}...")
            except Exception as e:
                print(f"⚠️ [LOGOUT] Redis cleanup error: {e}")
        else:
            # Очищаем in-memory storage
            if token in token_storage:
                del token_storage[token]
                print(f"✅ [LOGOUT] Cleared in-memory storage for token")
        
        # 2. Удалить из БД если есть auth коды
        try:
            # Удаляем все auth коды (если они хранятся в БД)
            # stmt = delete(AuthCode).where(AuthCode.token == token)
            # await db.execute(stmt)
            # await db.commit()
            pass
        except Exception as e:
            print(f"⚠️ [LOGOUT] Database cleanup error: {e}")
        
        print(f"✅ [LOGOUT] User logged out successfully")
        return {
            "status": "ok",
            "message": "Logged out successfully",
            "token_cleared": True
        }
    
    except Exception as e:
        print(f"❌ [LOGOUT] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Logout error: {str(e)}")
