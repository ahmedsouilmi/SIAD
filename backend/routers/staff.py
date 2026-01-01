from fastapi import APIRouter, HTTPException, Depends, status
from auth import get_current_user
from database import SessionLocal
from models import Staff
from pydantic import BaseModel
from typing import List

router = APIRouter()

class StaffSchema(BaseModel):
    staff_id: str
    staff_name: str
    role: str
    service: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[StaffSchema])
def get_staff(current=Depends(get_current_user)):
    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    staff = db.query(Staff).all()
    db.close()
    return staff

@router.get("/{staff_id}", response_model=StaffSchema)
def get_staff_member(staff_id: str, current=Depends(get_current_user)):
    # admin can view any staff; staff can view only their own profile
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db = SessionLocal()
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        db.close()
        raise HTTPException(status_code=404, detail="Staff not found")
    if current["role"] == "staff":
        current_staff_id = getattr(current["user"], "staff_id", None)
        if current_staff_id != staff_id:
            db.close()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db.close()
    return staff
