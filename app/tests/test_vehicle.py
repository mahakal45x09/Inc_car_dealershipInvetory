import pytest
from fastapi.testclient import TestClient

def get_auth_headers(client: TestClient, is_admin: bool = False) -> dict:
    email = "admin@example.com" if is_admin else "user@example.com"
    client.post("/api/auth/register", json={"email": email, "password": "securepassword123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "securepassword123"})
    token = res.json().get("access_token", "dummy_token")
    return {"Authorization": f"Bearer {token}"}

def test_add_vehicle_admin(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    payload = {"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.0, "quantity": 10}
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 201

def test_add_vehicle_normal_user(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    payload = {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.0, "quantity": 5}
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 403

def test_get_all_vehicles(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_vehicle_by_id(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles/1", headers=headers)
    assert response.status_code == 200

def test_vehicle_not_found(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    response = client.get("/api/vehicles/999", headers=headers)
    assert response.status_code == 404

def test_update_vehicle_admin(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    response = client.put("/api/vehicles/1", json={"price": 19000.0}, headers=headers)
    assert response.status_code == 200

def test_update_vehicle_normal_user(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    response = client.put("/api/vehicles/1", json={"price": 19000.0}, headers=headers)
    assert response.status_code == 403

def test_delete_vehicle_admin(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    response = client.delete("/api/vehicles/1", headers=headers)
    assert response.status_code == 204

def test_delete_vehicle_normal_user(client: TestClient):
    headers = get_auth_headers(client, is_admin=False)
    response = client.delete("/api/vehicles/1", headers=headers)
    assert response.status_code == 403

def test_validation_price(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    payload = {"make": "Nissan", "model": "Altima", "category": "Sedan", "price": -500.0, "quantity": 1}
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 422

def test_validation_quantity(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    payload = {"make": "Nissan", "model": "Altima", "category": "Sedan", "price": 25000.0, "quantity": -5}
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 422

def test_duplicate_vehicle(client: TestClient):
    headers = get_auth_headers(client, is_admin=True)
    payload = {"make": "Tesla", "model": "Model 3", "category": "EV", "price": 40000.0, "quantity": 5}
    client.post("/api/vehicles", json=payload, headers=headers)
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 400
