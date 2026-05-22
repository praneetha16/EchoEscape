import api from "./api"
export const getPuzzlesByRoom = async (
  roomId
) => {
  const response = await api.get(
    `/puzzles/room/${roomId}`
  )
  console.log(
    "Puzzles API Response:",
    response.data
  )
  return response.data
}
export const submitPuzzleAnswer = async (
  puzzleId,
  answer
) => {
  const response = await api.post(
    `/puzzles/${puzzleId}/submit`,
    {
      answer: answer
    }
  )
  console.log(
    "Submit API Response:",
    response.data
  )
  return response.data
}