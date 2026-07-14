import json

def test_generate_message(client, init_database, mocker):
    # Mock AI generation so we don't hit the Groq API
    class MockMessage:
        def to_dict(self):
            return {"id": 1, "message_text": "Mocked generated message", "is_favorite": False}

    mocker.patch('app.routes.message_routes.generate_and_save_message', return_value=(MockMessage(), {"debug": "info"}))

    # Login as user to get token
    login_response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "TestPass123!"
    })
    token = json.loads(login_response.data)["data"]["token"]

    response = client.post('/api/messages/generate', headers={
        "Authorization": f"Bearer {token}"
    }, json={
        "customer_id": init_database["user_id"],
        "recipient_name": "John",
        "relationship": "Friend",
        "occasion_name": "Birthday",
        "tone_name": "Funny"
    })

    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["success"] is True
    assert data["data"]["message_text"] == "Mocked generated message"

def test_toggle_favorite(client, init_database):
    from app.models import Message, Recipient, Occasion, Tone, db

    # Create required relations
    rec = Recipient(customer_id=init_database["user_id"], name="Test Recipient", relationship="Friend")
    occ = Occasion(name="Test Occasion")
    tone = Tone(name="Test Tone")
    db.session.add_all([rec, occ, tone])
    db.session.commit()

    # Create an actual message in the DB
    msg = Message(customer_id=init_database["user_id"], recipient_id=rec.id, occasion_id=occ.id, tone_id=tone.id, relationship="Friend", message_text="Test", is_favorite=False)
    db.session.add(msg)
    db.session.commit()

    login_response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "TestPass123!"
    })
    token = json.loads(login_response.data)["data"]["token"]

    response = client.post(f'/api/messages/{msg.id}/favorite', headers={
        "Authorization": f"Bearer {token}"
    }, json={"is_favorite": True})

    assert response.status_code == 200

    # Verify in db
    updated_msg = Message.query.get(msg.id)
    assert updated_msg.is_favorite is True
