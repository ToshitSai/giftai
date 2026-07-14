# backend/app/__init__.py
# This file initializes the Flask application using the Application Factory pattern.
# It configures CORS, binds SQLAlchemy database operations, and registers API blueprints.

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import pymysql
import os
import tempfile
from app.config import Config
from app.models import db
from app.extensions import bcrypt

# Instantiate the global rate limiter
limiter = Limiter(key_func=get_remote_address)

def create_app(config_class=Config):
    # Instantiate Flask
    app = Flask(__name__)

    # Load settings from Config class
    app.config.from_object(config_class)

    def _safe_database_reason(error):
        message = str(error)
        if "1045" in message or "Access denied" in message:
            return "external database authentication failed"
        if "timeout" in message.lower():
            return "external database connection timed out"
        return "external database unavailable"

    def _activate_sqlite_fallback(error):
        reason = _safe_database_reason(error)
        sqlite_dir = os.path.join(tempfile.gettempdir(), 'greetly')
        os.makedirs(sqlite_dir, exist_ok=True)
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(sqlite_dir, 'app.db')}"
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}
        app.config["DATABASE_MODE"] = "vercel-tmp-sqlite-fallback"
        app.config["EXTERNAL_DATABASE_URI"] = None
        app.config["DATABASE_FALLBACK_REASON"] = reason
        print(f"[DB FALLBACK] External database unavailable; using temporary SQLite. Reason: {reason}", flush=True)

    if app.config.get("DATABASE_MODE") == "external":
        connect_args = dict(app.config.get("SQLALCHEMY_ENGINE_OPTIONS", {}).get("connect_args", {}))
        def _external_db_creator():
            creator_kwargs = {
                "host": app.config.get("DB_HOST"),
                "user": app.config.get("DB_USER"),
                "password": app.config.get("DB_PASSWORD"),
                "port": int(app.config.get("DB_PORT", 3306)),
                "database": app.config.get("DB_NAME"),
                "connect_timeout": connect_args.get("connect_timeout", 10),
                "read_timeout": connect_args.get("read_timeout", 10),
                "write_timeout": connect_args.get("write_timeout", 10),
                "autocommit": False,
            }
            if app.config.get("DB_SSL_REQUIRED"):
                creator_kwargs["ssl"] = {"ssl": {}}
            return pymysql.connect(**creator_kwargs)

        try:
            probe = _external_db_creator()
            probe.close()
            app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
                **app.config.get("SQLALCHEMY_ENGINE_OPTIONS", {}),
                "creator": _external_db_creator,
            }
        except Exception as exc:
            if os.getenv("DB_STRICT", "false").strip().lower() in {"1", "true", "yes"}:
                raise
            _activate_sqlite_fallback(exc)

    if app.config.get("IS_PRODUCTION") and app.config.get("SECRET_KEY") == app.config.get("DEFAULT_SECRET_KEY"):
        raise RuntimeError("SECRET_KEY must be configured for production deployments.")

    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", [])}})

    # Initialize the database with the app context
    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    # Configure Flask-Limiter Storage Backend
    redis_url = app.config.get("REDIS_URL")
    if redis_url:
        app.config["RATELIMIT_STORAGE_URI"] = redis_url
    else:
        app.config["RATELIMIT_STORAGE_URI"] = "memory://"

    # Initialize Flask-Limiter with the app
    limiter.init_app(app)

    @app.after_request
    def apply_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; "
            "script-src 'self'; connect-src 'self' https://api.groq.com https://api.openai.com https://api.brevo.com https://generativelanguage.googleapis.com; "
            "font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        )
        if response.content_type and response.content_type.startswith("application/json"):
            response.headers.setdefault("Cache-Control", "no-store")
        return response

    # Global exception handler for handling internal errors cleanly
    @app.errorhandler(500)
    def handle_internal_server_error(e):
        return jsonify({
            "success": False,
            "error": "An internal server error occurred. Please contact the administrator."
        }), 500

    @app.errorhandler(404)
    def handle_not_found_error(e):
        return jsonify({
            "success": False,
            "error": "The requested resource could not be found."
        }), 404

    @app.errorhandler(429)
    def handle_rate_limit_exceeded(e):
        from flask import request
        print(f"\n[RATE LIMIT TRIGGERED] Limit breached on path: {request.path} | IP: {request.remote_addr} | Description: {str(e.description)}", flush=True)
        return jsonify({
            "success": False,
            "error": f"Rate limit exceeded: {str(e.description)}"
        }), 429

    # Import and register routing blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.customer_routes import customer_bp
    from app.routes.recipient_routes import recipient_bp
    from app.routes.message_routes import message_bp
    from app.routes.tone_routes import tone_bp
    from app.routes.occasion_routes import occasion_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.email_routes import email_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(customer_bp, url_prefix='/api')
    app.register_blueprint(recipient_bp, url_prefix='/api')
    app.register_blueprint(message_bp, url_prefix='/api')
    app.register_blueprint(tone_bp, url_prefix='/api')
    app.register_blueprint(occasion_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api')

    # Basic server check route
    @app.route('/hello', methods=['GET'])
    def hello():
        return jsonify({
            "success": True,
            "message": "Hello, world! Flask backend is fully configured and running."
        }), 200

    @app.route('/api/status', methods=['GET'])
    def api_status():
        from sqlalchemy import text

        database_ok = False
        database_error = None
        try:
            with db.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            database_ok = True
        except Exception as exc:
            database_error = str(exc)

        return jsonify({
            "success": database_ok,
            "service": "Greetly Backend API",
            "version": "1.0.0",
            "environment": "vercel" if str(app.config.get("DATABASE_MODE", "")).startswith("vercel-") else "server",
            "database": {
                "ok": database_ok,
                "mode": app.config.get("DATABASE_MODE"),
                "persistent": app.config.get("DATABASE_MODE") == "external",
                "configured_external_uri": bool(app.config.get("EXTERNAL_DATABASE_URI")),
                "fallback_reason": app.config.get("DATABASE_FALLBACK_REASON"),
                "error": database_error
            },
            "ai": {
                "provider": "Groq API",
                "configured": bool(app.config.get("GROQ_API_KEY"))
            }
        }), 200 if database_ok else 503

    return app
