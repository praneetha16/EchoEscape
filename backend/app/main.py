from fastapi import FastAPI
from sqlalchemy import text
from app.database.connection import engine, Base
from app.models.user_model import User
from app.models.room_model import Room
from app.models.puzzle_model import Puzzle
from app.models.progress_model import UserProgress
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.room_routes import router as room_router
from app.routes.puzzle_routes import router as puzzle_router
from app.routes.progress_routes import router as progress_router
from app.routes.seed_routes import router as seed_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

# Add new columns to existing tables if they don't exist (dev migration)
def _safe_alter(conn, sql):
    try:
        conn.execute(text(sql))
        conn.commit()
    except Exception:
        pass

with engine.connect() as conn:
    _safe_alter(conn, "ALTER TABLE puzzles ADD COLUMN options_json TEXT")
    _safe_alter(conn, "ALTER TABLE user_progress ADD COLUMN score INT DEFAULT 0")
    _safe_alter(conn, "ALTER TABLE user_progress ADD COLUMN time_taken INT")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(room_router)
app.include_router(puzzle_router)
app.include_router(progress_router)
app.include_router(seed_router)

@app.get("/")
def root():
    return {"message": "Maestro Backend Running"}
