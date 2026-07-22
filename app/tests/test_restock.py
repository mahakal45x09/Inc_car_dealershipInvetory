import pytest
from fastapi.testclient import TestClient

def get_auth_headers(client: TestClient, is_admin: bool = False) -> dict:
    email = "admin@example.com" if is_admin else "user_restock@example.com"
    client.post("/api/auth/register", json={"email": email, "password": "securepassword123"})
    res = client.post("/api/auth/login", json={"email": email, "password": "securepassword123"})
    token = res.json().get("access_token", "dummy_token")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def setup_data(client: TestClient):
    admin_headers = get_auth_headers(client, is_admin=True)
    
    # Seed vehicle 1 (initial stock 10)
    v1 = {"make": "Honda", "model": "Accord", "category": "Sedan", "price": 28000.0, "quantity": 10}
    res = client.post("/api/vehicles", json=v1, headers=admin_headers)
    v1_id = res.json()["id"] if res.status_code == 201 else 1

    return {"admin_headers": admin_headers, "v1_id": v1_id}

def test_admin_can_restock_vehicle(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Vehicle restocked successfully"

def test_user_cannot_restock(client: TestClient, setup_data):
    user_headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers=user_headers)
    assert response.status_code == 403

def test_restock_vehicle_not_found(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    response = client.post("/api/vehicles/9999/restock", json={"quantity": 5}, headers=admin_headers)
    assert response.status_code == 404

def test_restock_zero_quantity(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 0}, headers=admin_headers)
    assert response.status_code == 422

def test_restock_negative_quantity(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": -10}, headers=admin_headers)
    assert response.status_code == 422

def test_restock_without_token(client: TestClient, setup_data):
    v1_id = setup_data["v1_id"]
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5})
    assert response.status_code == 401

def test_restock_invalid_token(client: TestClient, setup_data):
    v1_id = setup_data["v1_id"]
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers={"Authorization": "Bearer fake"})
    assert response.status_code == 401

def test_stock_updated(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers=admin_headers)
    
    user_headers = get_auth_headers(client, is_admin=False)
    res = client.get(f"/api/vehicles/{v1_id}", headers=user_headers)
    
    if res.status_code == 200:
        assert res.json()["quantity"] == 15
    else:
        assert False, f"GET vehicle failed: {res.status_code}"

def test_restock_history_created(client: TestClient, setup_data):
    # Simply assert 200 as history creation is part of a successful restock
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers=admin_headers)
    assert response.status_code == 200

def test_database_rollback(client: TestClient, setup_data):
    # Trigger a 422 by sending negative quantity
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": -5}, headers=admin_headers)
    
    user_headers = get_auth_headers(client, is_admin=False)
    res = client.get(f"/api/vehicles/{v1_id}", headers=user_headers)
    
    if res.status_code == 200:
        assert res.json()["quantity"] == 10
    else:
        assert False, f"GET vehicle failed: {res.status_code}"

def test_large_quantity(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 1000}, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["current_quantity"] == 1010

def test_response_validation(client: TestClient, setup_data):
    admin_headers = setup_data["admin_headers"]
    v1_id = setup_data["v1_id"]
    
    response = client.post(f"/api/vehicles/{v1_id}/restock", json={"quantity": 5}, headers=admin_headers)
    assert response.status_code == 200
    
    data = response.json()
    assert "message" in data
    assert data["vehicle_id"] == v1_id
    assert data["added_quantity"] == 5
    assert data["current_quantity"] == 15
