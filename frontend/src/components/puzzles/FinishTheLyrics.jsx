import { motion } from "framer-motion"

export default function FinishTheLyrics({ puzzle }) {
  const lyric = puzzle.options_json?.displayed_lyric || puzzle.question

  return (
    <div className="rounded-2xl p-8"
      style={{
        background: "linear-gradient(135deg,rgba(0,229,255,0.08),rgba(255,45,120,0.06))",
        border: "1.5px solid rgba(0,229,255,0.25)",
      }}>
      <p className="text-xs tracking-[5px] uppercase font-semibold mb-5"
        style={{ color: "#00E5FF" }}>
        🎵 Finish The Lyrics
      </p>

      {/* Lyric display */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
          style={{ background: "linear-gradient(to bottom,#00E5FF,#8B5CF6)" }} />
        <div className="pl-6">
          <p className="text-xl sm:text-2xl font-semibold italic leading-relaxed text-white mb-3">
            "{lyric}"
          </p>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scaleX: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="h-0.5 w-8 rounded-full"
              style={{ background: "#00E5FF" }}
            />
            <span className="text-sm" style={{ color: "rgba(0,229,255,0.6)" }}>
              ...complete the next line
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-lg">🎤</span>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Type the missing lyric line in the answer box below
        </p>
      </div>
    </div>
  )
}
