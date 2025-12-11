from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Patient
from routers import patients, staff, services_weekly, staff_schedule


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(staff.router, prefix="/staff", tags=["staff"])
app.include_router(services_weekly.router, prefix="/services_weekly", tags=["services_weekly"])
app.include_router(staff_schedule.router, prefix="/staff_schedule", tags=["staff_schedule"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SIAD backend running"}

@app.get("/patients")
def get_patients():
    db = SessionLocal()
    return db.query(Patient).all()