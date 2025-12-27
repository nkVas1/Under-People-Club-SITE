"""Events database model."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from app.db.base import Base


class Event(Base):
    """Event model for upcoming club events."""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    price = Column(Float, default=0.0)
    image_url = Column(String, nullable=True)
    capacity = Column(Integer, nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
