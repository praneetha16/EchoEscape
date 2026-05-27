from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.room_model import Room

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)

@router.get("/")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.get("/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room