import pytest
from fastapi.testclient import TestClient

from app.core.security import get_password_hash
from app.models.purchase import PurchaseHistory
from app.models.user import Role, User
from app.models.vehicle import Vehicle


@pytest.fixture
def setup_metrics_data(client: TestClient):
    # Retrieve DB session
    from app.tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()

    # Create users
    admin = User(
        email="admin@test.com",
        hashed_password=get_password_hash("pass"),
        role=Role.ADMIN,
    )
    user = User(
        email="user@test.com", hashed_password=get_password_hash("pass"), role=Role.USER
    )
    db.add(admin)
    db.add(user)
    db.commit()

    # Create vehicles
    v1 = Vehicle(
        make="Honda", model="Civic", category="Sedan", price=20000.0, quantity=5
    )
    v2 = Vehicle(
        make="Ford", model="Mustang", category="Sports", price=40000.0, quantity=0
    )
    db.add(v1)
    db.add(v2)
    db.commit()

    # Create purchases
    p1 = PurchaseHistory(
        user_id=user.id, vehicle_id=v1.id, quantity=1, total_price=20000.0
    )
    db.add(p1)
    db.commit()

    admin_token = client.post(
        "/api/auth/login", json={"email": "admin@test.com", "password": "pass"}
    ).json()["access_token"]
    user_token = client.post(
        "/api/auth/login", json={"email": "user@test.com", "password": "pass"}
    ).json()["access_token"]

    db.close()
    return {"admin_token": admin_token, "user_token": user_token}


def test_admin_metrics(client: TestClient, setup_metrics_data):
    token = setup_metrics_data["admin_token"]
    response = client.get(
        "/api/metrics/admin", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_revenue" in data
    assert data["total_revenue"] == 20000.0
    assert "total_transactions" in data
    assert data["total_transactions"] == 1
    assert "total_vehicles" in data
    assert data["total_vehicles"] == 2
    assert "out_of_stock_count" in data
    assert data["out_of_stock_count"] == 1


def test_admin_metrics_unauthorized(client: TestClient, setup_metrics_data):
    token = setup_metrics_data["user_token"]
    response = client.get(
        "/api/metrics/admin", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403


def test_user_purchase_history(client: TestClient, setup_metrics_data):
    token = setup_metrics_data["user_token"]
    response = client.get(
        "/api/purchase/history", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["quantity"] == 1
    assert data[0]["total_price"] == 20000.0
    assert "vehicle" in data[0]
    assert data[0]["vehicle"]["make"] == "Honda"


def test_user_purchase_history_unauthorized(client: TestClient):
    response = client.get("/api/purchase/history")
    assert response.status_code == 401
