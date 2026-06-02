import api from "./api"

// Puzzle level
export const markPuzzleComplete = (puzzleId, score = 0, timeTaken = null) =>
  api.post(`/progress/puzzle/${puzzleId}/complete`, { score, time_taken: timeTaken }).then(r => r.data)

export const getCompletedPuzzlesForRoom = (roomId) =>
  api.get(`/progress/room/${roomId}/puzzles`).then(r => r.data.completed_puzzle_ids)

// Room level
export const getCompletedRooms = () =>
  api.get("/progress/rooms/completed").then(r => r.data.completed_room_ids)

// Reset a room so the player can replay it
export const resetRoomProgress = (roomId) =>
  api.delete(`/progress/room/${roomId}/reset`).then(r => r.data)

// Leaderboard
export const getLeaderboard = () =>
  api.get("/progress/leaderboard").then(r => r.data)
