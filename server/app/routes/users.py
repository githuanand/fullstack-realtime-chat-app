from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.config.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/all",
    response_model=list[UserResponse]
)


def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).filter(
        User.id != current_user.id
    ).all()

    return users