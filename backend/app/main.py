import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.encode import router as encode_router
from app.routes.decode import router as decode_router
from app.routes.jobs import router as jobs_router
from app.routes.stats import router as stats_router
from app.routes import analytics

app = FastAPI(
    title="SteganoML API",
    description="ML-powered adaptive audio steganography platform",
    version="1.0.0"
)

# Resolve explicit allowed UI origins via environment injections with local fallback
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "https://steganoml-platform.vercel.app",
    "https://steganoml.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Route registrations with unified prefix logic
app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(encode_router, prefix="/api/encode", tags=["Encode"])
app.include_router(decode_router, prefix="/api/decode", tags=["Decode"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(stats_router, prefix="/api/stats", tags=["Stats"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "message": "SteganoML structural core engine backend actively running.",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "production")
    }