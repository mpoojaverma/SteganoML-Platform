from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.encode import router as encode_router
from app.routes.decode import router as decode_router
from app.routes.jobs import router as jobs_router
from app.routes.stats import router as stats_router


# =========================================================
# FASTAPI INITIALIZATION
# =========================================================

app = FastAPI(
    title="SteganoML API",
    description="ML-powered adaptive audio steganography platform",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTE REGISTRATION
# =========================================================

app.include_router(
    health_router,
    prefix="/api/health",
    tags=["Health"]
)

app.include_router(
    encode_router,
    prefix="/api/encode",
    tags=["Encode"]
)

app.include_router(
    decode_router,
    prefix="/api/decode",
    tags=["Decode"]
)

app.include_router(
    jobs_router,
    prefix="/api/jobs",
    tags=["Jobs"]
)

app.include_router(
    stats_router,
    prefix="/api/stats",
    tags=["Stats"]
)

# =========================================================
# ROOT ROUTE
# =========================================================

@app.get("/")
async def root():
    return {
        "message": "SteganoML backend is running."
    }