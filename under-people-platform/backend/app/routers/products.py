from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
async def get_products(db: Session = Depends(get_db)):
    """
    Получить список всех товаров
    """
    products = db.query(Product).filter(Product.is_active == True).all()
    
    return {
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": p.price,
                "image_url": p.image_url,
                "type": p.product_type,
            }
            for p in products
        ]
    }

@router.get("/{product_id}")
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Получить информацию о товаре
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "image_url": product.image_url,
        "type": product.product_type,
        "stock": product.stock,
    }
