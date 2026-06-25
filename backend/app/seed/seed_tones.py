# backend/app/seed/seed_tones.py
# This script seeds default emotional categories into the tones table using SQLAlchemy.

import sys
import os

# Adjust path to find the backend app module when run from terminal
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app
from app.models import db, Tone

TONES = [
    {"name": "Warm", "description": "Friendly, affectionate, and personal"},
    {"name": "Formal", "description": "Respectful and professional in tone"},
    {"name": "Funny", "description": "Light-hearted, humorous, and playful"},
    {"name": "Heartfelt", "description": "Deep, emotional, and sincere"},
    {"name": "Professional", "description": "Corporate-appropriate and business-focused"},
    {"name": "Inspirational", "description": "Motivational and uplifting in tone"}
]

def seed(app=None):
    from sqlalchemy.orm import sessionmaker
    
    if app is None:
        app = create_app()
        
    with app.app_context():
        print("Seeding tones lookup data...")
        # Create a fresh, independent session using the application's engine
        Session = sessionmaker(bind=db.engine)
        session = Session()
        try:
            count = 0
            for item in TONES:
                existing = session.query(Tone).filter_by(name=item["name"]).first()
                if not existing:
                    tone = Tone(name=item["name"], description=item["description"])
                    session.add(tone)
                    count += 1
            session.commit()
            print(f"Successfully seeded {count} new tones.")
        except Exception as e:
            session.rollback()
            print(f"Error seeding tones: {e}")
            raise e
        finally:
            session.close()


if __name__ == '__main__':
    seed()
