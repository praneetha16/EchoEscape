from sqlalchemy import Column, Integer, String, Text

from app.database.connection import Base

class Room(Base):

    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))

    description = Column(Text)

    difficulty = Column(String(20))
 