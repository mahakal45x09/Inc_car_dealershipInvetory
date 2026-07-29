from decimal import Decimal
import pytest

from app.models import Base, User, Vehicle, Booking, Review


def test_create_user_and_vehicle(db):

    user = User(
        email="test@example.com",
        hashed_password="secret_hashed_password",
        full_name="John Doe",
    )
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=Decimal("25000.00"),
        quantity=5,
        year=2023,
    )

    db.add(user)
    db.add(vehicle)
    db.commit()
    db.refresh(user)
    db.refresh(vehicle)

    assert user.id is not None
    assert user.email == "test@example.com"
    assert vehicle.id is not None
    assert vehicle.make == "Toyota"


def test_booking_relationship(db):
    user = User(email="buyer@example.com", hashed_password="pw")
    vehicle = Vehicle(
        make="Tesla",
        model="Model 3",
        category="EV",
        price=Decimal("45000.00"),
        quantity=3,
    )
    db.add(user)
    db.add(vehicle)
    db.commit()

    booking = Booking(
        user_id=user.id,
        vehicle_id=vehicle.id,
        quantity=1,
        total_price=Decimal("45000.00"),
    )
    db.add(booking)
    db.commit()
    db.refresh(user)

    assert len(user.bookings) == 1
    assert user.bookings[0].vehicle.model == "Model 3"


def test_review_relationship(db):
    user = User(email="reviewer@example.com", hashed_password="pw")
    vehicle = Vehicle(
        make="Ford",
        model="Mustang",
        category="Sports",
        price=Decimal("55000.00"),
        quantity=2,
    )
    db.add(user)
    db.add(vehicle)
    db.commit()

    review = Review(
        user_id=user.id,
        vehicle_id=vehicle.id,
        rating=5,
        comment="Amazing performance!",
    )
    db.add(review)
    db.commit()
    db.refresh(vehicle)

    assert len(vehicle.reviews) == 1
    assert vehicle.reviews[0].comment == "Amazing performance!"
    assert vehicle.reviews[0].user.email == "reviewer@example.com"
