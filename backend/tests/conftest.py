import pytest
from app import create_app
from app.models import db, Customer

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test-secret-key'
    WTF_CSRF_ENABLED = False
    RATELIMIT_STORAGE_URI = "memory://"
    GROQ_API_KEY = "test_groq_api_key"

@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def init_database(app):
    from app.extensions import bcrypt
    # Add a test user and test admin
    user = Customer(
        name="Test User",
        email="user@test.com",
        password_hash=bcrypt.generate_password_hash("TestPass123!").decode('utf-8'),
        password_reset_required=False
    )
    admin = Customer(
        name="Admin User",
        email="admin@test.com",
        password_hash=bcrypt.generate_password_hash("AdminPass123!").decode('utf-8'),
        password_reset_required=False
    )
    db.session.add(user)
    db.session.add(admin)
    db.session.commit()

    # Wait, the app hardcodes the admin in auth_routes based on current_app.config['ADMIN_EMAIL']
    app.config['ADMIN_EMAIL'] = "admin@test.com"
    app.config['ADMIN_PASSWORD'] = "AdminPass123!"

    return {
        "user_id": user.id,
        "admin_email": "admin@test.com",
        "admin_password": "AdminPass123!"
    }
