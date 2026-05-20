from sqlalchemy import Column, Integer, String

from app.database.connection import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True)

    email = Column(String(100), unique=True)

    password_hash = Column(String(255))
 