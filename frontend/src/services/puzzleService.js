import api from "./api"

function parsePuzzle(p) {
  if (p.options_json && typeof p.options_json === "string") {
    try { p.options_json = JSON.parse(p.options_json) } catch {}
  }
  return p
}

export const getPuzzlesByRoom = async (roomId) => {
  const response = await api.get(`/puzzles/room/${roomId}`)
  return (response.data || []).map(parsePuzzle)
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