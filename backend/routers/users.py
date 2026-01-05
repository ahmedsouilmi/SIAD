from fastapi import APIRouter, Depends
from auth import get_current_user
from database import SessionLocal
from models import Staff
from schemas import UserOut

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_me(current=Depends(get_current_user)):
    user = current["user"]
    # If staff, get extra info from Staff table
    if getattr(user, "role", None) == "staff" and getattr(user, "staff_id", None):
        db = SessionLocal()
        staff = db.query(Staff).filter(Staff.staff_id == user.staff_id).first()
        db.close()
        if staff:
            # Merge staff_name and service into user
            user.staff_name = staff.staff_name
            user.service = staff.service
    return user
