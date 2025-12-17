from fastapi import APIRouter, Depends
from auth import get_current_user
from schemas import UserOut

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_me(current=Depends(get_current_user)):
    return current["user"]
