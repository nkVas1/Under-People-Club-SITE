from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_telegram_auth
from app.models.models import User
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login/telegram")
async def telegram_login(auth_data: dict, db: Session = Depends(get_db)):
    """
    Вход через Telegram Widget
    """
    # Проверяем подпись
    auth_data_copy = auth_data.copy()
    if not verify_telegram_auth(auth_data_copy):
        raise HTTPException(status_code=403, detail="Invalid Telegram signature")

    telegram_id = int(auth_data.get('id'))
    
    # Ищем пользователя или создаем нового
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    
    if not user:
        ref_code = f"UP-{str(uuid.uuid4())[:8].upper()}"
        
        user = User(
            telegram_id=telegram_id,
            username=auth_data.get('username'),
            avatar_url=auth_data.get('photo_url'),
            referral_code=ref_code,
            up_coins=100,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "status": "ok",
        "user": {
            "id": str(user.id),
            "username": user.username,
            "coins": user.up_coins,
            "role": user.role,
            "ref_code": user.referral_code,
            "clan_name": user.clan_name,
            "avatar_url": user.avatar_url,
        }
    }

@router.post("/logout")
async def logout():
    """
    Выход пользователя
    """
    return {"status": "ok", "message": "Logged out"}
