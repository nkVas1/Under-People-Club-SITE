from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User
from datetime import datetime, timedelta
import hashlib
import json

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def get_current_user(
    response: Response,
    current_user: dict = Depends(lambda: {}),  # Placeholder для JWT в будущем
    db: Session = Depends(get_db)
):
    """
    Получить текущего пользователя - защищено от excessive polling.
    
    GET /api/users/me
    
    Кэширование: 5 минут (max-age=300)
    """
    # TODO: В будущем подставить реального current_user из JWT токена
    # Пока это placeholder - нужно интегрировать с JWT middleware
    
    # Для локального тестирования - получить первого пользователя
    user = db.query(User).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Генерируем ETag на основе ID и времени обновления
    etag_source = f"{user.id}:{user.last_login or user.created_at}".encode()
    etag = hashlib.md5(etag_source).hexdigest()
    
    # Добавляем кэширующие заголовки
    response.headers["Cache-Control"] = "private, max-age=300"  # 5 минут
    response.headers["ETag"] = f'"{etag}"'
    response.headers["Vary"] = "Authorization"
    
    return {
        "id": str(user.id),
        "telegram_id": user.telegram_id,
        "username": user.username,
        "avatar_url": user.avatar_url,
        "up_coins": user.up_coins,
        "clan_name": user.clan_name,
        "referral_code": user.referral_code,
        "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }

@router.post("/me/refresh")
async def refresh_user_cache(response: Response, db: Session = Depends(get_db)):
    """
    Принудительно обновить кэш пользователя - игнорирует ETag.
    
    POST /api/users/me/refresh
    
    Возвращает свежие данные без кэша
    """
    # TODO: Подставить реального current_user из JWT
    user = db.query(User).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Явно отключаем кэширование для refresh endpoint
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    return {
        "id": str(user.id),
        "telegram_id": user.telegram_id,
        "username": user.username,
        "avatar_url": user.avatar_url,
        "up_coins": user.up_coins,
        "clan_name": user.clan_name,
        "referral_code": user.referral_code,
        "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }



@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """
    Получить профиль пользователя
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user.id),
        "username": user.username,
        "coins": user.up_coins,
        "clan_name": user.clan_name,
        "avatar_url": user.avatar_url,
        "ref_code": user.referral_code,
        "role": user.role,
        "created_at": user.created_at,
    }

@router.get("/u/{referral_code}")
async def get_public_profile(referral_code: str, db: Session = Depends(get_db)):
    """Get public user profile by referral code."""
    try:
        user = db.query(User).filter(User.referral_code == referral_code).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Возвращаем только публичные данные
        return {
            "success": True,
            "user": {
                "id": str(user.id),
                "full_name": user.username or "Member",
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "achievements_count": 0,  # Placeholder для расширения в будущем
                "referral_code": user.referral_code,
                "photo_url": user.avatar_url,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    """
    Получить топ пользователей по UP Coins
    """
    users = db.query(User).filter(User.is_active == True).order_by(User.up_coins.desc()).limit(limit).all()
    
    return {
        "leaderboard": [
            {
                "rank": idx + 1,
                "username": user.username,
                "coins": user.up_coins,
                "clan": user.clan_name,
            }
            for idx, user in enumerate(users)
        ]
    }

