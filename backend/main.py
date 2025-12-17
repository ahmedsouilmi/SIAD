from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Patient
from routers import patients, staff, services_weekly, staff_schedule, users
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
app.include_router(staff_schedule.router, prefix="/staff_schedule", tags=["staff_schedule"])
app.include_router(users.router, tags=["users"])


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

@app.get("/patients")
def get_patients():
    db = SessionLocal()
    return db.query(Patient).all()

@app.post("/create_admin", response_model=UserOut)
def create_admin(user: UserCreate, db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=400, detail="Role must be admin")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Admin already exists")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password, role="admin")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Check admin or staff
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.staff_id == form_data.username)
    ).first()
    if user and verify_password(form_data.password, user.hashed_password):
        access_token = create_access_token({"sub": user.username or user.staff_id, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}

    # If not found in User, check StaffAuth
    from auth import StaffAuth  # Import here to avoid circular import
    staff_auth = db.query(StaffAuth).filter(StaffAuth.staff_id == form_data.username).first()
    if staff_auth and verify_password(form_data.password, staff_auth.password_hash):
        access_token = create_access_token({"sub": staff_auth.staff_id, "role": staff_auth.role})
        return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(status_code=401, detail="Incorrect username or password")
