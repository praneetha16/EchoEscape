import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate("/")
    setOpen(false)
  }

  const navLink = (label, path) => (
    <button
      onClick={() => { navigate(path); setOpen(false) }}
      className="text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg"
      style={{
        color: isActive(path) ? "#00E5FF" : "rgba(255,255,255,0.5)",
        background: isActive(path) ? "rgba(0,229,255,0.08)" : "transparent",
        border: isActive(path) ? "1px solid rgba(0,229,255,0.15)" : "1px solid transparent",
      }}>
      {label}
    </button>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5,5,15,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
      <div className="w-full px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div style={{
            width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
            boxShadow: "0 0 16px rgba(0,229,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Orbitron',Arial,sans-serif", fontWeight: 900, fontSize: "11px", color: "#000",
          }}>EE</div>
          <span className="hidden sm:block text-lg font-black tracking-widest"
            style={{ fontFamily: "'Orbitron',Arial,sans-serif", color: "white" }}>
            ECHO<span style={{ color: "#00E5FF" }}>ESCAPE</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLink("Rooms", "/rooms")}
          {navLink("Leaderboard", "/leaderboard")}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.20)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "#00E5FF" }} />
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {user?.username}
                </span>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.10)" }}>
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-xl font-black text-sm text-black"
                style={{
                  background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
                  fontFamily: "'Orbitron',Arial,sans-serif",
                  boxShadow: "0 0 20px rgba(0,229,255,0.25)",
                  letterSpacing: "0.04em",
                }}>
                LOGIN
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 rounded-xl font-black text-sm"
                style={{
                  background: "transparent",
                  fontFamily: "'Orbitron',Arial,sans-serif",
                  border: "1.5px solid rgba(0,229,255,0.4)",
                  color: "#00E5FF",
                  letterSpacing: "0.04em",
                }}>
                SIGN UP
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="flex md:hidden flex-col gap-[5px] p-1" onClick={() => setOpen(!open)} aria-label="Menu">
          {[0, 1, 2].map(i => (
            <motion.span key={i}
              animate={open
                ? i === 0 ? { rotate: 45, y: 7 } : i === 1 ? { opacity: 0 } : { rotate: -45, y: -7 }
                : { rotate: 0, y: 0, opacity: 1 }}
              className="block w-5 h-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.7)" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(5,5,15,0.95)" }}>
            <div className="px-6 py-5 flex flex-col gap-4">
              <button onClick={() => { navigate("/rooms"); setOpen(false) }}
                className="text-left text-sm font-medium"
                style={{ color: isActive("/rooms") ? "#00E5FF" : "rgba(255,255,255,0.6)" }}>
                Rooms
              </button>
              <button onClick={() => { navigate("/leaderboard"); setOpen(false) }}
                className="text-left text-sm font-medium"
                style={{ color: isActive("/leaderboard") ? "#FFD700" : "rgba(255,255,255,0.6)" }}>
                Leaderboard
              </button>
              {isAuthenticated ? (
                <>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Signed in as <span style={{ color: "#00E5FF" }}>{user?.username}</span>
                  </p>
                  <button onClick={handleLogout} className="text-left text-sm font-bold"
                    style={{ color: "rgba(255,255,255,0.35)" }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate("/login"); setOpen(false) }}
                    className="text-center py-3 rounded-xl font-black text-sm text-black"
                    style={{ background: "linear-gradient(135deg,#00E5FF,#8B5CF6)", fontFamily: "'Orbitron',Arial,sans-serif" }}>
                    LOGIN
                  </button>
                  <button onClick={() => { navigate("/register"); setOpen(false) }}
                    className="text-center py-3 rounded-xl font-black text-sm"
                    style={{ border: "1.5px solid rgba(0,229,255,0.4)", color: "#00E5FF", fontFamily: "'Orbitron',Arial,sans-serif" }}>
                    SIGN UP
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
