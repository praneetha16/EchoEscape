import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import RoomCard from "../components/RoomCard"
import { getRooms } from "../services/roomService"
import { useNavigate } from "react-router-dom"

function SkeletonCard() {
  return (
    <div className="rounded-2xl h-72 animate-pulse"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
  )
}

export default function RoomsPage() {
  const [rooms,   setRooms]   = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sortedRooms = [...rooms].sort((a, b) => a.id - b.id)

  return (
    <MainLayout>
      <div className="relative min-h-screen" style={{ background: "#05050F" }}>

        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(0,229,255,0.06) 0%,transparent 65%)", filter: "blur(50px)" }} />
        <div className="absolute top-48 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(255,107,53,0.05) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute top-48 right-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(168,85,247,0.06) 0%,transparent 65%)", filter: "blur(60px)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <p className="text-xs tracking-[6px] uppercase font-semibold mb-4" style={{ color: "#00E5FF" }}>
              Choose Your Challenge
            </p>
            <h1 className="font-black text-5xl md:text-7xl text-white mb-5 leading-none"
              style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}>
              MUSIC
              <br />
              <span style={{
                background: "linear-gradient(90deg,#FF6B35,#FF2D78,#A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>ARENAS</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              3 themed arenas. 7 unique puzzles each. Bollywood, Sandalwood, and K-Pop await.
              Jump into any arena — solve puzzles in order to progress within each room.
            </p>
          </motion.div>

          {/* Arena theme badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10">
            {[
              { icon: "🎬", label: "Bollywood Beats", color: "#FF6B35" },
              { icon: "🌿", label: "Sandalwood Symphony", color: "#22C55E" },
              { icon: "💜", label: "K-Pop Fever", color: "#A855F7" },
            ].map(({ icon, label, color }) => (
              <span key={label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}30`,
                  color: color,
                }}>
                {icon} {label}
              </span>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="h-px mb-12"
            style={{ background: "linear-gradient(90deg,rgba(255,107,53,0.5),rgba(168,85,247,0.4),transparent)" }} />

          {/* Room grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-36">
              <p className="text-6xl mb-5">🎵</p>
              <p className="text-slate-400 text-xl font-medium mb-2">No arenas available yet.</p>
              <p className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                Run POST /admin/seed to populate the database.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRooms.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="h-full"
                >
                  <RoomCard
                    room={room}
                    roomIndex={i}
                    onEnter={() => navigate(`/rooms/${room.id}`)}
                    isLocked={false}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Puzzle type legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs tracking-[5px] uppercase font-semibold mb-6 text-center"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              7 Puzzle Types Per Arena
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "🎭 Emoji Song", "🎤 Finish Lyrics", "🌍 Lost in Translation",
                "🖼️ Picture Tune", "⚡ Rapid Fire", "🎯 Beat Match", "📝 Missing Word",
              ].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  className="text-xs px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(0,229,255,0.05)",
                    border: "1px solid rgba(0,229,255,0.15)",
                    color: "rgba(0,229,255,0.6)",
                  }}>
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
