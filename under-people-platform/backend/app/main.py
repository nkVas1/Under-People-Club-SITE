from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routers import auth, users, products, events

# Rate limiting (optionally install slowapi)
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    
    limiter = Limiter(key_func=get_remote_address)
    RATE_LIMITING_ENABLED = True
except ImportError:
    RATE_LIMITING_ENABLED = False
    print("⚠️ slowapi not installed - rate limiting disabled")

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    debug=settings.DEBUG,
)

# Rate limiting
if RATE_LIMITING_ENABLED:
    app.state.limiter = limiter
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
        return {
            "detail": "Too many requests. Rate limit exceeded.",
            "retry_after": exc.detail
        }

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(events.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Under People API is running"}

@app.get("/")
async def root():
    return {
        "app": settings.API_TITLE,
        "version": settings.API_VERSION,
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
