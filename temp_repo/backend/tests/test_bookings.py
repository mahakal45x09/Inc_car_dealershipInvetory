import pytest
from app.models.user import User
from app.core.security import get_password_hash

@pytest.fixture
def admin_token(client, db):
    user = User(email="admin_booking@example.com", hashed_password=get_password_hash("adminpass"), is_admin=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    login_res = client.post("/api/login/access-token", data={"username": "admin_booking@example.com", "password": "adminpass"})
    return login_res.json()["access_token"]


@pytest.fixture
def user_token(client, db):
    user = User(email="user_booking@example.com", hashed_password=get_password_hash("userpass"), is_admin=False)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    login_res = client.post("/api/login/access-token", data={"username": "user_booking@example.com", "password": "userpass"})
    return login_res.json()["access_token"]


def test_create_booking(client, admin_token, user_token):
    # Create vehicle
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Tesla", "model": "Model Y", "category": "EV", "price": "50000.00", "quantity": 2})
    vid = res.json()["id"]
    
    # Create booking
    res_booking = client.post(
        "/api/bookings/", 
        headers={"Authorization": f"Bearer {user_token}"},
        json={"vehicle_id": vid, "quantity": 1}
    )
    assert res_booking.status_code == 201
    data = res_booking.json()
    assert data["vehicle_id"] == vid
    assert data["quantity"] == 1
    assert data["total_price"] == "50000.00"
    assert data["status"] == "completed"
    
    # Check if stock reduced
    res_vehicle = client.get(f"/api/vehicles/{vid}")
    assert res_vehicle.json()["quantity"] == 1


def test_create_booking_not_enough_stock(client, admin_token, user_token):
    # Create vehicle
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Ford", "model": "Mustang", "category": "Sports", "price": "40000.00", "quantity": 1})
    vid = res.json()["id"]
    
    # Create booking for 2
    res_booking = client.post(
        "/api/bookings/", 
        headers={"Authorization": f"Bearer {user_token}"},
        json={"vehicle_id": vid, "quantity": 2}
    )
    assert res_booking.status_code == 400
    assert "Not enough stock" in res_booking.json()["detail"]


def test_get_booking_history(client, admin_token, user_token):
    # Create vehicle
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Audi", "model": "A4", "category": "Sedan", "price": "35000.00", "quantity": 5})
    vid = res.json()["id"]
    
    # Create 2 bookings
    client.post("/api/bookings/", headers={"Authorization": f"Bearer {user_token}"}, json={"vehicle_id": vid, "quantity": 1})
    client.post("/api/bookings/", headers={"Authorization": f"Bearer {user_token}"}, json={"vehicle_id": vid, "quantity": 2})
    
    # Get history
    res_history = client.get("/api/bookings/", headers={"Authorization": f"Bearer {user_token}"})
    assert res_history.status_code == 200
    assert len(res_history.json()) >= 2


def test_cancel_booking(client, admin_token, user_token):
    # Create vehicle
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "BMW", "model": "M3", "category": "Sports", "price": "60000.00", "quantity": 2})
    vid = res.json()["id"]
    
    # Create booking
    res_booking = client.post(
        "/api/bookings/", 
        headers={"Authorization": f"Bearer {user_token}"},
        json={"vehicle_id": vid, "quantity": 1}
    )
    assert res_booking.status_code == 201
    booking_id = res_booking.json()["id"]
    
    # Cancel booking
    res_cancel = client.put(f"/api/bookings/{booking_id}/cancel", headers={"Authorization": f"Bearer {user_token}"})
    assert res_cancel.status_code == 200
    assert res_cancel.json()["status"] == "cancelled"
    
    # Check if stock restored
    res_vehicle = client.get(f"/api/vehicles/{vid}")
    assert res_vehicle.json()["quantity"] == 2
