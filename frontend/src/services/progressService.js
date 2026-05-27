import api from "./api"

// Puzzle level
export const markPuzzleComplete = (puzzleId) =>
  api.post(`/progress/puzzle/${puzzleId}/complete`).then(r => r.data)

export const getCompletedPuzzlesForRoom = (roomId) =>
  api.get(`/progress/room/${roomId}/puzzles`).then(r => r.data.completed_puzzle_ids)

// Room level
export const markRoomComplete = (roomId) =>
  api.post(`/progress/room/${roomId}/complete`).then(r => r.data)

export const getCompletedRooms = () =>
  api.get("/progress/rooms/completed").then(r => r.data.completed_room_ids)
