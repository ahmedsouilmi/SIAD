from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from database import SessionLocal
from models import StaffSchedule
from pydantic import BaseModel
from typing import List

router = APIRouter()

class StaffScheduleSchema(BaseModel):
    week: int
    staff_id: str
    staff_name: str
    role: str
    service: str
    present: int

    class Config:
        orm_mode = True

@router.get("/", response_model=List[StaffScheduleSchema])
def get_staff_schedule(current=Depends(get_current_user)):
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    if current["role"] == "admin":
        schedule = db.query(StaffSchedule).all()
    else:
        # staff: only see their own schedule
        staff_id = getattr(current["user"], "staff_id", None)
        if not staff_id:
            db.close()
            return []
        schedule = db.query(StaffSchedule).filter(StaffSchedule.staff_id == staff_id).all()
    db.close()
    return schedule
