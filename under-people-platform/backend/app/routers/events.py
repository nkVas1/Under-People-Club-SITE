"""Events routes."""
import logging
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.event import Event

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/events", tags=["events"])


@router.get("/upcoming")
async def get_upcoming_events(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = None
):
    """Get upcoming events."""
    try:
        # Если db не передана в зависимость, это будет обработано FastAPI
        # Здесь используется прямое подключение для примера
        if db is None:
            from app.db.session import SessionLocal
            db = SessionLocal()
        
        # Получаем события которые еще не прошли
        now = datetime.utcnow()
        events = db.query(Event).filter(
            Event.start_date >= now,
            Event.is_active == 1
        ).order_by(
            Event.start_date.asc()
        ).limit(limit).offset(offset).all()
        
        return {
            "success": True,
            "events": [
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "start_date": event.start_date.isoformat(),
                    "end_date": event.end_date.isoformat() if event.end_date else None,
                    "location": event.location,
                    "price": event.price,
                    "image_url": event.image_url,
                    "capacity": event.capacity,
                }
                for event in events
            ],
            "count": len(events)
        }
    except Exception as e:
        logger.error(f"Error fetching upcoming events: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{event_id}")
async def get_event(event_id: int, db: Session = None):
    """Get event by ID."""
    try:
        if db is None:
            from app.db.session import SessionLocal
            db = SessionLocal()
        
        event = db.query(Event).filter(Event.id == event_id).first()
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return {
            "success": True,
            "event": {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "start_date": event.start_date.isoformat(),
                "end_date": event.end_date.isoformat() if event.end_date else None,
                "location": event.location,
                "price": event.price,
                "image_url": event.image_url,
                "capacity": event.capacity,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching event: {e}")
        raise HTTPException(status_code=500, detail=str(e))
