from fastapi import FastAPI
from app.api import auth

app = FastAPI(title="Car Dealership API")

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
