from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()

hashed = get_password_hash("admin123")
admin_user = User(username="admin", hashed_password=hashed, role="admin")
db.add(admin_user)
db.commit()
db.close()
