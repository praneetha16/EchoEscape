import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import api from "../services/api"

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"]
const RANK_ICONS  = ["🥇", "🥈", "🥉"]

function BarChart({ value, max }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / (max || 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg,#00E5FF,#8B5CF6)" }}
      />
    </div>
  )
}

export default function LeaderboardPage() {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    api.get("/progress/leaderboard")
      .then(r => setData(r.data))
      .catch(() => setError("Could not load leaderboard."))
      .finally(() => setLoading(false))
  }, [])

  const maxScore = data[0]?.total_score || 1

  return (
    <MainLayout>
      <div className="relative min-h-screen" style={{ background: "#05050F" }}>

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(255,216,0,0.06) 0%,transparent 70%)", filter: "blur(50px)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="text-center mb-12">
            <p className="text-xs tracking-[6px] uppercase font-semibold mb-4" style={{ color: "#FFD700" }}>
              Hall of Fame
            </p>
            <h1 className="font-black text-5xl md:text-6xl text-white mb-4 leading-none"
              style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}>
              LEADER
              <br />
              <span style={{
                background: "linear-gradient(90deg,#FFD700,#FF6B35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>BOARD</span>
            </h1>
            <p className="text-slate-400 text-base">
              Top players ranked by puzzle score across all rooms
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px mb-10"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,216,0,0.4),transparent)" }} />

          {loading && (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 rounded-2xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🏆</p>
              <p className="text-slate-400">{error}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🏆</p>
              <p className="text-xl font-medium text-white mb-2">No scores yet!</p>
              <p className="text-slate-500 text-sm">Solve puzzles to appear on the leaderboard.</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="space-y-3">
              {data.map((entry, i) => (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    background: i < 3
                      ? `rgba(${i === 0 ? "255,216,0" : i === 1 ? "192,192,192" : "205,127,50"},0.06)`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i < 3
                      ? `rgba(${i === 0 ? "255,216,0" : i === 1 ? "192,192,192" : "205,127,50"},0.25)`
                      : "rgba(255,255,255,0.07)"}`,
                  }}>

                  {/* Rank */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg">
                    {i < 3
                      ? RANK_ICONS[i]
                      : <span className="text-sm font-black" style={{ color: "rgba(255,255,255,0.4)" }}>{i + 1}</span>
                    }
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{entry.username}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {entry.puzzles_completed} puzzle{entry.puzzles_completed !== 1 ? "s" : ""} solved
                    </p>
                  </div>

                  {/* Score bar */}
                  <div className="hidden sm:flex items-center gap-3 w-32">
                    <BarChart value={entry.total_score} max={maxScore} />
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black"
                      style={{ color: i < 3 ? RANK_COLORS[i] : "#00E5FF" }}>
                      {entry.total_score.toLocaleString()}
                    </p>
                    <p className="text-[10px] tracking-widest uppercase"
                      style={{ color: "rgba(255,255,255,0.25)" }}>pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-xs"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            Score = time remaining × 10 points per puzzle
          </motion.p>
        </div>
      </div>
    </MainLayout>
  )
}
