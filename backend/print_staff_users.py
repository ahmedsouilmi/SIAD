from database import SessionLocal
from models import User

def print_staff_users():
    db = SessionLocal()
    users = db.query(User).filter(User.role == "staff").all()
    for user in users:
        print(f"staff_id: {user.staff_id}, is_active: {user.is_active}, role: {user.role}")
    db.close()

if __name__ == "__main__":
    print_staff_users()
