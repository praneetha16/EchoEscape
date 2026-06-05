import base64

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.puzzle_model import Puzzle

from fastapi import HTTPException

from pydantic import BaseModel

router = APIRouter(

    prefix="/puzzles",

    tags=["Puzzles"]

)
def serialize_puzzle(puzzle):
    """Convert puzzle with binary image data to JSON-serializable format with base64"""
    puzzle_dict = {
        "id": puzzle.id,
        "room_id": puzzle.room_id,
        "puzzle_order": puzzle.puzzle_order,
        "type": puzzle.type,
        "title": puzzle.title,
        "question": puzzle.question,
        "answer": puzzle.answer,
        "audio_url": puzzle.audio_url,
        "image_url": base64.b64encode(puzzle.image_data).decode() if puzzle.image_data else None,
        "hint": puzzle.hint,
        "options_json": puzzle.options_json,
    }
    return puzzle_dict

@router.get("/room/{room_id}")

def get_puzzles_by_room(

    room_id: int,

    db: Session = Depends(get_db)

):

    puzzles = db.query(Puzzle).filter(

        Puzzle.room_id == room_id

    ).all()

    return [serialize_puzzle(p) for p in puzzles]

class AnswerSchema(BaseModel):
    answer: str
@router.post("/{puzzle_id}/submit")
def submit_answer(
    puzzle_id: int,
    request: AnswerSchema,
    db: Session = Depends(get_db)
):
    puzzle = db.query(Puzzle).filter(
        Puzzle.id == puzzle_id
    ).first()
    if not puzzle:
        raise HTTPException(
            status_code=404,
            detail="Puzzle not found"
        )
    correct_answer = puzzle.answer.lower().strip()
    user_answer = request.answer.lower().strip()
    is_correct = correct_answer == user_answer
    return {
        "correct": is_correct,
        "correct_answer": puzzle.answer
    }
 