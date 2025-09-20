
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import Base, engine
from app.models.user import User
from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import Token, LoginRequest, SignupRequest
from app.core.deps import get_db
from app.core.settings import settings

router = APIRouter(prefix="/auth", tags=["auth"])

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def ensure_admin(db: Session):
    admin = db.query(User).filter(User.email == settings.admin_email).first()
    if not admin:
        admin = User(email=settings.admin_email, password_hash=hash_password(settings.admin_password))
        db.add(admin); db.commit()

@router.post("/signup", response_model=Token)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    ensure_admin(db)
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user); db.commit()
    token = create_access_token(user.email)
    return Token(access_token=token)

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    ensure_admin(db)
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user.email)
    return Token(access_token=token)
