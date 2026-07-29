import asyncio

from app.core.security import get_password_hash
from app.database.base import Base
from app.database.database import SessionLocal, engine
from app.models.user import Role, User
from app.models.vehicle import Vehicle


async def seed_db():
    print("Seeding database...")

    # Optional: Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Seed Admin User
    admin = db.query(User).filter(User.email == "admin@dealership.com").first()
    if not admin:
        admin = User(
            email="admin@dealership.com",
            hashed_password=get_password_hash("Admin@123!"),
            role=Role.ADMIN,
        )
        db.add(admin)

    # Seed Normal User
    user = db.query(User).filter(User.email == "user@dealership.com").first()
    if not user:
        user = User(
            email="user@dealership.com",
            hashed_password=get_password_hash("User@123!"),
            role=Role.USER,
        )
        db.add(user)

    # Seed Vehicles
    vehicles = [
        Vehicle(
            make="Toyota",
            model="Camry XSE",
            category="Sedan",
            price=32000.00,
            quantity=5,
            image_url="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800",
            description="The ultimate premium sedan for everyday driving.",
        ),
        Vehicle(
            make="Ford",
            model="Mustang GT",
            category="Sports",
            price=45000.00,
            quantity=2,
            image_url="https://images.unsplash.com/photo-1584345611127-8dd8ea2b5d4e?auto=format&fit=crop&q=80&w=800",
            description="Classic American muscle with modern performance.",
        ),
        Vehicle(
            make="Tesla",
            model="Model Y",
            category="SUV",
            price=52000.00,
            quantity=10,
            image_url="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
            description="All-electric dual motor all-wheel drive SUV.",
        ),
        Vehicle(
            make="Honda",
            model="Civic Type R",
            category="Sports",
            price=43000.00,
            quantity=0,
            image_url="https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&q=80&w=800",
            description="Hot hatch with aggressive styling and turbo power. Currently out of stock.",
        ),
    ]

    for v_data in vehicles:
        existing = (
            db.query(Vehicle)
            .filter(Vehicle.make == v_data.make, Vehicle.model == v_data.model)
            .first()
        )
        if not existing:
            db.add(v_data)

    db.commit()
    db.close()
    print("Database seeded successfully!")
    print("Admin: admin@dealership.com / Admin@123!")
    print("User: user@dealership.com / User@123!")


if __name__ == "__main__":
    asyncio.run(seed_db())
