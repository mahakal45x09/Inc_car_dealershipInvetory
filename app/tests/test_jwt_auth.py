import pytest
from datetime import timedelta
from app.core.jwt import create_access_token

def test_access_without_token(client):
    response = client.get("/api/vehicles")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_access_with_invalid_token(client):
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": "Bearer invalid.token.here"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

def test_access_with_valid_token(client):
    # Register and get token
    client.post(
        "/api/auth/register",
        json={"email": "jwt_auth@example.com", "password": "securepassword123"}
    )
    login_res = client.post(
        "/api/auth/login",
        json={"email": "jwt_auth@example.com", "password": "securepassword123"}
    )
    token = login_res.json()["access_token"]
    
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_expired_token(client):
    # Manually create an expired token
    expired_token = create_access_token(data={"sub": "1", "role": "USER"}, expires_delta=timedelta(seconds=-1))
    
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Token has expired"

def test_wrong_authentication_scheme(client):
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": "Basic somerandombase64"}
    )
    assert response.status_code == 401

def test_missing_bearer_prefix(client):
    token = create_access_token(data={"sub": "1", "role": "USER"})
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": token}
    )
    assert response.status_code == 401

def test_token_belongs_to_deleted_user(client):
    # Use an ID that shouldn't exist
    token = create_access_token(data={"sub": "99999", "role": "USER"})
    
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "User not found"
