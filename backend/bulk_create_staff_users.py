from database import SessionLocal
from models import User, Staff
from auth import get_password_hash

default_password = "agent123"
hashed_password = get_password_hash(default_password)

def bulk_create_staff_users():
    db = SessionLocal()
    all_staff = db.query(Staff).all()
    created = 0
    for staff_member in all_staff:
        existing_user = db.query(User).filter(User.staff_id == staff_member.staff_id).first()
        if not existing_user:
            user = User(
                staff_id=staff_member.staff_id,
                hashed_password=hashed_password,
                role="staff"
            )
            db.add(user)
            created += 1
    db.commit()
    db.close()
    print(f"Created {created} staff users with default password '{default_password}'")

if __name__ == "__main__":
    bulk_create_staff_users()
