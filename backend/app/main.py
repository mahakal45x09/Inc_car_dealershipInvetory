from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, history, metrics, purchase, restock, vehicles

app = FastAPI(title="Car Dealership API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(purchase.router)
app.include_router(restock.router)
app.include_router(metrics.router)
app.include_router(history.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
