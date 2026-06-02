import { motion } from "framer-motion"

export default function DialogueToSong({ puzzle }) {
  const dialogue = puzzle.options_json?.dialogue || `"${puzzle.question}"`
  const character = puzzle.options_json?.character || "Unknown character"

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgba(168,85,247,0.10),rgba(255,45,120,0.08))",
        border: "1.5px solid rgba(168,85,247,0.35)",
      }}>

      <div className="px-6 pt-5 pb-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
        <span className="text-xl">🎬</span>
        <div>
          <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#A855F7" }}>
            Dialogue To Song
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Which song does this lead to?
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Film roll decorative element */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-6 h-4 rounded-sm border"
              style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.2)" }} />
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative pl-5 mb-4"
          style={{ borderLeft: "3px solid #A855F7" }}
        >
          <p className="text-base sm:text-lg font-semibold leading-relaxed"
            style={{ color: "rgba(255,255,255,0.9)", fontStyle: "italic" }}>
            {dialogue}
          </p>
        </motion.blockquote>

        <p className="text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2"
          style={{
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.20)",
            color: "rgba(168,85,247,0.8)",
          }}>
          🎭 {character}
        </p>

        <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          🎵 Guess which song is associated with this iconic film dialogue
        </p>
      </div>
    </div>
  )
}
