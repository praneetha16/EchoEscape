import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "../services/authService"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On app start, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("maestro-token")
    if (!token) { setLoading(false); return }

    getCurrentUser()
      .then(data => setUser(data))
      .catch(() => localStorage.removeItem("maestro-token"))
      .finally(() => setLoading(false))
  }, [])

  const login = (token, userData) => {
    localStorage.setItem("maestro-token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("maestro-token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
