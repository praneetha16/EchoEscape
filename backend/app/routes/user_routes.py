from fastapi import APIRouter, Depends

from app.utils.auth_dependency import (

    get_current_user

)

from app.models.user_model import User

router = APIRouter(

    prefix="/users",

    tags=["Users"]
)

@router.get("/me")

def get_me(

    current_user: User = Depends(get_current_user)

):

    return {

        "id": current_user.id,

        "username": current_user.username,

        "email": current_user.email
        
    }