from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Patient
from routers import patients, staff, services_weekly, staff_schedule, users, kpis, staff_csv, services_weekly_staff, recommendations
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models import User 
from auth import get_password_hash, verify_password, create_access_token  
from schemas import UserCreate, Token, UserOut  



app = FastAPI()

Base.metadata.create_all(bind=engine)


app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(staff.router, prefix="/staff", tags=["staff"])
app.include_router(services_weekly.router, prefix="/services_weekly", tags=["services_weekly"])
app.include_router(services_weekly_staff.router, prefix="/services_weekly", tags=["services_weekly_staff"])
app.include_router(staff_schedule.router, prefix="/staff_schedule", tags=["staff_schedule"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
app.include_router(users.router, tags=["users"])
app.include_router(kpis.router, prefix="/kpis", tags=["kpis"])
# Register CSV-based endpoints (no prefix, flat)
app.include_router(staff_csv.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "SIAD backend running"}

# Note: public /patients and /create_admin endpoints removed.
# Use the routers (and CLI scripts) to manage admin/user creation and patients via authenticated routes.

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Check admin or staff
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.staff_id == form_data.username)
    ).first()
    if user and verify_password(form_data.password, user.hashed_password):
        token_sub = user.staff_id if user.role in ["staff", "doctor", "nurse", "nursing_assistant"] else user.username
        access_token = create_access_token({"sub": token_sub, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(status_code=401, detail="Incorrect username or password")
