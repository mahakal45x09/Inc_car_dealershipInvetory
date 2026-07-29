import pytest
from app.models.user import User
from app.core.security import get_password_hash


@pytest.fixture
def admin_token_admin_test(client, db):
    user = User(email="admin_dashboard@example.com", hashed_password=get_password_hash("adminpass"), is_admin=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    login_res = client.post("/api/login/access-token", data={"username": "admin_dashboard@example.com", "password": "adminpass"})
    return login_res.json()["access_token"]


@pytest.fixture
def user_token_admin_test(client, db):
    user = User(email="user_dashboard@example.com", hashed_password=get_password_hash("userpass"), is_admin=False)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    login_res = client.post("/api/login/access-token", data={"username": "user_dashboard@example.com", "password": "userpass"})
    return login_res.json()["access_token"]


def test_get_dashboard_stats(client, admin_token_admin_test, user_token_admin_test):
    # Test user access forbidden
    res_user = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {user_token_admin_test}"})
    assert res_user.status_code == 403
    
    # Test admin access
    res_admin = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {admin_token_admin_test}"})
    assert res_admin.status_code == 200
    data = res_admin.json()
    assert "total_users" in data
    assert "total_vehicles" in data
    assert "total_bookings" in data
    assert "total_revenue" in data


def test_read_users(client, admin_token_admin_test):
    res = client.get("/api/admin/users", headers={"Authorization": f"Bearer {admin_token_admin_test}"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1


def test_update_user_admin(client, admin_token_admin_test, db):
    user = User(email="update_me@example.com", hashed_password=get_password_hash("userpass"), is_admin=False)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    res = client.put(
        f"/api/admin/users/{user.id}", 
        headers={"Authorization": f"Bearer {admin_token_admin_test}"},
        json={"is_admin": True, "full_name": "New Admin"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["is_admin"] is True
    assert data["full_name"] == "New Admin"


def test_read_all_bookings(client, admin_token_admin_test):
    res = client.get("/api/admin/bookings", headers={"Authorization": f"Bearer {admin_token_admin_test}"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)
