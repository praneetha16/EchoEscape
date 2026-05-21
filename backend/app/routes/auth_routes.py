from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user_model import User

from app.schemas.auth_schema import (

    RegisterSchema,

    LoginSchema

)

from app.utils.hash import (

    hash_password,

    verify_password

)

from app.utils.jwt_handler import (

    create_access_token

)

router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]

)

# REGISTER API

@router.post("/register")

def register_user(

    request: RegisterSchema,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(

        User.email == request.email

    ).first()

    if existing_user:

        raise HTTPException(

            status_code=400,

            detail="Email already registered"

        )

    new_user = User(

        username=request.username,

        email=request.email,

        password_hash=hash_password(

            request.password

        )

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "User registered successfully"

    }

# LOGIN API

@router.post("/login")

def login_user(

    request: LoginSchema,

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(

        User.email == request.email

    ).first()

    if not user:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )

    password_correct = verify_password(

        request.password,

        user.password_hash

    )

    if not password_correct:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )

    access_token = create_access_token(

        data={

            "user_id": user.id,

            "email": user.email

        }

    )

    return {

        "access_token": access_token,

        "token_type": "bearer"

    }
 