from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()

new_password = "admin@1234"  
hashed = get_password_hash(new_password)

admin_user = db.query(User).filter(User.username == "admin").first()
if admin_user:
    admin_user.hashed_password = hashed
    db.commit()
    print("Admin password updated successfully.")
else:
    print("Admin user not found.")

db.close()