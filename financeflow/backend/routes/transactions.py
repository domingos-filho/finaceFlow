from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models import Transaction
from schemas import TransactionBase

router = APIRouter()

@router.post("/")
def create_transaction(transaction: TransactionBase, db: Session = Depends(get_db)):
    db_tx = Transaction(**transaction.dict())
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx
