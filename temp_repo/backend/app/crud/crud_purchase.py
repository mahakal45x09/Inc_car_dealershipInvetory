from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.purchase import Purchase
from app.schemas.purchase import PurchaseCreate

def create_purchase(db: Session, obj_in: PurchaseCreate) -> Purchase:
    db_obj = Purchase(
        user_id=obj_in.user_id,
        vehicle_id=obj_in.vehicle_id,
        price=obj_in.price
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_purchases(db: Session, skip: int = 0, limit: int = 100) -> List[Purchase]:
    return db.query(Purchase).order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()
