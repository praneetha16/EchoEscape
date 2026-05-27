from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.progress_model import UserProgress
from app.models.puzzle_model import Puzzle
from app.models.room_model import Room
from app.utils.auth_dependency import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/progress", tags=["Progress"])


# ── Puzzle level ───────────────────────────────────────────

@router.post("/puzzle/{puzzle_id}/complete")
def mark_puzzle_complete(
    puzzle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    puzzle = db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    existing = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.puzzle_id == puzzle_id
    ).first()

    if not existing:
        db.add(UserProgress(
            user_id=current_user.id,
            room_id=puzzle.room_id,
            puzzle_id=puzzle_id,
            completed=True
        ))
        db.commit()

    return {"message": "Puzzle marked as completed"}


@router.get("/room/{room_id}/puzzles")
def get_completed_puzzles_for_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.room_id == room_id,
        UserProgress.completed == True
    ).all()

    return {"completed_puzzle_ids": [r.puzzle_id for r in rows]}


# ── Room level (derived — no extra row written) ────────────

@router.get("/rooms/completed")
def get_completed_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    A room is considered completed when the user has a completed
    progress row for EVERY puzzle in that room.
    No separate room-completion row is needed.
    """
    rooms = db.query(Room).all()
    completed_room_ids = []

    for room in rooms:
        puzzle_ids = [
            p.id for p in db.query(Puzzle).filter(Puzzle.room_id == room.id).all()
        ]
        if not puzzle_ids:
            continue

        done_count = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.puzzle_id.in_(puzzle_ids),
            UserProgress.completed == True
        ).count()

        if done_count >= len(puzzle_ids):
            completed_room_ids.append(room.id)

    return {"completed_room_ids": completed_room_ids}
