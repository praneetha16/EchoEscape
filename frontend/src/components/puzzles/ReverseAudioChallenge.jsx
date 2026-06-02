import { motion } from "framer-motion"

export default function ReverseAudioChallenge({ puzzle }) {
  return (
    <div className="rounded-2xl p-7"
      style={{
        background: "linear-gradient(135deg,rgba(52,211,153,0.08),rgba(0,229,255,0.06))",
        border: "1.5px solid rgba(52,211,153,0.35)",
      }}>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.35)" }}>
          <span className="text-2xl">🔄</span>
        </div>
        <div>
          <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#34D399" }}>
            Reverse Audio Challenge
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Play the audio clip below — it's reversed!
          </p>
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="flex items-end justify-center gap-1 h-14 mb-6">
        {Array.from({ length: 24 }).map((_, i) => {
          const h = [40, 60, 30, 80, 50, 90, 35, 70, 55, 85, 45, 75, 30, 65, 50, 95, 40, 70, 55, 80, 35, 60, 45, 70][i]
          return (
            <motion.div
              key={i}
              animate={{ scaleY: [1, 0.3, 0.7, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.06, ease: "easeInOut" }}
              className="w-1.5 rounded-full origin-bottom"
              style={{
                height: `${h * 0.55}px`,
                background: `linear-gradient(to top, #34D399, #00E5FF)`,
                opacity: 0.6,
              }}
            />
          )
        })}
      </div>

      <div className="px-4 py-3 rounded-xl text-center"
        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
        <p className="text-sm font-medium" style={{ color: "rgba(52,211,153,0.8)" }}>
          🎵 Audio plays in reverse mode
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          Listen carefully and identify the original song
        </p>
      </div>
    </div>
  )
}
