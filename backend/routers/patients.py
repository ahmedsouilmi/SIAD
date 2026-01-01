from fastapi import APIRouter, HTTPException, Depends, status
from auth import get_current_user
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
def get_patients(current=Depends(get_current_user)):
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    if current["role"] == "admin":
        patients = db.query(Patient).all()
    else:
        # staff: only see patients of their service
        staff_service = getattr(current["user"], "service", None)
        if not staff_service:
            db.close()
            return []
        patients = db.query(Patient).filter(Patient.service == staff_service).all()
    db.close()
    return patients

@router.get("/{patient_id}", response_model=PatientSchema)
def get_patient(patient_id: str, current=Depends(get_current_user)):
    # Enforce role-based access: admin can access any patient; staff only same service
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")
    if current["role"] == "staff":
        staff_service = getattr(current["user"], "service", None)
        if staff_service is None or patient.service != staff_service:
            db.close()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db.close()
    return patient
