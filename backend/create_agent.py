# backend/create_agents.py
from database import SessionLocal
from models import User, Staff  # assuming you have Staff model mapped to staff table
from auth import get_password_hash

db = SessionLocal()

# Set default password for all agents
default_password = "agent123"
hashed_password = get_password_hash(default_password)

# Query all staff from staff table
all_staff = db.query(Staff).all()

for staff_member in all_staff:
    # Check if user already exists
    existing_user = db.query(User).filter(User.staff_id == staff_member.staff_id).first()
    if not existing_user:
        user = User(
            staff_id=staff_member.staff_id,
            hashed_password=hashed_password,
            role="staff"
        )
        db.add(user)

db.commit()
db.close()
print(f"Created {len(all_staff)} agent users with default password '{default_password}'")
