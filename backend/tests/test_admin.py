import json

def test_admin_dashboard_access_allowed(client, init_database):
    # Login as admin
    login_response = client.post('/api/auth/login', json={
        "email": init_database["admin_email"],
        "password": init_database["admin_password"],
        "isAdmin": True
    })
    token = json.loads(login_response.data)["data"]["token"]

    response = client.get('/api/diagnostics', headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200

def test_admin_dashboard_access_denied(client, init_database):
    # Login as regular user
    login_response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "TestPass123!"
    })
    token = json.loads(login_response.data)["data"]["token"]

    response = client.get('/api/diagnostics', headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 403
