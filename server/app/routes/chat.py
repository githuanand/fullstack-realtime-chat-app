from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.config.database import get_db
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User

from app.schemas.conversation import ConversationCreate
from app.schemas.message import MessageCreate, MessageResponse

from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# CREATE OR GET CONVERSATION
@router.post("/conversation")
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Conversation).filter(
        (
            (Conversation.user1_id == current_user.id) &
            (Conversation.user2_id == data.user_id)
        ) |
        (
            (Conversation.user1_id == data.user_id) &
            (Conversation.user2_id == current_user.id)
        )
    ).first()

    if existing:
        return existing

    conversation = Conversation(
        user1_id=current_user.id,
        user2_id=data.user_id
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


# SEND MESSAGE
@router.post("/message", response_model=MessageResponse)
def send_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    message = Message(
        conversation_id=data.conversation_id,
        sender_id=current_user.id,
        content=data.content,
        image=data.image
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


# GET ALL MESSAGES IN CONVERSATION
@router.get("/messages/{conversation_id}")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at.asc()
    ).all()

    return messages


# GET ALL USER CONVERSATIONS
@router.get("/conversations")
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversations = db.query(Conversation).filter(
        or_(
            Conversation.user1_id == current_user.id,
            Conversation.user2_id == current_user.id
        )
    ).all()

    result = []

    for convo in conversations:
        other_user_id = (
            convo.user2_id
            if convo.user1_id == current_user.id
            else convo.user1_id
        )

        other_user = db.query(User).filter(
            User.id == other_user_id
        ).first()

        last_message = db.query(Message).filter(
            Message.conversation_id == convo.id
        ).order_by(
            Message.created_at.desc()
        ).first()

        result.append({
            "conversation_id": convo.id,
            "user": {
                "id": other_user.id,
                "full_name": other_user.full_name,
                "email": other_user.email,
                "profile_pic": other_user.profile_pic
            },
            "last_message": (
                last_message.content
                if last_message
                else None
            ),
            "last_message_time": (
                last_message.created_at
                if last_message
                else None
            )
        })

    return result