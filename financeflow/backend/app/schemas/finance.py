
from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

class CategoryIn(BaseModel):
    name: str
    kind: Literal["income","expense"]
    icon: Optional[str] = None

class CategoryOut(CategoryIn):
    id: int

class TransactionIn(BaseModel):
    description: str
    date: date
    amount: float
    type: Literal["income","expense"]
    category_id: Optional[int] = None

class TransactionOut(TransactionIn):
    id: int

class BudgetIn(BaseModel):
    month: str
    amount: float

class BudgetOut(BudgetIn):
    id: int
