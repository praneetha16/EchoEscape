import { motion } from "framer-motion"

const DIFF = {
  easy:   { label: "EASY",   color: "#34D399", glow: "rgba(52,211,153,0.35)"  },
  medium: { label: "MEDIUM", color: "#F59E0B", glow: "rgba(245,158,11,0.35)"  },
  hard:   { label: "HARD",   color: "#F87171", glow: "rgba(248,113,113,0.35)" },
}

const ICONS  = ["🎸", "🎹", "🎺", "🥁", "🎻", "🎤"]
const THEMES = [
  { from: "#00E5FF", to: "#8B5CF6" },
  { from: "#8B5CF6", to: "#FF2D78" },
  { from: "#FF2D78", to: "#F59E0B" },
  { from: "#00E5FF", to: "#FF2D78" },
  { from: "#F59E0B", to: "#8B5CF6" },
  { from: "#34D399", to: "#00E5FF" },
]

export default function RoomCard({ room, onEnter, isLocked = false }) {
  const icon  = ICONS[(room.id - 1) % ICONS.length]
  const theme = THEMES[(room.id - 1) % THEMES.length]
  const diff  = DIFF[room.difficulty?.toLowerCase()] ?? DIFF.medium

  return (
    <motion.div
      whileHover={isLocked ? {} : { y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={isLocked ? undefined : onEnter}
      className={`group relative rounded-2xl p-[1px] overflow-hidden ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ background: "rgba(255,255,255,0.06)", opacity: isLocked ? 0.6 : 1 }}
    >
      {/* gradient border on hover (unlocked only) */}
      {!isLocked && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        />
      )}

      {/* card body */}
      <div className="relative rounded-2xl p-7 h-full" style={{ background: "#0d0d1a" }}>

        {/* top glow (unlocked hover only) */}
        {!isLocked && (
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle, ${theme.from}22, transparent 70%)`, filter: "blur(20px)" }}
          />
        )}

        {/* icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 ${!isLocked && "group-hover:scale-110"}`}
          style={{
            background: isLocked ? "rgba(255,255,255,0.04)" : `linear-gradient(135deg, ${theme.from}18, ${theme.to}18)`,
            border: isLocked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${theme.from}30`,
            filter: isLocked ? "grayscale(1)" : "none",
          }}
        >
          {isLocked ? "🔒" : icon}
        </div>

        {/* name */}
        <h2
          className="text-2xl font-bold mb-2 leading-snug transition-colors duration-200"
          style={{
            fontFamily: "'Space Grotesk',Arial,sans-serif",
            color: isLocked ? "rgba(255,255,255,0.35)" : "white",
          }}
        >
          {room.name}
        </h2>

        {/* description */}
        <p
          className="text-sm leading-relaxed mb-7 line-clamp-2"
          style={{ color: isLocked ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.45)" }}
        >
          {isLocked ? "Complete the previous room to unlock this challenge." : room.description}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between">
          {/* difficulty badge */}
          <span
            className="text-[11px] font-black px-3 py-1.5 rounded-full tracking-widest"
            style={{
              background: isLocked ? "rgba(255,255,255,0.04)" : `${diff.color}18`,
              border: isLocked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${diff.color}50`,
              color: isLocked ? "rgba(255,255,255,0.25)" : diff.color,
              fontFamily: "'Orbitron',Arial,sans-serif",
            }}
          >
            {isLocked ? "LOCKED" : diff.label}
          </span>

          {isLocked ? (
            <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.20)" }}>
              🔒 Locked
            </span>
          ) : (
            <span
              className="text-sm font-bold flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
              style={{ color: theme.from }}
            >
              Enter Room
              <motion.span
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
