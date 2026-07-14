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

def test_forgot_password_flow(client, init_database, mocker):
    mocker.patch('app.services.reset_service.generate_and_send_otp', return_value=(True, "Success"))
    mocker.patch('app.services.reset_service.verify_otp_record', return_value=(True, "Valid"))
    mocker.patch('app.services.reset_service.reset_user_password', return_value=(True, "Success"))
    
    # 1. Forgot password
    response = client.post('/api/auth/forgot-password', json={"email": "user@test.com"})
    assert response.status_code == 200
    
    # 2. Verify OTP
    response = client.post('/api/auth/verify-reset-code', json={"email": "user@test.com", "otp": "123456"})
    assert response.status_code == 200
    
    # 3. Reset password
    response = client.post('/api/auth/reset-password', json={"email": "user@test.com", "otp": "123456", "new_password": "NewValidPass123!"})
    assert response.status_code == 200

def test_rate_limiter_login(client, init_database):
    # Hit the limit (Assuming test config allows 5 per 15 minutes but we might not have changed TestConfig LIMIT_LOGIN)
    # By default it's using the limiter. Let's force enough requests to trigger 429
    # If app.config doesn't override, it uses 5 per minute.
    for i in range(15):
        response = client.post('/api/auth/login', json={
            "email": "user@test.com",
            "password": "wrongpassword"
        })
        if response.status_code == 429:
            break
            
    assert response.status_code == 429
