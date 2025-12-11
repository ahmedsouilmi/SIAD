from fastapi import APIRouter
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
def get_services_weekly():
    db = SessionLocal()
    services = db.query(ServiceWeekly).all()
    db.close()
    return services
