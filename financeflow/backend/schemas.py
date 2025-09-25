from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CategoryBase(BaseModel):
    name: str
    type: str

class TransactionBase(BaseModel):
    amount: float
    description: str
    type: str
    category_id: Optional[int]
