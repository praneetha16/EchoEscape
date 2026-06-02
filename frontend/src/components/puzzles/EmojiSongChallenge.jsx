import { motion } from "framer-motion"

export default function EmojiSongChallenge({ puzzle }) {
  const emojis = puzzle.options_json?.emojis || "🎵🎶🎸🎤"
  const emojiList = Array.from(emojis).filter(e => e.trim())

  return (
    <div
      className="rounded-2xl p-8 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.10), rgba(0,229,255,0.07))",
        border: "1.5px solid rgba(139,92,246,0.40)",
        boxShadow: "0 0 40px rgba(139,92,246,0.12), inset 0 0 40px rgba(0,229,255,0.04)",
      }}
    >
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.12), transparent 70%)", filter: "blur(16px)" }} />
      <div className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)", filter: "blur(16px)" }} />

      <p className="text-[10px] tracking-[6px] uppercase font-bold mb-7 relative"
        style={{ color: "rgba(139,92,246,0.9)" }}>
        Emoji Song Clue
      </p>

      {/* Emoji strip */}
      <div className="flex items-center justify-center gap-4 flex-wrap mb-7 relative">
        {emojiList.map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 220, damping: 14 }}
            whileHover={{ scale: 1.3, rotate: 10 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow behind each emoji */}
            <div className="absolute inset-0 rounded-full blur-sm"
              style={{ background: "rgba(139,92,246,0.3)", transform: "scale(0.8)" }} />
            <span
              className="relative text-5xl sm:text-6xl select-none"
              style={{ filter: "drop-shadow(0 0 10px rgba(139,92,246,0.6))" }}
            >
              {emoji}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Separator dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {emojiList.map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: i % 2 === 0 ? "#00E5FF" : "#8B5CF6" }}
          />
        ))}
      </div>

      <p className="text-xs tracking-widest uppercase relative"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        Decode the song title from these clues
      </p>
    </div>
  )
}
