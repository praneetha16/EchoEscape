import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SECONDS_PER_Q = 10
const SECONDS_PER_AUDIO  = 25

function AudioClipButton({ audioUrl }) {
  const audioRef  = useRef(null)
  const timerRef  = useRef(null)
  const [playing, setPlaying]  = useState(false)
  const [played,  setPlayed]   = useState(false)
  const CLIP_SEC  = 8

  // auto-play once when this question mounts
  useEffect(() => {
    const t = setTimeout(() => playClip(), 400)
    return () => {
      clearTimeout(t)
      clearInterval(timerRef.current)
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    }
  }, [audioUrl])

  const playClip = () => {
    if (playing || !audioUrl) return
    const audio = audioRef.current
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => {})
    setPlaying(true)
    setPlayed(true)
    const start = Date.now()
    timerRef.current = setInterval(() => {
      if ((Date.now() - start) / 1000 >= CLIP_SEC) {
        clearInterval(timerRef.current)
        audio.pause()
        audio.currentTime = 0
        setPlaying(false)
      }
    }, 50)
  }

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
        🎧 Name this song:
      </span>
      <motion.button
        whileHover={!playing ? { scale: 1.05 } : {}}
        whileTap={!playing ? { scale: 0.95 } : {}}
        onClick={playClip}
        disabled={playing}
        className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest"
        style={{
          background: playing ? "rgba(255,45,120,0.12)" : "linear-gradient(135deg,#FF2D78,#8B5CF6)",
          border: playing ? "1.5px solid rgba(255,45,120,0.3)" : "none",
          color: playing ? "rgba(255,255,255,0.4)" : "#fff",
          fontFamily: "'Orbitron',sans-serif",
          cursor: playing ? "not-allowed" : "pointer",
        }}>
        {playing ? "▶ Playing…" : played ? "↺ Replay" : "▶ Play Clip"}
      </motion.button>
    </div>
  )
}

