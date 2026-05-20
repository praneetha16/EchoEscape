from fastapi import FastAPI

from app.database.connection import engine, Base

from app.models.user_model import User
from app.models.room_model import Room
from app.models.puzzle_model import Puzzle
from app.models.progress_model import UserProgress

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")

def root():

    return {"message": "EchoEscape Backend Running"}
 