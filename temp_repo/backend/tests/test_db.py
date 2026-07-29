from sqlalchemy import text
from app.main import app

def test_db_session_dependency(db):
    result = db.execute(text("SELECT 1")).scalar()
    assert result == 1


def test_db_health_check_endpoint(client):
    response = client.get("/health/db")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "database": "connected"}
