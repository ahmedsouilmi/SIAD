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

@router.get("/staff", response_model=List[ServiceWeeklySchema])
def get_services_weekly_for_staff(current=Depends(get_current_user)):
    # Only staff can access this endpoint
    if current["role"] != "staff":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    staff_service = current.get("service") or getattr(current["user"], "service", None)
    if not staff_service:
        db.close()
        return []
    services = db.query(ServiceWeekly).filter(ServiceWeekly.service == staff_service).all()
    db.close()
    return services
