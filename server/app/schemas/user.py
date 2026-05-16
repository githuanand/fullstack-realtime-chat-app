from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    profile_pic: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True