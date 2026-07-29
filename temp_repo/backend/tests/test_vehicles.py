import pytest
from app.models.user import User

@pytest.fixture
def admin_token(client, db):
    user = User(email="admin@example.com", hashed_password="pw", is_admin=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    response = client.post(
        "/api/register",
        json={
            "email": "admin2@example.com",
            "password": "testpassword123",
            "full_name": "Admin User",
            "is_active": True,
            "is_admin": True
        }
    )
    # The register endpoint doesn't allow setting is_admin directly, so we use crud
    # Let's just login with the first user after hashing
    from app.core.security import get_password_hash
    user.hashed_password = get_password_hash("adminpass")
    db.commit()
    
    login_res = client.post("/api/login/access-token", data={"username": "admin@example.com", "password": "adminpass"})
    return login_res.json()["access_token"]


@pytest.fixture
def user_token(client, db):
    from app.core.security import get_password_hash
    user = User(email="user@example.com", hashed_password=get_password_hash("userpass"), is_admin=False)
    db.add(user)
    db.commit()
    
    login_res = client.post("/api/login/access-token", data={"username": "user@example.com", "password": "userpass"})
    return login_res.json()["access_token"]


def test_create_vehicle_admin(client, admin_token):
    response = client.post(
        "/api/vehicles/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": "25000.00",
            "quantity": 5
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"

def test_create_vehicle_user_forbidden(client, user_token):
    response = client.post(
        "/api/vehicles/",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": "22000.00",
            "quantity": 2
        }
    )
    assert response.status_code == 403


def test_search_vehicles(client, admin_token):
    # Create some vehicles
    client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Toyota", "model": "Corolla", "category": "Sedan", "price": "20000.00", "quantity": 5})
    client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Ford", "model": "F-150", "category": "Truck", "price": "40000.00", "quantity": 2})
    
    res = client.get("/api/vehicles/search?make=Toyota")
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["make"] == "Toyota"
    
    res = client.get("/api/vehicles/search?category=Truck")
    assert res.status_code == 200
    assert res.json()[0]["model"] == "F-150"

def test_purchase_vehicle(client, admin_token, user_token):
    # Create vehicle
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Tesla", "model": "Model 3", "category": "EV", "price": "45000.00", "quantity": 1})
    vid = res.json()["id"]
    
    # Purchase it
    res_purchase = client.post(f"/api/vehicles/{vid}/purchase", headers={"Authorization": f"Bearer {user_token}"})
    assert res_purchase.status_code == 200
    assert res_purchase.json()["quantity"] == 0
    
    # Purchase again should fail
    res_purchase2 = client.post(f"/api/vehicles/{vid}/purchase", headers={"Authorization": f"Bearer {user_token}"})
    assert res_purchase2.status_code == 400
    
def test_restock_vehicle(client, admin_token):
    res = client.post("/api/vehicles/", headers={"Authorization": f"Bearer {admin_token}"}, json={"make": "Mazda", "model": "CX-5", "category": "SUV", "price": "30000.00", "quantity": 0})
    vid = res.json()["id"]
    
    res_restock = client.post(f"/api/vehicles/{vid}/restock?quantity=5", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_restock.status_code == 200
    assert res_restock.json()["quantity"] == 5


def test_upload_vehicle_image(client, admin_token):
    # Create a vehicle first
    res = client.post(
        "/api/vehicles/", 
        headers={"Authorization": f"Bearer {admin_token}"}, 
        json={"make": "Chevrolet", "model": "Corvette", "category": "Sports", "price": "70000.00", "quantity": 1}
    )
    vid = res.json()["id"]
    
    # Upload an image
    file_content = b"fake image content"
    files = {"file": ("test_image.png", file_content, "image/png")}
    
    res_upload = client.post(
        f"/api/vehicles/{vid}/image",
        headers={"Authorization": f"Bearer {admin_token}"},
        files=files
    )
    
    assert res_upload.status_code == 200
    data = res_upload.json()
    assert data["image_url"] is not None
    assert data["image_url"].startswith("/static/uploads/vehicles/")
    assert data["image_url"].endswith(".png")
