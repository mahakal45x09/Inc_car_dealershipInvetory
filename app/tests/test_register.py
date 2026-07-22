def test_register_new_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["email"] == "test@example.com"
    assert "password" not in data  # Never return the password


def test_duplicate_email(client):
    # First registration
    client.post(
        "/api/auth/register",
        json={"email": "duplicate@example.com", "password": "securepassword123"},
    )
    # Second registration with same email
    response = client.post(
        "/api/auth/register",
        json={"email": "duplicate@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_invalid_email(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "securepassword123"},
    )
    assert response.status_code == 422


def test_password_too_short(client):
    response = client.post(
        "/api/auth/register", json={"email": "short@example.com", "password": "123"}
    )
    assert response.status_code == 422


def test_missing_fields(client):
    # Missing password
    response = client.post("/api/auth/register", json={"email": "missing@example.com"})
    assert response.status_code == 422
