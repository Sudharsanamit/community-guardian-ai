from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.decision import router as decision_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.reports import router as reports_router
from app.api.routes.forecast import router as forecast_router
from app.api.routes.workflow import router as workflow_router

app = FastAPI(
    title="Community Guardian AI API",
    description="AI-powered decision intelligence platform for smarter communities.",
    version="1.0.0",
)

# Updated CORSMiddleware section as per instructions
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "https://community-guardian-ai.web.app",
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
app.include_router(forecast_router)
app.include_router(workflow_router)