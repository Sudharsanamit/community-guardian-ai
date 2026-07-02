from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.decision import router as decision_router

from app.api.routes.dashboard import router as dashboard_router

from app.api.routes.reports import router as reports_router

app = FastAPI(
    title="Community Guardian AI API",
    description="AI-powered decision intelligence platform for smarter communities.",
    version="1.0.0",
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


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "healthy",
        "service": "Community Guardian AI FastAPI backend",
    }


app.include_router(dashboard_router)
app.include_router(decision_router)
app.include_router(reports_router)