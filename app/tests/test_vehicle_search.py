import pytest
from fastapi.testclient import TestClient

def get_auth_headers(client: TestClient, is_admin: bool = False) -> dict:
    email = "admin_search@example.com" if is_admin else "user_search@example.com"
    client.post("/api/auth/register", json={"email": email, "password": "securepassword123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "securepassword123"})
    token = res.json().get("access_token", "dummy_token")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def seed_vehicles(client: TestClient):
    admin_headers = get_auth_headers(client, is_admin=True)
    vehicles = [
        {"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.0, "quantity": 10},
        {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.0, "quantity": 0},
        {"make": "Ford", "model": "F-150", "category": "Truck", "price": 40000.0, "quantity": 5},
        {"make": "Toyota", "model": "Corolla", "category": "Sedan", "price": 20000.0, "quantity": 2},
        {"make": "Tesla", "model": "Model 3", "category": "EV", "price": 45000.0, "quantity": 3},
    ]
    for v in vehicles:
        client.post("/api/vehicles", json=v, headers=admin_headers)

def test_search_by_make(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?make=Toyota", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(v["make"] == "Toyota" for v in data)

def test_search_by_model(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?model=Civic", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["model"] == "Civic"

def test_search_by_category(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?category=Truck", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "Truck"

def test_minimum_price(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?min_price=30000", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # F-150 and Model 3
    assert all(v["price"] >= 30000 for v in data)

def test_maximum_price(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?max_price=23000", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Civic and Corolla
    assert all(v["price"] <= 23000 for v in data)

def test_price_range(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?min_price=21000&max_price=26000", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Camry and Civic
    assert all(21000 <= v["price"] <= 26000 for v in data)

def test_available_vehicles(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?available=true", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4  # All except Civic
    assert all(v["quantity"] > 0 for v in data)

def test_combined_filters(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?make=Toyota&category=Sedan&max_price=22000", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1  # Corolla
    assert data[0]["make"] == "Toyota"
    assert data[0]["model"] == "Corolla"

def test_no_result(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?make=Ferrari", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0

def test_invalid_price(client: TestClient, seed_vehicles):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles?min_price=abc", headers=headers)
    assert response.status_code == 422
