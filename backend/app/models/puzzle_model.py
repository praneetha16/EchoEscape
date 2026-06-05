from sqlalchemy import Column, Integer, String, Text, ForeignKey, LargeBinary

from app.database.connection import Base

class Puzzle(Base):

    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, index=True)

    room_id = Column(Integer, ForeignKey("rooms.id"))

    puzzle_order = Column(Integer)

    type = Column(String(50))

    title = Column(String(100))

    question = Column(Text)

    answer = Column(String(255))

    audio_url = Column(String(255))

    image_data = Column(LargeBinary, nullable=True)

    hint = Column(Text)

    options_json = Column(Text, nullable=True)
 