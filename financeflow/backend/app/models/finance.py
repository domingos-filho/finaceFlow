
from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
import enum
from app.core.db import Base

class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, index=True)
    kind = Column(String(20), nullable=False)  # 'income' or 'expense'
    icon = Column(String(50), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    description = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Numeric(14,2), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Budget(Base):
    __tablename__ = "budgets"
    id = Column(Integer, primary_key=True)
    month = Column(String(7), index=True)  # YYYY-MM
    amount = Column(Numeric(14,2), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
