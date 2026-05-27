import api from "./api"

export const getRooms  = () => api.get("/rooms").then(r => r.data)
export const getRoom   = (id) => api.get(`/rooms/${id}`).then(r => r.data)