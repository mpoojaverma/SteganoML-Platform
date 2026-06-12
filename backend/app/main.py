import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.encode import router as encode_router
from app.routes.decode import router as decode_router
from app.routes.jobs import router as jobs_router
from app.routes.stats import router as stats_router
from app.routes import analytics
from app.routes.share import router as share_router

from app.utils.rate_limiter import RateLimitMiddleware
from fastapi import Request

app = FastAPI(
    title="SteganoML API",
    description="ML-powered adaptive audio steganography platform",
    version="1.0.0"
)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://stegano-ml-platform.vercel.app",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url)

# Apply Rate Limiting Middleware
app.add_middleware(RateLimitMiddleware, requests_per_minute=30)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply Global HTTP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(encode_router, prefix="/api/encode", tags=["Encode"])
app.include_router(decode_router, prefix="/api/decode", tags=["Decode"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(stats_router, prefix="/api/stats", tags=["Stats"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(share_router, prefix="/api/share", tags=["Share"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "message": "SteganoML backend is running.",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "production")
    }