import os
import sys
from datetime import datetime, timezone

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.vehicle import Vehicle

def seed_database():
    db = SessionLocal()
    try:
        cars_data = [
            {
                "make": "BMW",
                "model": "3 Series",
                "category": "Sedan",
                "price": 45000.00,
                "quantity": 3,
                "year": 2024,
                "description": "A premium sports sedan with excellent driving dynamics.",
                "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Mercedes-Benz",
                "model": "C-Class",
                "category": "Sedan",
                "price": 52000.00,
                "quantity": 2,
                "year": 2024,
                "description": "Luxury meets performance in this beautiful hybrid sedan.",
                "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Audi",
                "model": "Q5",
                "category": "SUV",
                "price": 48500.00,
                "quantity": 5,
                "year": 2023,
                "description": "Spacious luxury SUV with Quattro all-wheel drive.",
                "image_url": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Toyota",
                "model": "Camry",
                "category": "Sedan",
                "price": 28000.00,
                "quantity": 10,
                "year": 2024,
                "description": "The most reliable daily driver on the market, now in hybrid.",
                "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Tesla",
                "model": "Model 3",
                "category": "Electric",
                "price": 42000.00,
                "quantity": 4,
                "year": 2024,
                "description": "High performance electric sedan with autopilot capabilities.",
                "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Porsche",
                "model": "Macan",
                "category": "SUV",
                "price": 68000.00,
                "quantity": 1,
                "year": 2024,
                "description": "A sports car in an SUV body.",
                "image_url": "https://images.unsplash.com/photo-1503376760367-133527e7d692?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Ford",
                "model": "F-150",
                "category": "Truck",
                "price": 45500.00,
                "quantity": 6,
                "year": 2023,
                "description": "America's best selling truck. Built Ford Tough.",
                "image_url": "https://images.unsplash.com/photo-1605816988019-35c3453b3fb3?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Chevrolet",
                "model": "Corvette",
                "category": "Coupe",
                "price": 85000.00,
                "quantity": 2,
                "year": 2024,
                "description": "Mid-engine supercar performance at a fraction of the price.",
                "image_url": "https://images.unsplash.com/photo-1623194098485-780c1070e6c6?q=80&w=800&auto=format&fit=crop"
            },
            {
                "make": "Rivian",
                "model": "R1T",
                "category": "Electric",
                "price": 75000.00,
                "quantity": 0,
                "year": 2024,
                "description": "The ultimate electric adventure vehicle.",
                "image_url": "https://images.unsplash.com/photo-1662991032338-e696ddb26a6c?q=80&w=800&auto=format&fit=crop"
            }
        ]

        # Check if vehicles already exist to avoid duplicates
        existing_count = db.query(Vehicle).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} vehicles. Deleting existing vehicles...")
            db.query(Vehicle).delete()
            db.commit()
            print("Deleted old vehicles.")

        for car in cars_data:
            vehicle = Vehicle(**car)
            db.add(vehicle)
        
        db.commit()
        print("Successfully seeded the database with vehicles!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
