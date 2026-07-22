from fastapi import FastAPI
from app.api import auth

app = FastAPI(title="Car Dealership API")

# TDD RED Phase: Commenting this out will make the endpoint unavailable, causing tests to fail!
# app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
