from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from jose import jwt

from app.core.config import settings


def generate_custom_token(user_id: int, role: str | None = None, expired: bool = False):
    expire = datetime.now(timezone.utc) + timedelta(minutes=-15 if expired else 15)
    to_encode = {"sub": str(user_id), "exp": expire}
    if role is not None:
        to_encode["role"] = role
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@pytest.fixture
def rbac_setup(client: TestClient):
    # Register dummy users to ensure they exist in DB
    client.post(
        "/api/auth/register", json={"email": "user@rbac.com", "password": "password"}
    )
    client.post(
        "/api/auth/register", json={"email": "admin@rbac.com", "password": "password"}
    )
    client.post(
        "/api/auth/register", json={"email": "manager@rbac.com", "password": "password"}
    )

    user_res = client.post(
        "/api/auth/login", json={"email": "user@rbac.com", "password": "password"}
    )
    admin_res = client.post(
        "/api/auth/login", json={"email": "admin@rbac.com", "password": "password"}
    )
    manager_res = client.post(
        "/api/auth/login", json={"email": "manager@rbac.com", "password": "password"}
    )

    user_id = jwt.decode(
        user_res.json()["access_token"],
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )["sub"]
    admin_id = jwt.decode(
        admin_res.json()["access_token"],
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )["sub"]
    manager_id = jwt.decode(
        manager_res.json()["access_token"],
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )["sub"]

    user_token = generate_custom_token(user_id, "USER")
    admin_token = generate_custom_token(admin_id, "ADMIN")
    manager_token = generate_custom_token(manager_id, "MANAGER")
    missing_role_token = generate_custom_token(user_id)
    expired_admin_token = generate_custom_token(admin_id, "ADMIN", expired=True)
    deleted_admin_token = generate_custom_token(9999, "ADMIN")

    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Seed a vehicle using the new RBAC admin token
    v_res = client.post(
        "/api/vehicles",
        json={
            "make": "Test",
            "model": "Car",
            "category": "SUV",
            "price": 100,
            "quantity": 1,
        },
        headers=admin_headers,
    )
    v_id = v_res.json().get("id", 1) if v_res.status_code == 201 else 1

    return {
        "user_headers": {"Authorization": f"Bearer {user_token}"},
        "admin_headers": admin_headers,
        "manager_headers": {"Authorization": f"Bearer {manager_token}"},
        "missing_role_headers": {"Authorization": f"Bearer {missing_role_token}"},
        "expired_admin_headers": {"Authorization": f"Bearer {expired_admin_token}"},
        "deleted_admin_headers": {"Authorization": f"Bearer {deleted_admin_token}"},
        "v_id": v_id,
    }


def test_user_can_view_vehicle(client: TestClient, rbac_setup):
    response = client.get("/api/vehicles", headers=rbac_setup["user_headers"])
    assert response.status_code == 200


def test_admin_can_view_vehicle(client: TestClient, rbac_setup):
    response = client.get("/api/vehicles", headers=rbac_setup["admin_headers"])
    assert response.status_code == 200


def test_user_cannot_add_vehicle(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T", "model": "C", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["user_headers"],
    )
    assert response.status_code == 403


def test_admin_can_add_vehicle(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T2", "model": "C2", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["admin_headers"],
    )
    assert response.status_code == 201


def test_user_cannot_update_vehicle(client: TestClient, rbac_setup):
    response = client.put(
        f"/api/vehicles/{rbac_setup['v_id']}",
        json={"price": 20},
        headers=rbac_setup["user_headers"],
    )
    assert response.status_code == 403


def test_admin_can_update_vehicle(client: TestClient, rbac_setup):
    response = client.put(
        f"/api/vehicles/{rbac_setup['v_id']}",
        json={"price": 20},
        headers=rbac_setup["admin_headers"],
    )
    assert response.status_code == 200


def test_user_cannot_delete_vehicle(client: TestClient, rbac_setup):
    response = client.delete(
        f"/api/vehicles/{rbac_setup['v_id']}", headers=rbac_setup["user_headers"]
    )
    assert response.status_code == 403


def test_user_cannot_restock(client: TestClient, rbac_setup):
    response = client.post(
        f"/api/vehicles/{rbac_setup['v_id']}/restock",
        json={"quantity": 5},
        headers=rbac_setup["user_headers"],
    )
    assert response.status_code == 403


def test_admin_can_restock(client: TestClient, rbac_setup):
    response = client.post(
        f"/api/vehicles/{rbac_setup['v_id']}/restock",
        json={"quantity": 5},
        headers=rbac_setup["admin_headers"],
    )
    assert response.status_code == 200


def test_admin_can_delete_vehicle(client: TestClient, rbac_setup):
    response = client.delete(
        f"/api/vehicles/{rbac_setup['v_id']}", headers=rbac_setup["admin_headers"]
    )
    assert response.status_code == 204


def test_invalid_role(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T3", "model": "C3", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["manager_headers"],
    )
    assert response.status_code == 403


def test_jwt_missing_role(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T3", "model": "C3", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["missing_role_headers"],
    )
    assert response.status_code == 401


def test_expired_admin_token(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T3", "model": "C3", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["expired_admin_headers"],
    )
    assert response.status_code == 401


def test_deleted_admin(client: TestClient, rbac_setup):
    response = client.post(
        "/api/vehicles",
        json={"make": "T3", "model": "C3", "category": "S", "price": 10, "quantity": 1},
        headers=rbac_setup["deleted_admin_headers"],
    )
    assert response.status_code == 401
