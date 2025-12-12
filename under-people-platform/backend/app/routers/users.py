from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User

router = APIRouter(prefix="/users", tags=["users"])

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
