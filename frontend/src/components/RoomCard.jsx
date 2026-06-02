import { motion } from "framer-motion"

// All neon cyber — each room gets a distinct gradient within the same palette
const ROOM_THEMES = [
  // Bollywood Beats — cyan → purple
  {
    icon: "🎬",
    from: "#00E5FF",
    to: "#8B5CF6",
    accent: "#00E5FF",
    barColor: null,       // null = use from→to gradient
  },
  // Sandalwood Symphony — purple → pink  (ಕ = Kannada letter Ka)
  {
    icon: "ಕ",
    from: "#8B5CF6",
    to: "#FF2D78",
    accent: "#A78BFA",
    barColor: null,
  },
  // K-Pop Fever — pink → cyan
  {
    icon: "💜",
    from: "#FF2D78",
    to: "#00E5FF",
    accent: "#FF2D78",
    barColor: "#FF2D78",  // single solid pink, no two-tone mix
  },
]

export default function RoomCard({ room, onEnter, isLocked = false, roomIndex = 0 }) {
  const theme = ROOM_THEMES[roomIndex % ROOM_THEMES.length]

  return (
    <motion.div
      whileHover={isLocked ? {} : { y: -8, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={isLocked ? undefined : onEnter}
      className={`group relative rounded-2xl overflow-hidden h-full ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ padding: "1.5px", opacity: isLocked ? 0.5 : 1 }}
    >
      {/* Gradient border — always visible, brightens on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          opacity: isLocked ? 0.15 : 0.35,
        }}
      />
      {/* Hover glow layer */}
      {!isLocked && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
            opacity: 0,
          }}
        />
      )}

      {/* Card body */}
      <div
        className="relative rounded-[14px] p-7 h-full flex flex-col"
        style={{
          background: "#080814",
          boxShadow: isLocked ? "none" : `inset 0 0 40px ${theme.from}08`,
        }}
      >
        {/* Corner glow on hover */}
        {!isLocked && (
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle, ${theme.from}20, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
        )}

        {/* Icon row */}
        <div className="mb-5">
          <motion.div
            whileHover={isLocked ? {} : { scale: 1.12, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: isLocked
                ? "rgba(255,255,255,0.04)"
                : `linear-gradient(135deg, ${theme.from}20, ${theme.to}20)`,
              border: `1.5px solid ${isLocked ? "rgba(255,255,255,0.08)" : `${theme.from}50`}`,
              boxShadow: isLocked ? "none" : `0 0 20px ${theme.from}25`,
              filter: isLocked ? "grayscale(1)" : "none",
              fontSize: isLocked ? "1.4rem" : theme.icon.length === 1 && theme.icon.charCodeAt(0) > 127 && theme.icon.charCodeAt(0) < 0x1000 ? "1.5rem" : "1.4rem",
              fontWeight: 700,
              color: isLocked ? "rgba(255,255,255,0.3)" : theme.accent,
              fontFamily: isLocked ? "inherit" : "inherit",
            }}
          >
            {isLocked ? "🔒" : theme.icon}
          </motion.div>
        </div>

        {/* Title */}
        <h2
          className="text-xl font-bold mb-2 leading-snug"
          style={{
            fontFamily: "'Space Grotesk', Arial, sans-serif",
            color: isLocked ? "rgba(255,255,255,0.3)" : "white",
          }}
        >
          {room.name}
        </h2>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-5 line-clamp-3 flex-1"
          style={{ color: isLocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)" }}
        >
          {isLocked ? "Complete the previous room to unlock." : room.description}
        </p>

        {/* Animated mini equalizer */}
        {!isLocked && (
          <div className="flex items-end gap-1 h-6 mb-5">
            {[35, 65, 45, 90, 55, 80, 40, 70].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${h * 0.26}px`, `${h * 0.08}px`, `${h * 0.26}px`] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1, ease: "easeInOut" }}
                className="flex-1 rounded-full"
                style={{
                  minHeight: "3px",
                  background: theme.barColor
                    ? theme.barColor
                    : `linear-gradient(to top, ${theme.from}, ${theme.to})`,
                  boxShadow: `0 0 4px ${theme.barColor || theme.from}60`,
                }}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end">
          {isLocked ? (
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.18)" }}>
              🔒 Locked
            </span>
          ) : (
            <motion.span
              className="text-sm font-bold flex items-center gap-1"
              style={{ color: theme.accent }}
            >
              Enter Arena
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
