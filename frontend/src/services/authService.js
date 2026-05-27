import api from "./api"

export const registerUser = (username, email, password) =>
  api.post("/auth/register", { username, email, password }).then(r => r.data)

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password }).then(r => r.data)

export const getCurrentUser = () =>
  api.get("/users/me").then(r => r.data)
