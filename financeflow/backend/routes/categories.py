from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models import Category
from schemas import CategoryBase

router = APIRouter()

@router.post("/")
def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    db_cat = Category(**category.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
