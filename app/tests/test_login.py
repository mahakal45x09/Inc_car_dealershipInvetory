def test_login_success(client):
    # Register a user first
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "securepassword123"},
    )

    # Attempt login
    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"email": "wrongpass@example.com", "password": "securepassword123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpass@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_user_not_exist(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "notfound@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_invalid_email(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "not-an-email", "password": "securepassword123"},
    )
    # Assuming Pydantic validation catches this as a 422
    assert response.status_code == 422


def test_login_empty_password(client):
    response = client.post(
        "/api/auth/login", json={"email": "empty@example.com", "password": ""}
    )
    # Validation should catch empty password
    assert response.status_code == 422


def test_login_jwt_token_returned(client):
    client.post(
        "/api/auth/register",
        json={"email": "jwt@example.com", "password": "securepassword123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "jwt@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    # Verify it is actually a JWT (3 parts separated by dots)
    assert len(data["access_token"].split(".")) == 3
