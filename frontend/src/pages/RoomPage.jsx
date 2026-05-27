import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import RoomCard from "../components/RoomCard"
import { getRooms } from "../services/roomService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getCompletedRooms } from "../services/progressService"

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl h-64 animate-pulse"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />
  )
}

export default function RoomsPage() {
  const [rooms,        setRooms]        = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [loading,      setLoading]      = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => { fetchData() }, [isAuthenticated])

  const fetchData = async () => {
    try {
      const data = await getRooms()
      setRooms(data)
      if (isAuthenticated) {
        const ids = await getCompletedRooms()
        setCompletedIds(ids)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (room, index) => {
    if (index === 0) return true           // first room always open
    if (!isAuthenticated) return false     // must login to play
    const sorted = [...rooms].sort((a, b) => a.id - b.id)
    const prevId = sorted[index - 1]?.id
    return completedIds.includes(prevId)
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen" style={{ background: "#05050F" }}>

        {/* subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(0,229,255,0.07) 0%,transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <p
              className="text-xs tracking-[6px] uppercase font-semibold mb-4"
              style={{ color: "#00E5FF" }}
            >
              Choose Your Challenge
            </p>
            <h1
              className="font-black text-5xl md:text-7xl text-white mb-5 leading-none"
              style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}
            >
              ESCAPE
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#00E5FF,#8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ROOMS
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              Each room holds a unique set of audio puzzles.
              Pick your difficulty and begin the descent.
            </p>
          </motion.div>

          {/* divider */}
          <div
            className="h-px mb-12"
            style={{ background: "linear-gradient(90deg,rgba(0,229,255,0.4),rgba(139,92,246,0.25),transparent)" }}
          />

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-36">
              <p className="text-6xl mb-5">🎵</p>
              <p className="text-slate-400 text-xl font-medium mb-2">No rooms available yet.</p>
              <p className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <RoomCard
                    room={room}
                    onEnter={() => navigate(`/rooms/${room.id}`)}
                    isLocked={!isUnlocked(room, i)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
