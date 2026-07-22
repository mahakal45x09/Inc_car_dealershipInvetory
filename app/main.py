from fastapi import FastAPI
from app.api import auth, vehicles, purchase

app = FastAPI(title="Car Dealership API")

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(purchase.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
