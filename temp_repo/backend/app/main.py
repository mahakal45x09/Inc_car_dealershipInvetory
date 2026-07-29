from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.api.api import api_router
from app.db.session import get_db

tags_metadata = [
    {"name": "auth", "description": "Authentication and authorization operations."},
    {"name": "users", "description": "User profile and account operations."},
    {"name": "vehicles", "description": "Manage vehicle inventory, image uploads, purchasing, and restocking."},
    {"name": "bookings", "description": "Manage vehicle bookings for customers."},
    {"name": "admin", "description": "Administrator dashboard statistics, user management, and comprehensive reports."}
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Car Dealership Inventory & Customer Management API with robust administration and booking system.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "AutoStock Pro Support",
        "email": "support@autostockpro.com",
    },
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Ensure static directory exists
os.makedirs("static/uploads/vehicles", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def read_root():
    return {"message": "Welcome to AutoStock Pro API"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AutoStock Pro API"}


@app.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(e)}",
        )
