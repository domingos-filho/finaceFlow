
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.deps import get_db, get_current_email
from app.models.user import User
from app.models.finance import Category, Transaction, Budget, TransactionType
from app.schemas.finance import CategoryIn, CategoryOut, TransactionIn, TransactionOut, BudgetIn, BudgetOut

router = APIRouter(prefix="/finance", tags=["finance"])

def get_user(db: Session, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user

# ---- Categories
@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    return db.query(Category).filter(Category.user_id == user.id).order_by(Category.kind, Category.name).all()

@router.post("/categories", response_model=CategoryOut)
def create_category(payload: CategoryIn, db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    cat = Category(name=payload.name, kind=payload.kind, icon=payload.icon, user_id=user.id)
    db.add(cat); db.commit(); db.refresh(cat)
    return cat

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    cat = db.query(Category).filter(Category.user_id == user.id, Category.id == cat_id).first()
    if not cat:
        raise HTTPException(404, "not found")
    db.delete(cat); db.commit()
    return {"ok": True}

# ---- Transactions
@router.get("/transactions", response_model=List[TransactionOut])
def list_transactions(db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    return db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc(), Transaction.id.desc()).all()

@router.post("/transactions", response_model=TransactionOut)
def create_transaction(payload: TransactionIn, db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    tx = Transaction(description=payload.description, date=payload.date, amount=payload.amount,
                     type=TransactionType(payload.type), category_id=payload.category_id, user_id=user.id)
    db.add(tx); db.commit(); db.refresh(tx)
    return tx

@router.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    tx = db.query(Transaction).filter(Transaction.user_id == user.id, Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(404, "not found")
    db.delete(tx); db.commit()
    return {"ok": True}

# ---- Budgets
@router.get("/budgets", response_model=List[BudgetOut])
def list_budgets(db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    return db.query(Budget).filter(Budget.user_id == user.id).order_by(Budget.month.desc()).all()

@router.post("/budgets", response_model=BudgetOut)
def create_budget(payload: BudgetIn, db: Session = Depends(get_db), email: str = Depends(get_current_email)):
    user = get_user(db, email)
    b = Budget(month=payload.month, amount=payload.amount, user_id=user.id)
    db.add(b); db.commit(); db.refresh(b)
    return b
