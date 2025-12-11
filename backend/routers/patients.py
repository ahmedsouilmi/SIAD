from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Patient
from pydantic import BaseModel
from typing import List

router = APIRouter()

class PatientSchema(BaseModel):
    patient_id: str
    name: str
    age: int
    arrival_date: str
    departure_date: str
    service: str
    satisfaction: float

    class Config:
        orm_mode = True

@router.get("/", response_model=List[PatientSchema])
def get_patients():
    db = SessionLocal()
    patients = db.query(Patient).all()
    db.close()
    return patients

@router.get("/{patient_id}", response_model=PatientSchema)
def get_patient(patient_id: str):
    db = SessionLocal()
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    db.close()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
