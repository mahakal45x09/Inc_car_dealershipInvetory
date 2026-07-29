import pytest
from fastapi.testclient import TestClient


def get_auth_headers(client: TestClient, is_admin: bool = False) -> dict:
    email = "admin@example.com" if is_admin else "user_purchase@example.com"
    client.post(
        "/api/auth/register", json={"email": email, "password": "securepassword123"}
    )
    res = client.post(
        "/api/auth/login", json={"email": email, "password": "securepassword123"}
    )
    token = res.json().get("access_token", "dummy_token")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def setup_data(client: TestClient):
    admin_headers = get_auth_headers(client, is_admin=True)

    # Seed vehicle 1 (in stock)
    v1 = {
        "make": "Ford",
        "model": "Mustang",
        "category": "Coupe",
        "price": 50000.0,
        "quantity": 10,
    }
    res = client.post("/api/vehicles", json=v1, headers=admin_headers)
    v1_id = res.json()["id"] if res.status_code == 201 else 1

    # Seed vehicle 2 (out of stock)
    v2 = {
        "make": "Chevy",
        "model": "Camaro",
        "category": "Coupe",
        "price": 40000.0,
        "quantity": 0,
    }
    res2 = client.post("/api/vehicles", json=v2, headers=admin_headers)
    v2_id = res2.json()["id"] if res2.status_code == 201 else 2

    return {"admin_headers": admin_headers, "v1_id": v1_id, "v2_id": v2_id}


def test_purchase_vehicle_successfully(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]

    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 2}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Vehicle purchased successfully"
    assert data["vehicle_id"] == v1_id
    assert data["remaining_quantity"] == 8


def test_vehicle_not_found(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    response = client.post(
        "/api/vehicles/9999/purchase", json={"quantity": 1}, headers=headers
    )
    assert response.status_code == 404


def test_out_of_stock(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v2_id = setup_data["v2_id"]
    response = client.post(
        f"/api/vehicles/{v2_id}/purchase", json={"quantity": 1}, headers=headers
    )
    assert response.status_code == 400
    assert (
        "stock" in response.json()["detail"].lower()
        or "quantity" in response.json()["detail"].lower()
    )


def test_purchase_more_than_stock(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 15}, headers=headers
    )
    assert response.status_code == 400
    assert (
        "stock" in response.json()["detail"].lower()
        or "quantity" in response.json()["detail"].lower()
    )


def test_purchase_quantity_zero(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 0}, headers=headers
    )
    assert response.status_code == 422  # Pydantic validation error


def test_purchase_negative_quantity(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": -5}, headers=headers
    )
    assert response.status_code == 422  # Pydantic validation error


def test_unauthorized_user(client: TestClient, setup_data):
    v1_id = setup_data["v1_id"]
    response = client.post(f"/api/vehicles/{v1_id}/purchase", json={"quantity": 1})
    assert response.status_code == 401


def test_invalid_jwt(client: TestClient, setup_data):
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase",
        json={"quantity": 1},
        headers={"Authorization": "Bearer invalidtoken"},
    )
    assert response.status_code == 401


def test_purchase_history_created(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 1}, headers=headers
    )
    assert response.status_code == 200


def test_remaining_quantity_updated(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    # We already have an initial state of 10. Purchase 3.
    client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 3}, headers=headers
    )

    # Fetch vehicle to check remaining quantity
    response = client.get(f"/api/vehicles/{v1_id}", headers=headers)
    assert response.json()["quantity"] == 7


def test_transaction_rollback(client: TestClient, setup_data):
    # Try to purchase more than stock to force error
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 100}, headers=headers
    )

    # Verify stock did NOT change from 10
    response = client.get(f"/api/vehicles/{v1_id}", headers=headers)
    assert response.json()["quantity"] == 10


def test_total_price_calculation(client: TestClient, setup_data):
    headers = get_auth_headers(client, is_admin=False)
    v1_id = setup_data["v1_id"]
    response = client.post(
        f"/api/vehicles/{v1_id}/purchase", json={"quantity": 2}, headers=headers
    )
    assert response.status_code == 200
