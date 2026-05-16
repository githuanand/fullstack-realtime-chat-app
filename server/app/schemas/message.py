from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    conversation_id: int
    content: Optional[str] = None
    image: Optional[str] = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: Optional[str]
    image: Optional[str]
    is_seen: bool
    created_at: datetime

    class Config:
        from_attributes = True