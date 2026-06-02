import { motion } from "framer-motion"

export default function LostInTranslation({ puzzle }) {
  const translation = puzzle.options_json?.translation || puzzle.question

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(139,92,246,0.10))",
        border: "1.5px solid rgba(245,158,11,0.35)",
      }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.05)" }}>
        <span className="text-2xl">🌍</span>
        <div>
          <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#F59E0B" }}>
            Lost In Translation
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            English → Original Song
          </p>
        </div>
      </div>

      {/* Translation text */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Quote marks */}
          <span className="absolute -top-3 -left-1 text-6xl font-serif leading-none"
            style={{ color: "rgba(245,158,11,0.2)" }}>"</span>
          <p className="text-lg leading-relaxed font-medium pl-4 pr-2 pt-3"
            style={{ color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>
            {translation}
          </p>
          <span className="text-6xl font-serif leading-none float-right"
            style={{ color: "rgba(245,158,11,0.2)", marginTop: "-20px" }}>"</span>
        </motion.div>

        <div className="clear-both mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            🔍 Guess the original song title from this English description
          </p>
        </div>
      </div>
    </div>
  )
}