export default function RapidFireRound({ puzzle, onDirectComplete }) {
  const questions = puzzle.options_json?.questions || []
  const [current, setCurrent]     = useState(0)
  const [answer, setAnswer]       = useState("")
  const [results, setResults]     = useState([]) // true/false per question
  const [timeLeft, setTimeLeft]   = useState(SECONDS_PER_Q)
  const [phase, setPhase]         = useState("playing") // playing | summary
  const [showFeedback, setShowFeedback] = useState(null) // "correct" | "wrong" | null
  const intervalRef               = useRef(null)
  const skipFiredRef              = useRef(false)

  const getSecondsForQ = (idx) =>
    questions[idx]?.type === "audio" ? SECONDS_PER_AUDIO : SECONDS_PER_Q

  useEffect(() => {
    if (phase !== "playing") return
    skipFiredRef.current = false          // reset guard for each new question
    const secs = getSecondsForQ(current)
    setTimeLeft(secs)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          if (!skipFiredRef.current) {
            skipFiredRef.current = true   // prevent double-fire
            handleSkip()
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [current, phase])

  const handleSkip = () => {
    skipFiredRef.current = true
    clearInterval(intervalRef.current)
    const newResults = [...results, false]
    setResults(newResults)
    setShowFeedback("wrong")
    setTimeout(() => {
      setShowFeedback(null)
      setAnswer("")
      if (current + 1 >= questions.length) {
        setPhase("summary")
      } else {
        setCurrent(c => c + 1)
      }
    }, 700)
  }

  const isAnswerCorrect = (expected, given) => {
    const normalize = s => s.toLowerCase().trim()
    const exp = normalize(expected)
    const giv = normalize(given)
    if (exp === giv) return true
    // accept if all significant words of the answer are present
    const words = exp.split(/\s+/).filter(w => w.length > 2)
    return words.length > 0 && words.every(w => giv.includes(w))
  }

  const handleSubmit = () => {
    skipFiredRef.current = true
    clearInterval(intervalRef.current)
    const q = questions[current]
    const correct = isAnswerCorrect(q.a, answer)
    const newResults = [...results, correct]
    setResults(newResults)
    setShowFeedback(correct ? "correct" : "wrong")
    setTimeout(() => {
      setShowFeedback(null)
      setAnswer("")
      if (current + 1 >= questions.length) {
        setPhase("summary")
      } else {
        setCurrent(c => c + 1)
      }
    }, 800)
  }

  const correctCount = results.filter(Boolean).length

  if (phase === "summary") {
    const passed = correctCount >= 3
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center"
        style={{
          background: passed
            ? "rgba(52,211,153,0.08)"
            : "rgba(248,113,113,0.08)",
          border: `1.5px solid ${passed ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)"}`,
        }}
      >
        <div className="text-6xl mb-4">{passed ? "🎉" : "😬"}</div>
        <h3 className="text-2xl font-black mb-2"
          style={{ color: passed ? "#34D399" : "#F87171", fontFamily: "Orbitron,Arial,sans-serif" }}>
          {passed ? "BLAZING ROUND!" : "NOT QUITE!"}
        </h3>
        <p className="text-4xl font-black mb-2" style={{ color: passed ? "#34D399" : "#F87171" }}>
          {correctCount}/{questions.length}
        </p>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          {passed ? "You passed the rapid-fire round!" : "You need 3+ correct to proceed."}
        </p>

        {/* Score breakdown */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {results.map((r, i) => (
            <div key={i}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                background: r ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)",
                border: `1px solid ${r ? "rgba(52,211,153,0.5)" : "rgba(248,113,113,0.5)"}`,
              }}>
              {r ? "✓" : "✗"}
            </div>
          ))}
        </div>

        {passed ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onDirectComplete}
            className="px-8 py-3 rounded-xl font-black text-black"
            style={{ background: "linear-gradient(135deg,#34D399,#00E5FF)", fontFamily: "Orbitron,Arial,sans-serif" }}>
            CONTINUE →
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setCurrent(0); setResults([]); setAnswer(""); setPhase("playing") }}
            className="px-8 py-3 rounded-xl font-black text-white"
            style={{ background: "linear-gradient(135deg,#F87171,#F59E0B)", fontFamily: "Orbitron,Arial,sans-serif" }}>
            TRY AGAIN →
          </motion.button>
        )}
      </motion.div>
    )
  }

  const q = questions[current]
  const urgentTime = timeLeft <= 3
  const timerColor = urgentTime ? "#F87171" : timeLeft <= 6 ? "#F59E0B" : "#34D399"

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid rgba(255,165,0,0.35)", background: "rgba(255,165,0,0.04)" }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,165,0,0.15)" }}>
        <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#FFA500" }}>
          ⚡ Rapid Fire Round
        </p>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{
                  background: i < results.length
                    ? results[i] ? "#34D399" : "#F87171"
                    : i === current ? "#FFA500" : "rgba(255,255,255,0.15)",
                }} />
            ))}
          </div>
          <span className="font-black text-sm" style={{ color: timerColor, fontFamily: "Orbitron,Arial,sans-serif" }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
            style={{ background: "rgba(255,165,0,0.2)", border: "1px solid rgba(255,165,0,0.4)", color: "#FFA500" }}>
            {current + 1}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1">
              {q?.type === "audio"
                ? <AudioClipButton audioUrl={q.audio_url} />
                : <p className="text-base font-semibold text-white"
                    style={{ fontFamily: "'Space Grotesk', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}>
                    {q?.q}
                  </p>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timer bar */}
        <div className="h-1 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${(timeLeft / getSecondsForQ(current)) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ background: timerColor, boxShadow: `0 0 8px ${timerColor}` }}
          />
        </div>

        {/* Answer input */}
        <div className={`flex gap-3 transition-all ${showFeedback === "correct" ? "opacity-50" : ""}`}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => e.key === "Enter" && answer.trim() && handleSubmit()}
            placeholder="Quick! Type your answer..."
            disabled={showFeedback !== null}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white outline-none"
            style={{
              background: showFeedback === "correct"
                ? "rgba(52,211,153,0.15)"
                : showFeedback === "wrong"
                ? "rgba(248,113,113,0.15)"
                : "rgba(255,165,0,0.08)",
              border: `1.5px solid ${
                showFeedback === "correct" ? "rgba(52,211,153,0.5)"
                : showFeedback === "wrong" ? "rgba(248,113,113,0.5)"
                : "rgba(255,165,0,0.35)"
              }`,
              caretColor: "#FFA500",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => answer.trim() && handleSubmit()}
            disabled={!answer.trim() || showFeedback !== null}
            className="px-5 py-3 rounded-xl font-black text-sm text-black disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#FFA500,#FF6B35)", fontFamily: "Orbitron,Arial,sans-serif" }}>
            →
          </motion.button>
        </div>

        {/* Inline feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm font-semibold text-center"
              style={{ color: showFeedback === "correct" ? "#34D399" : "#F87171" }}>
              {showFeedback === "correct" ? "✓ Correct!" : `✗ Answer: ${q?.a}`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
