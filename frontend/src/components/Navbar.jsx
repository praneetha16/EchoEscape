import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  const isRooms = location.pathname.startsWith("/rooms")

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5,5,15,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          {/* icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-black"
            style={{
              background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
              boxShadow: "0 0 16px rgba(0,229,255,0.4)",
              fontFamily: "'Orbitron',Arial,sans-serif",
            }}
          >
            EE
          </div>
          {/* wordmark */}
          <span
            className="text-lg font-black tracking-widest hidden sm:block"
            style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}
          >
            <span className="text-white">ECHO</span>
            <span style={{ color: "#00E5FF" }}>ESCAPE</span>
          </span>
        </button>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/rooms")}
            className="text-sm font-medium transition-colors"
            style={{ color: isRooms ? "#00E5FF" : "rgba(255,255,255,0.5)" }}
          >
            Rooms
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/rooms")}
            className="px-5 py-2.5 rounded-xl font-black text-sm text-black"
            style={{
              background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
              fontFamily: "'Orbitron',Arial,sans-serif",
              boxShadow: "0 0 20px rgba(0,229,255,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            PLAY NOW
          </motion.button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                open
                  ? i === 0 ? { rotate: 45, y: 7 }
                  : i === 1 ? { opacity: 0 }
                  : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(5,5,15,0.95)" }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              <button
                onClick={() => { navigate("/rooms"); setOpen(false) }}
                className="text-left text-sm font-medium"
                style={{ color: isRooms ? "#00E5FF" : "rgba(255,255,255,0.6)" }}
              >
                Rooms
              </button>
              <button
                onClick={() => { navigate("/rooms"); setOpen(false) }}
                className="text-center py-3 rounded-xl font-black text-sm text-black"
                style={{
                  background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
                  fontFamily: "'Orbitron',Arial,sans-serif",
                }}
              >
                PLAY NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
