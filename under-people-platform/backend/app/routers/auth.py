from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import delete, and_
from app.db.session import get_db
from app.models.models import User, AuthCode
from datetime import datetime, timedelta, timezone
import uuid
import logging

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.post("/callback")
async def auth_callback(
    code: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Обработка авторизации через Telegram
    
    КРИТИЧНО: telegram_id берётся из БД по auth_code, НЕ из WebApp initData!
    
    Flow:
    1. Получаем код из URL параметра
    2. Ищем код в БД (AuthCode таблица)
    3. Извлекаем telegram_id из записи кода
    4. Создаём/обновляем пользователя
    5. Помечаем код как использованный
    6. Возвращаем токен
    """
    
    try:
        logger.info(f"🔐 [AUTH CALLBACK] Auth callback received with code: {code[:8]}...")
        
        # Шаг 1: Проверяем код в БД
        now = datetime.now(timezone.utc)
        auth_code = db.query(AuthCode).filter(
            and_(
                AuthCode.code == code,
                AuthCode.used == False,
                AuthCode.expires_at > now
            )
        ).first()
        
        if not auth_code:
            logger.warning(f"❌ [AUTH CALLBACK] Invalid or expired auth code: {code[:8]}...")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authorization code"
            )
        
        # Шаг 2: Извлекаем telegram_id из кода
        telegram_id = auth_code.telegram_id
        logger.info(f"✅ [AUTH CALLBACK] Auth code validated for telegram_id: {telegram_id}")
        
        # Шаг 3: Ищем или создаём пользователя
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        
        if user:
            # Обновляем last_login
            user.last_login = datetime.now(timezone.utc)
            user.updated_at = datetime.now(timezone.utc)
            user.is_verified = True
            logger.info(f"✅ [AUTH CALLBACK] Existing user logged in: {user.id}")
        else:
            # Создаём нового пользователя
            user = User(
                telegram_id=telegram_id,
                username=f"User_{telegram_id}",
                up_coins=100,
                last_login=datetime.now(timezone.utc),
                is_verified=True
            )
            db.add(user)
            db.flush()  # Получаем ID без commit
            logger.info(f"✅ [AUTH CALLBACK] New user created: {user.id}, referral_code: {user.referral_code}")
        
        # Шаг 4: Помечаем код как использованный (одноразовый)
        auth_code.used = True
        auth_code.user_id = user.id
        auth_code.used_at = datetime.now(timezone.utc)
        
        # Commit всех изменений
        db.commit()
        db.refresh(user)
        
        # Шаг 5: Генерируем простой токен (в production используйте JWT)
        token = str(uuid.uuid4())
        
        logger.info(f"✅ [AUTH CALLBACK] Authentication successful for user {user.id}")
        
        return {
            "status": "ok",
            "token": token,
            "user": user.to_private_dict()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ [AUTH CALLBACK] Error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during authentication"
        )


@router.post("/generate-code")
async def generate_auth_code(
    telegram_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Endpoint для бота: генерирует одноразовый код авторизации
    
    Используется ботом при нажатии "Войти на сайт"
    POST /api/auth/generate-code?telegram_id=123456
    
    Возвращает код, который бот передаёт в WebApp ссылке:
    /auth/callback?code={CODE}
    """
    
    try:
        logger.info(f"🔐 [GENERATE CODE] Generating auth code for telegram_id: {telegram_id}")
        
        # Ищем пользователя в БД
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        
        # Генерируем одноразовый код
        code = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        
        # Сохраняем в БД
        auth_code = AuthCode(
            code=code,
            telegram_id=telegram_id,
            user_id=user.id if user else None,
            expires_at=expires_at
        )
        db.add(auth_code)
        db.commit()
        
        logger.info(f"✅ [GENERATE CODE] Auth code generated: {code[:8]}... for telegram_id: {telegram_id}")
        
        return {
            "status": "ok",
            "code": code,
            "expires_in": 600  # 10 минут в секундах
        }
    
    except Exception as e:
        logger.error(f"❌ [GENERATE CODE] Error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating auth code"
        )


@router.post("/logout")
async def logout(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Выход пользователя из системы
    
    Удаляет все auth_codes пользователя
    Клиент должен удалить токен из localStorage
    
    Headers: Authorization: Bearer {token}
    """
    try:
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authorization header"
            )
        
        # Извлекаем token из заголовка Authorization: Bearer {token}
        token = authorization.replace("Bearer ", "").strip()
        
        # Удаляем все неиспользованные коды для очистки
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=1)
        
        old_codes_count = db.query(AuthCode).filter(
            AuthCode.created_at < cutoff_time,
            AuthCode.used == False
        ).delete()
        
        db.commit()
        
        logger.info(f"✅ [LOGOUT] User logged out, cleaned up {old_codes_count} expired codes")
        
        return {
            "status": "ok",
            "message": "Successfully logged out"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ [LOGOUT] Error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during logout"
        )

