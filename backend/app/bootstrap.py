from app.models import db

_initialized = False


def initialize_backend(app):
    """Prepare database tables, migrations, and lookup data once per runtime."""
    global _initialized
    if _initialized:
        return

    with app.app_context():
        db.create_all()

        from app.utils.migrations import run_migrations
        from app.seed.seed_tones import seed as seed_tones
        from app.seed.seed_occasions import seed as seed_occasions

        run_migrations(app)
        seed_tones(app)
        seed_occasions(app)

    _initialized = True
