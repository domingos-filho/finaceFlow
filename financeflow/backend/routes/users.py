from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models import User
from auth import get_password_hash
from schemas import UserCreate, UserOut

router = APIRouter()

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(email=user.email, hashed_password=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
