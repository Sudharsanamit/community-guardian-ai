from datetime import datetime, timezone

from fastapi import FastAPI  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Community Guardian AI API",
    description="Backend API for the Community Guardian AI Decision Intelligence Platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Community Guardian AI API is running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "community-guardian-ai-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }