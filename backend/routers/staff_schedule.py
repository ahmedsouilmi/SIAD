from fastapi import APIRouter
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
def get_staff_schedule():
    db = SessionLocal()
    schedule = db.query(StaffSchedule).all()
    db.close()
    return schedule
