from sqlalchemy import Column, Integer, Boolean, ForeignKey

from app.database.connection import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    room_id = Column(Integer, ForeignKey("rooms.id"))

    puzzle_id = Column(Integer, ForeignKey("puzzles.id"))

    completed = Column(Boolean, default=False)

    score = Column(Integer, default=0)