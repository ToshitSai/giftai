import json

def test_register(client, init_database):
    response = client.post('/api/auth/register', json={
        "name": "New User",
        "email": "new@test.com",
        "password": "Password123!"
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["success"] is True
    assert data["data"]["user"]["email"] == "new@test.com"
    assert "token" in data["data"]

def test_login_success(client, init_database):
    response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "TestPass123!"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert "token" in data["data"]

def test_login_invalid(client, init_database):
    response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data["success"] is False

def test_forgot_password(client, init_database, mocker):
    mocker.patch('app.services.reset_service.generate_and_send_otp', return_value=(True, "Success"))
    response = client.post('/api/auth/forgot-password', json={
        "email": "user@test.com"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
