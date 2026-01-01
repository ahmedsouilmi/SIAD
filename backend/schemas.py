# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: Optional[str]  # for admin
    staff_id: Optional[str]  # for staff
    password: str
    role: str  # "admin" or "staff"

class UserOut(BaseModel):
    id: int
    username: Optional[str]
    staff_id: Optional[str]
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
