import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function Particle({ x, color, delay }) {
  const size = randomBetween(6, 14)
  return (
    <motion.div
      initial={{ x: `${x}vw`, y: "50vh", opacity: 1, scale: 1 }}
      animate={{
        y: `${randomBetween(-20, 20)}vh`,
        x: `${x + randomBetween(-15, 15)}vw`,
        opacity: 0,
        scale: randomBetween(0.5, 1.5),
        rotate: randomBetween(0, 720),
      }}
      transition={{ duration: randomBetween(1.2, 2.2), delay, ease: "easeOut" }}
      className="fixed rounded-full pointer-events-none z-[200]"
      style={{ width: size, height: size, background: color }}
    />
  )
}

const COLORS = ["#00E5FF","#8B5CF6","#FF2D78","#FFD700","#34D399","#F59E0B","#EC4899","#3B82F6"]

export default function CelebrationAnimation({ show, message = "ROOM ESCAPED! 🎵" }) {
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(5, 95),
      color: COLORS[i % COLORS.length],
      delay: randomBetween(0, 0.5),
    }))
  )

  if (!show) return null

  return (
    <>
      {/* Particle burst */}
      {particles.current.map(p => (
        <Particle key={p.id} x={p.x} color={p.color} delay={p.delay} />
      ))}

      {/* Center celebration card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none"
      >
        <div className="text-center px-10 py-8 rounded-3xl"
          style={{
            background: "rgba(5,5,15,0.92)",
            border: "2px solid rgba(0,229,255,0.6)",
            boxShadow: "0 0 60px rgba(0,229,255,0.3), 0 0 120px rgba(139,92,246,0.2)",
          }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-7xl mb-4">
            🏆
          </motion.div>

          {/* Animated equalizer bars */}
          <div className="flex items-end justify-center gap-1.5 h-8 mb-5">
            {[70, 100, 50, 90, 60, 80, 45, 95, 65].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${h * 0.3}px`, `${h * 0.3}px`] }}
                initial={{ height: "3px" }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                className="w-2 rounded-full"
                style={{
                  height: `${h * 0.3}px`,
                  background: `linear-gradient(to top,#00E5FF,#8B5CF6,#FF2D78)`,
                  boxShadow: `0 0 6px rgba(0,229,255,0.5)`,
                }}
              />
            ))}
          </div>

          <motion.p
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-3xl font-black tracking-widest"
            style={{
              fontFamily: "Orbitron,Arial,sans-serif",
              background: "linear-gradient(90deg,#00E5FF,#8B5CF6,#FF2D78,#FFD700,#00E5FF)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            {message}
          </motion.p>
        </div>
      </motion.div>
    </>
  )
}
