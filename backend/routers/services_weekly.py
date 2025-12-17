from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from database import SessionLocal
from models import ServiceWeekly
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ServiceWeeklySchema(BaseModel):
    week: int
    month: int
    service: str
    available_beds: int
    patients_request: int
    patients_admitted: int
    patients_refused: int
    patient_satisfaction: float
    staff_morale: float
    event: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[ServiceWeeklySchema])
def get_services_weekly(current=Depends(get_current_user)):
    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    services = db.query(ServiceWeekly).all()
    db.close()
    return services
