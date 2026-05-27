const KEY = "echoescape-completed"

/** Returns array of completed room IDs */
export const getCompleted = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") }
  catch { return [] }
}

/** Marks a room as completed */
export const markCompleted = (roomId) => {
  const done = getCompleted()
  if (!done.includes(Number(roomId))) {
    localStorage.setItem(KEY, JSON.stringify([...done, Number(roomId)]))
  }
}

/**
 * A room is unlocked if it's the first (lowest id) room,
 * or the room directly before it (sorted by id) is completed.
 */
export const isRoomUnlocked = (roomId, allRooms) => {
  const sorted = [...allRooms].sort((a, b) => a.id - b.id)
  const idx    = sorted.findIndex(r => r.id === roomId)
  if (idx <= 0) return true                        // first room always open
  const prevId = sorted[idx - 1].id
  return getCompleted().includes(prevId)
}
