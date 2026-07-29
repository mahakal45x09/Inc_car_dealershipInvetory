import asyncio
import random

from app.database.base import Base
from app.database.database import SessionLocal, engine
from app.models.vehicle import Vehicle


async def seed_50_cars():
    print("Seeding 50 premium vehicles...")

    db = SessionLocal()

    images = [
        "https://images.unsplash.com/photo-1503376712351-56fc4c9ac18e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519641471654-76ce0107e4d8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?auto=format&fit=crop&q=80&w=800",
    ]

    brands = {
        "BMW": ["M3", "M4", "X5", "7 Series", "i4", "X7", "M5", "Z4"],
        "Audi": ["R8", "RS e-tron GT", "Q8", "RS6 Avant", "A8", "S5", "Q7"],
        "Mercedes-Benz": [
            "G-Class",
            "S-Class",
            "AMG GT",
            "EQS",
            "C-Class",
            "GLE",
            "SL Roadster",
        ],
        "Porsche": [
            "911 Carrera",
            "Taycan Turbo S",
            "Cayenne",
            "Panamera",
            "Macan",
            "911 GT3",
        ],
        "Tesla": [
            "Model S Plaid",
            "Model X",
            "Model 3 Performance",
            "Cybertruck",
            "Roadster",
        ],
        "Toyota": ["Supra", "Land Cruiser", "Tundra Capstone", "Sequoia", "Crown"],
        "Land Rover": ["Range Rover", "Defender 110", "Range Rover Sport", "Velar"],
        "Lexus": ["LC 500", "LX 600", "LS 500", "RX 350", "IS 500 F Sport"],
    }

    categories = [
        "Luxury Sedans",
        "Sports Cars",
        "Electric SUVs",
        "SUV",
        "Truck",
        "Coupe",
        "Convertible",
    ]

    descriptions = [
        "Experience the perfect blend of performance and luxury with this incredible vehicle.",
        "Meticulously maintained and packed with premium features. A true joy to drive.",
        "Unmatched performance, cutting-edge technology, and stunning aesthetics.",
        "The ultimate driving machine. Powerful, elegant, and ready for any journey.",
        "Elevate your daily commute with premium materials and advanced safety systems.",
        "A masterpiece of engineering. Delivers thrilling acceleration and pinpoint handling.",
        "Spacious, luxurious, and capable. The perfect vehicle for family road trips.",
        "Head-turning design paired with an adrenaline-pumping driving experience.",
    ]

    generated_vehicles = []

    for _ in range(50):
        make = random.choice(list(brands.keys()))
        model = random.choice(brands[make])

        # Infer category somewhat realistically
        cat = "Luxury Sedans"
        if (
            "SUV" in model
            or "X" in model
            or "Q" in model
            or "G-Class" in model
            or "Cruiser" in model
            or "Defender" in model
            or "Cayenne" in model
        ):
            cat = "SUV"
        if (
            "M3" in model
            or "M4" in model
            or "GT" in model
            or "911" in model
            or "Supra" in model
            or "R8" in model
            or "LC" in model
        ):
            cat = "Sports Cars"
        if "e-tron" in model or "Taycan" in model or "Plaid" in model or "EQS" in model:
            cat = "Electric SUVs" if "SUV" in cat else "Luxury Sedans"  # Electric
        if "Tundra" in model or "Cybertruck" in model:
            cat = "Truck"
        if "Roadster" in model or "Z4" in model or "SL" in model:
            cat = "Convertible"

        price = random.randint(45000, 150000)
        quantity = random.randint(0, 12)  # Some out of stock
        img = random.choice(images)
        desc = random.choice(descriptions)

        v = Vehicle(
            make=make,
            model=model,
            category=cat,
            price=float(price),
            quantity=quantity,
            image_url=img,
            description=desc,
        )
        generated_vehicles.append(v)

    for v_data in generated_vehicles:
        db.add(v_data)

    db.commit()
    db.close()
    print("50 vehicles successfully added to the database!")


if __name__ == "__main__":
    asyncio.run(seed_50_cars())
