from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.room_model import Room

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)

@router.get("/")

def get_rooms(
    db: Session = Depends(get_db)
):

    rooms = db.query(Room).all()
    return rooms