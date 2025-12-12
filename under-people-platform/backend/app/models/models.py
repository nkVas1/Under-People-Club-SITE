import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Enum, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserRole(str, PyEnum):
    RANGER = "ranger"
    STALKER = "stalker"
    ELDER = "elder"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    telegram_id = Column(Integer, unique=True, index=True)
    username = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Economy
    up_coins = Column(Integer, default=100)
    clan_name = Column(String, default="Outcasts")
    
    # Referral System
    referral_code = Column(String, unique=True, index=True)
    invited_by_code = Column(String, ForeignKey("users.referral_code"), nullable=True)
    
    # Status
    role = Column(Enum(UserRole), default=UserRole.RANGER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    # Relationships
    referrals = relationship("User", backref="referrer", remote_side=[referral_code])
    orders = relationship("Order", back_populates="user")
    cards = relationship("UserCard", back_populates="user")


class Rarity(str, PyEnum):
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"

class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    rarity = Column(Enum(Rarity), default=Rarity.COMMON)
    power = Column(Integer, default=10)
    clan = Column(String, default="Outcasts")

class UserCard(Base):
    __tablename__ = "user_cards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    is_locked = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="cards")
    card = relationship("Card")

class ProductType(str, PyEnum):
    TICKET = "ticket"
    GEAR = "gear"
    DIGITAL = "digital"

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    image_url = Column(String)
    product_type = Column(Enum(ProductType))
    stock = Column(Integer, default=-1)
    is_active = Column(Boolean, default=True)

class OrderStatus(str, PyEnum):
    PENDING = "pending"
    WAITING_APPROVAL = "waiting"
    PAID = "paid"
    CANCELED = "canceled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    amount_rub = Column(Integer)
    coins_used = Column(Integer, default=0)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_proof_url = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    product = relationship("Product")

class MarketListing(Base):
    __tablename__ = "market_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    user_card_id = Column(Integer, ForeignKey("user_cards.id"), unique=True)
    price = Column(Integer, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
