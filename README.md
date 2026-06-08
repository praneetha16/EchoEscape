# Maestro 🎵

> A Musical Quest.

A music-based puzzle web application where players solve audio and lyric challenges to progress through three themed arenas. Race against the clock — the faster you solve, the higher your score.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- Howler.js (audio playback)
- React Router v7
- Axios

**Backend**
- FastAPI
- SQLAlchemy 2 + MySQL (PyMySQL)
- JWT authentication (python-jose)
- Bcrypt password hashing

---

## Features

### Three Themed Music Arenas

| Arena | Theme |
|---|---|
| Bollywood Beats | Hindi film classics — AR Rahman, Arijit Singh, and more |
| Sandalwood Symphony | Kannada film music — Gaalipata, Mungaru Male, and more |
| K-Pop Fever | K-Pop hits — BTS, BLACKPINK, TWICE, Stray Kids, and more |

Each arena has **7 puzzles** to solve in sequence.

### Puzzle Types

| Type | Description |
|---|---|
| **Emoji Song** | Decode a song title from an emoji sequence |
| **Finish the Lyrics** | Complete the missing line of a song |
| **Lost in Translation** | Identify a song from its poetic English description |
| **Picture Tune** | Guess the song from image clues |
| **Rapid Fire Round** | Answer 5 quick-fire music questions, get at least 3 right to pass |
| **Beat Match** | Match song titles to their artists |
| **Missing Word** | Fill in the blanks in a set of lyrics |

### Scoring & Leaderboard
- Score per puzzle = `time remaining × 10`
- Global leaderboard ranks the top 20 players by total score across all arenas

### User System
- Register and log in with email and password
- JWT-based sessions (1-hour expiry)
- Per-room progress tracking — pick up where you left off
- Room reset option to replay an arena

---

## Project Structure

```
Maestro/
├── frontend/               # React + Vite
│   └── src/
│       ├── pages/          # HomePage, RoomPage, PuzzlePage, LeaderboardPage, ResultPage
│       ├── components/
│       │   └── puzzles/    # One component per puzzle type
│       ├── context/        # AuthContext (JWT session)
│       ├── services/       # API calls (auth, rooms, puzzles, progress)
│       └── routes/         # AppRoutes.jsx
└── backend/                # FastAPI
    └── app/
        ├── models/         # User, Room, Puzzle, UserProgress
        ├── routes/         # auth, users, rooms, puzzles, progress, seed
        ├── schemas/        # Pydantic schemas
        └── utils/          # JWT handler, bcrypt, auth dependency
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/users/me` | ✓ | Current user profile |
| GET | `/rooms/` | — | List all arenas |
| GET | `/puzzles/room/{id}` | — | Get puzzles in an arena |
| POST | `/puzzles/{id}/submit` | — | Submit an answer |
| POST | `/progress/puzzle/{id}/complete` | ✓ | Save score for a puzzle |
| GET | `/progress/room/{id}/puzzles` | ✓ | Completed puzzle IDs |
| DELETE | `/progress/room/{id}/reset` | ✓ | Reset arena progress |
| GET | `/progress/leaderboard` | — | Top 20 global rankings |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=maestro
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

```bash
uvicorn app.main:app --reload
```

Seed the database (first run):
```
POST http://localhost:8000/admin/seed
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Screenshots

> Coming soon

---