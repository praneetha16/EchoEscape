import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export default function FiveSecondClip({ puzzle }) {
  const audioRef   = useRef(null)
  const timerRef   = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [played,   setPlayed]   = useState(false)
  const [progress, setProgress] = useState(0) // 0–100 over 5s
  const CLIP_DURATION = 5 // seconds

  const audioUrl = puzzle.audio_url

  // clean up on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }
  }, [])

  const playClip = () => {
    if (playing || !audioUrl) return
    const audio = audioRef.current
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => {})
    setPlaying(true)
    setPlayed(true)
    setProgress(0)

    const start = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const pct = Math.min((elapsed / CLIP_DURATION) * 100, 100)
      setProgress(pct)
      if (elapsed >= CLIP_DURATION) {
        clearInterval(timerRef.current)
        audio.pause()
        audio.currentTime = 0
        setPlaying(false)
      }
    }, 50)
  }

  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background: "linear-gradient(135deg,rgba(255,45,120,0.08),rgba(0,229,255,0.06))",
        border: "1.5px solid rgba(255,45,120,0.35)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.35)" }}>
          <span className="text-2xl">🎧</span>
        </div>
        <div>
          <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#FF2D78" }}>
            5-Second Clip
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Listen to the clip and name the song
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Waveform bars */}
      <div className="flex items-end justify-center gap-1 h-14 mb-6">
        {Array.from({ length: 28 }).map((_, i) => {
          const heights = [35,55,70,45,80,60,90,50,75,40,85,55,65,95,45,70,55,80,40,60,75,50,85,45,70,55,65,40]
          return (
            <motion.div
              key={i}
              animate={playing
                ? { scaleY: [1, 0.2, 0.8, 0.3, 1] }
                : { scaleY: 0.3 }}
              transition={playing
                ? { repeat: Infinity, duration: 1.5, delay: i * 0.04, ease: "easeInOut" }
                : { duration: 0.3 }}
              className="w-1.5 rounded-full origin-bottom"
              style={{
                height: `${heights[i] * 0.5}px`,
                background: `linear-gradient(to top, #FF2D78, #00E5FF)`,
                opacity: playing ? 0.85 : 0.25,
              }}
            />
          )
        })}
      </div>

      {/* Progress bar (only visible while playing) */}
      {playing && (
        <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#FF2D78,#00E5FF)",
              boxShadow: "0 0 8px rgba(255,45,120,0.6)",
            }}
          />
        </div>
      )}

      {/* Play button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={!playing ? { scale: 1.05 } : {}}
          whileTap={!playing ? { scale: 0.95 } : {}}
          onClick={playClip}
          disabled={playing || !audioUrl}
          className="flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm tracking-widest uppercase"
          style={{
            background: playing
              ? "rgba(255,45,120,0.12)"
              : "linear-gradient(135deg,#FF2D78,#8B5CF6)",
            border: playing
              ? "1.5px solid rgba(255,45,120,0.3)"
              : "none",
            color: playing ? "rgba(255,255,255,0.4)" : "#fff",
            fontFamily: "'Orbitron',sans-serif",
            cursor: playing ? "not-allowed" : "pointer",
            boxShadow: playing ? "none" : "0 0 24px rgba(255,45,120,0.35)",
          }}
        >
          {playing ? (
            <>
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#FF2D78", opacity: 0.5 }} />
              Playing…
            </>
          ) : (
            <>
              <span>▶</span>
              {played ? "Replay 5s" : "Play 5s Clip"}
            </>
          )}
        </motion.button>
      </div>

      {!audioUrl && (
        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          No audio file linked to this puzzle.
        </p>
      )}
    </div>
  )
}
