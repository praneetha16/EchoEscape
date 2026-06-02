import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function AlbumBlurPuzzle({ puzzle, timerActive }) {
  const [blurLevel, setBlurLevel] = useState(20)

  // Reduce blur every 5 seconds while timer is active
  useEffect(() => {
    if (!timerActive) return
    const interval = setInterval(() => {
      setBlurLevel(prev => Math.max(prev - 3, 0))
    }, 5000)
    return () => clearInterval(interval)
  }, [timerActive])

  const clarity = Math.round(((20 - blurLevel) / 20) * 100)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(255,216,0,0.35)",
        background: "rgba(255,216,0,0.04)",
      }}>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,216,0,0.15)" }}>
        <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#FFD700" }}>
          🌫️ Album Blur Puzzle
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${clarity}%` }}
              transition={{ duration: 0.5 }}
              style={{ background: "linear-gradient(90deg,#FFD700,#FF6B35)" }}
            />
          </div>
          <span className="text-xs font-bold" style={{ color: "#FFD700" }}>{clarity}%</span>
        </div>
      </div>

      <div className="p-4">
        {puzzle.image_url ? (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={puzzle.image_url}
              alt="Album cover"
              className="w-full rounded-xl transition-all duration-1000"
              style={{ filter: `blur(${blurLevel}px)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {blurLevel > 12 && (
                <motion.div
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-4 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(255,216,0,0.4)",
                    color: "#FFD700",
                  }}>
                  Clearing up...
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 rounded-xl"
            style={{ background: "rgba(255,216,0,0.05)", border: "1px dashed rgba(255,216,0,0.3)" }}>
            <span className="text-5xl mb-3">💿</span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Album cover unavailable in demo mode
            </p>
          </div>
        )}
        <p className="mt-4 text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
          The image clears over time — identify it before it's too obvious!
        </p>
      </div>
    </div>
  )
}
