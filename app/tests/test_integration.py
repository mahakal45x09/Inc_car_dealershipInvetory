from fastapi.testclient import TestClient


def test_integration_flow_1(client: TestClient):
    """
    Flow 1
    Register -> Login -> Receive JWT -> Create Vehicle -> Search Vehicle -> Purchase Vehicle -> Verify Stock Updated
    """
    # Register as Admin so we can Create Vehicle
    res = client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "securepassword123"},
    )
    assert res.status_code == 201

    # Login
    res = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "securepassword123"},
    )
    assert res.status_code == 200
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Vehicle
    res = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000.0,
            "quantity": 10,
        },
        headers=headers,
    )
    assert res.status_code == 201
    vehicle_id = res.json()["id"]

    # Search Vehicle
    res = client.get("/api/vehicles/search?make=Toyota", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1

    # Purchase Vehicle
    res = client.post(
        f"/api/vehicles/{vehicle_id}/purchase", json={"quantity": 2}, headers=headers
    )
    assert res.status_code == 200

    # Verify Stock Updated
    res = client.get(f"/api/vehicles/{vehicle_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["quantity"] == 8


def test_integration_flow_2(client: TestClient):
    """
    Flow 2
    Admin Login -> Add Vehicle -> Restock -> Delete Vehicle
    """
    # Create Admin
    client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "adminpass"},
    )
    res = client.post(
        "/api/auth/login", json={"email": "admin@example.com", "password": "adminpass"}
    )
    token = res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {token}"}

    # Add Vehicle
    res = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 20000.0,
            "quantity": 5,
        },
        headers=admin_headers,
    )
    assert res.status_code == 201
    vehicle_id = res.json()["id"]

    # Restock Vehicle
    res = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        json={"quantity": 5},
        headers=admin_headers,
    )
    assert res.status_code == 200

    res = client.get(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert res.json()["quantity"] == 10

    # Delete Vehicle
    res = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert res.status_code == 204


def test_integration_flow_3(client: TestClient):
    """
    Flow 3
    User Login -> Try Delete Vehicle -> 403 Forbidden
    """
    # Create User
    client.post(
        "/api/auth/register", json={"email": "user@example.com", "password": "userpass"}
    )
    res = client.post(
        "/api/auth/login", json={"email": "user@example.com", "password": "userpass"}
    )
    token = res.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {token}"}

    # Try Delete Vehicle
    res = client.delete("/api/vehicles/1", headers=user_headers)
    assert res.status_code == 403
