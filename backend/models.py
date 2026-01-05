from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from database import Base

class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    arrival_date = Column(String)
    departure_date = Column(String)
    service = Column(String)
    satisfaction = Column(Float)

class ServiceWeekly(Base):
    __tablename__ = "services_weekly"
    id = Column(Integer, primary_key=True, index=True)
    week = Column(Integer)
    month = Column(Integer)
    service = Column(String)
    available_beds = Column(Integer)
    patients_request = Column(Integer)
    patients_admitted = Column(Integer)
    patients_refused = Column(Integer)
    patient_satisfaction = Column(Float)
    staff_morale = Column(Float)
    event = Column(String)

class Staff(Base):
    __tablename__ = "hospital_staff"
    staff_id = Column(String, primary_key=True, index=True)
    staff_name = Column(String)
    role = Column(String)
    service = Column(String)

class StaffSchedule(Base):
    __tablename__ = "hospital_staff_schedule"
    id = Column(Integer, primary_key=True, index=True)
    week = Column(Integer)
    staff_id = Column(String)
    staff_name = Column(String)
    role = Column(String)
    service = Column(String)
    present = Column(Integer)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)  # for admin
    staff_id = Column(String, unique=True, index=True, nullable=True)  # for staff
    hashed_password = Column(String)
    role = Column(String)  # "admin" or "staff"
    is_active = Column(Boolean, default=True)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    week = Column(Integer, index=True)
    staff_id = Column(String, index=True)
    staff_name = Column(String)
    role = Column(String)
    current_service = Column(String)
    hours_worked = Column(Float)
    recommended_service = Column(String)
    justification = Column(String)

    status = Column(String, default="PENDING", index=True)  # PENDING | APPROVED | REJECTED
    decided_by = Column(String, nullable=True)
    decided_at = Column(DateTime, nullable=True)