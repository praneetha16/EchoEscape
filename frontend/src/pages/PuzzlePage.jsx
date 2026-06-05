import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import { getPuzzlesByRoom, submitPuzzleAnswer } from "../services/puzzleService"
import { markPuzzleComplete, getCompletedPuzzlesForRoom, resetRoomProgress } from "../services/progressService"
import { getRoom } from "../services/roomService"
import { useAuth } from "../context/AuthContext"
import PuzzleRenderer, { COMPLEX_TYPES } from "../components/puzzles/PuzzleRenderer"
import CelebrationAnimation from "../components/CelebrationAnimation"

// Per-room neon themes — all within the cyan/purple/pink palette
const ROOM_META = [
  { accent: "#00E5FF", from: "#00E5FF", to: "#8B5CF6" }, // Bollywood — cyan→purple
  { accent: "#A78BFA", from: "#8B5CF6", to: "#FF2D78" }, // Sandalwood — purple→pink
  { accent: "#FF2D78", from: "#FF2D78", to: "#00E5FF" }, // K-Pop — pink→cyan
]

// Puzzle type labels for the sidebar
const TYPE_LABELS = {
  emoji_song:       "🎭 Emoji Song",
  finish_lyrics:    "🎤 Finish Lyrics",
  lost_translation: "🌍 Lost in Translation",
  picture_tune:     "🖼️ Picture Tune",
  rapid_fire:       "⚡ Rapid Fire",
  beat_match:       "🎯 Beat Match",
  missing_word:     "📝 Missing Word",
  five_second_clip: "🎧 5-Second Clip",
}

const TIMER_SECONDS = { easy: 60, medium: 45, hard: 35 }

function useTimer(seconds, active) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const intervalRef = useRef(null)

  useEffect(() => { setTimeLeft(seconds) }, [seconds])

  useEffect(() => {
    if (!active || timeLeft <= 0) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(intervalRef.current)
  }, [active, timeLeft])

  const reset = (s) => { clearInterval(intervalRef.current); setTimeLeft(s ?? seconds) }
  return { timeLeft, reset }
}

function TimerDisplay({ timeLeft, totalSeconds }) {
  const pct    = (timeLeft / totalSeconds) * 100
  const mins   = Math.floor(timeLeft / 60)
  const secs   = (timeLeft % 60).toString().padStart(2, "0")
  const urgent = timeLeft <= 10
  const warn   = timeLeft <= 20 && timeLeft > 10

  const color = urgent ? "#F87171" : warn ? "#F59E0B" : "#34D399"
  const glow  = urgent ? "0 0 16px rgba(248,113,113,0.6)"
    : warn ? "0 0 16px rgba(245,158,11,0.4)"
    : "0 0 12px rgba(52,211,153,0.4)"

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke={color} strokeWidth="2.5"
            strokeDasharray={`${pct} 100`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s", filter: `drop-shadow(${glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            animate={urgent && timeLeft > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-[10px] font-black"
            style={{ color, fontFamily: "'Orbitron',Arial,sans-serif" }}>
            {timeLeft > 0 ? `${mins}:${secs}` : "0:00"}
          </motion.span>
        </div>
      </div>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ background: color, boxShadow: glow }}
        />
      </div>
    </div>
  )
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    playing ? a.pause() : a.play()
    setPlaying(!playing)
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`
  }

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgba(0,229,255,0.08),rgba(139,92,246,0.10))",
        border: "1.5px solid rgba(0,229,255,0.40)",
        boxShadow: "0 0 28px rgba(0,229,255,0.12), inset 0 0 30px rgba(0,229,255,0.04)",
      }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(0,229,255,0.12)" }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00E5FF", boxShadow: "0 0 6px #00E5FF" }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#00E5FF" }}>Audio Stream</span>
        </div>
        <div className="flex items-end gap-[3px] h-5">
          {[60, 100, 45, 80, 55].map((h, i) => (
            <motion.div key={i}
              animate={{ scaleY: playing ? [1, 0.2, 1] : 0.2 }}
              transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.12, ease: "easeInOut" }}
              className="w-1 rounded-full origin-bottom"
              style={{ height: `${h * 0.18}px`, background: "linear-gradient(to top,#00E5FF,#8B5CF6)" }}
            />
          ))}
        </div>
      </div>
      <div className="px-5 py-4 flex items-center gap-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#00E5FF,#8B5CF6)", boxShadow: "0 0 16px rgba(0,229,255,0.4)" }}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><polygon points="5,3 19,12 5,21"/></svg>
          }
        </motion.button>
        <span className="text-xs font-mono shrink-0" style={{ color: "rgba(0,229,255,0.8)", minWidth: "36px" }}>{fmt(current)}</span>
        <div className="flex-1 h-2 rounded-full cursor-pointer relative" style={{ background: "rgba(255,255,255,0.08)" }} onClick={seek}>
          <div className="h-full rounded-full transition-all"
            style={{ width: duration ? `${(current / duration) * 100}%` : "0%", background: "linear-gradient(90deg,#00E5FF,#8B5CF6)", boxShadow: "0 0 8px rgba(0,229,255,0.6)" }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#00E5FF] bg-[#0d0d1a]"
            style={{ left: duration ? `calc(${(current / duration) * 100}% - 6px)` : "-6px", boxShadow: "0 0 6px rgba(0,229,255,0.8)" }} />
        </div>
        <span className="text-xs font-mono shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "36px", textAlign: "right" }}>{fmt(duration)}</span>
        <button onClick={() => { const v = volume === 0 ? 1 : 0; setVolume(v); if (audioRef.current) audioRef.current.volume = v }}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          {volume === 0
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          }
        </button>
      </div>
      <audio ref={audioRef} src={src}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  )
}

export default function PuzzlePage() {
  const { roomId } = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()

  const [puzzles,            setPuzzles]            = useState([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [answer,             setAnswer]             = useState("")
  const [showHint,           setShowHint]           = useState(false)
  const [result,             setResult]             = useState({ correct: null })
  const [loading,            setLoading]            = useState(true)
  const [roomDifficulty,     setRoomDifficulty]     = useState("medium")
  const [timedOut,           setTimedOut]           = useState(false)
  const [celebrate,          setCelebrate]          = useState(false)
  const [roomMeta,           setRoomMeta]           = useState(ROOM_META[0])

  const totalSeconds = TIMER_SECONDS[roomDifficulty?.toLowerCase()] ?? 45
  const timerActive  = result.correct === null && !timedOut
  const { timeLeft, reset: resetTimer } = useTimer(totalSeconds, timerActive)

  useEffect(() => {
    if (timeLeft === 0 && timerActive) setTimedOut(true)
  }, [timeLeft, timerActive])

  useEffect(() => { fetchData() }, [roomId])

  const fetchData = async () => {
    try {
      const [puzzleData, completedIds, roomData] = await Promise.all([
        getPuzzlesByRoom(roomId),
        getCompletedPuzzlesForRoom(roomId).catch(() => []),
        getRoom(roomId).catch(() => null),
      ])
      setPuzzles(puzzleData)
      if (roomData?.difficulty) setRoomDifficulty(roomData.difficulty)

      // Use room index (0-based) for theme. Rooms are seeded with ids 1, 2, 3.
      const idx = roomData ? (roomData.id - 1) % ROOM_META.length : 0
      setRoomMeta(ROOM_META[idx])

      const sorted    = [...puzzleData].sort((a, b) => a.puzzle_order - b.puzzle_order)
      const firstUnco = sorted.findIndex(p => !completedIds.includes(p.id))
      const startIdx  = firstUnco === -1 ? sorted.length - 1 : firstUnco
      setCurrentPuzzleIndex(startIdx)
      if (completedIds.includes(sorted[startIdx]?.id)) setResult({ correct: true })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const isComplex     = COMPLEX_TYPES.has(currentPuzzle?.type)

  // Score = time remaining * 10 points
  const computeScore = () => Math.max(0, timeLeft * 10)

  const handleSubmit = async () => {
    if (!answer.trim() || timedOut || isComplex) return
    try {
      const response = await submitPuzzleAnswer(currentPuzzle.id, answer)
      setResult(response)
      if (response.correct) {
        markPuzzleComplete(currentPuzzle.id, computeScore(), totalSeconds - timeLeft).catch(() => {})
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePlayAgain = async () => {
    try { await resetRoomProgress(roomId) } catch {}
    setAnswer("")
    setShowHint(false)
    setResult({ correct: null })
    setTimedOut(false)
    setCelebrate(false)
    setCurrentPuzzleIndex(0)
    resetTimer(totalSeconds)
  }

  // Called by complex puzzle components (BeatMatch, RapidFire, MissingWord)
  const handleDirectComplete = async () => {
    try {
      await markPuzzleComplete(currentPuzzle.id, 150, null)
    } catch {}
    setResult({ correct: true })
  }

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit() }

  const nextPuzzle = () => {
    const isLast = currentPuzzleIndex >= puzzles.length - 1
    if (isLast) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 3000)
    }
    setAnswer("")
    setShowHint(false)
    setResult({ correct: null })
    setTimedOut(false)
    resetTimer(totalSeconds)
    setCurrentPuzzleIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
            className="text-cyan-400 text-3xl font-black tracking-widest">
            LOADING...
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  if (!currentPuzzle) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <p className="text-6xl mb-6">🎵</p>
            <h1 style={{ fontFamily: "Orbitron, Arial, sans-serif" }} className="text-cyan-400 text-4xl font-black mb-4">
              NO PUZZLES FOUND
            </h1>
            <p className="text-slate-400 mb-8">This room has no puzzles yet.</p>
            <button onClick={() => navigate("/rooms")}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              ← Back to Rooms
            </button>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  const progressPct = Math.round(
    ((currentPuzzleIndex + (result.correct === true ? 1 : 0)) / puzzles.length) * 100
  )
  const typeLabel = TYPE_LABELS[currentPuzzle.type] || currentPuzzle.type

  return (
    <MainLayout>
      <div className="min-h-screen text-white overflow-hidden relative">

        {/* Celebration */}
        <CelebrationAnimation show={celebrate} message="ARENA ESCAPED! 🎵" />

        {/* Room-themed animated background */}
        <div className="absolute inset-0"
          style={{ background: "#05050F" }} />
        {/* Animated neon blobs */}
        <motion.div
          className="absolute pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          style={{
            top: "-5%", left: "-5%", width: "50vw", height: "50vh",
            background: `radial-gradient(circle, ${roomMeta.from}18, transparent 65%)`,
            filter: "blur(40px)",
          }}
        />
        <motion.div
          className="absolute pointer-events-none"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 3 }}
          style={{
            bottom: "0%", right: "-5%", width: "45vw", height: "45vh",
            background: `radial-gradient(circle, ${roomMeta.to}18, transparent 65%)`,
            filter: "blur(50px)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }} />

        <div className="relative z-10 flex min-h-screen">

          {/* ── SIDEBAR ── */}
          <aside className="w-[280px] border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl p-6 hidden lg:flex flex-col shrink-0">
            <div className="mb-8">
              <button onClick={() => navigate("/rooms")}
                className="text-slate-500 hover:text-slate-300 text-xs tracking-widest uppercase font-medium mb-4 flex items-center gap-1 transition-colors">
                ← Arenas
              </button>
              <h1 className="text-xl font-black tracking-widest"
                style={{ fontFamily: "Orbitron, Arial, sans-serif", background: `linear-gradient(90deg, ${roomMeta.from}, ${roomMeta.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                MAESTRO
              </h1>
              <p className="text-slate-600 text-xs mt-1 tracking-widest uppercase">Music Vault System</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500 tracking-widest uppercase">Progress</span>
                <span className="font-bold" style={{ color: roomMeta.accent }}>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${roomMeta.from}, ${roomMeta.to})` }}
                />
              </div>
            </div>

            {/* Puzzle list */}
            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {puzzles.map((puzzle, index) => {
                const isDone    = index < currentPuzzleIndex || (index === currentPuzzleIndex && result.correct === true)
                const isCurrent = index === currentPuzzleIndex && result.correct !== true
                return (
                  <div key={puzzle.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent ? "bg-white/[0.07] border-white/20"
                      : isDone ? "bg-white/[0.02] border-white/[0.06]"
                      : "bg-white/[0.015] border-white/[0.04]"
                    }`}
                    style={isCurrent ? { borderColor: `${roomMeta.accent}50`, background: `${roomMeta.from}10` } : {}}>
                    <div className="flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-600 mb-0.5 truncate">
                          {TYPE_LABELS[puzzle.type] || puzzle.type}
                        </p>
                        <p className={`text-xs font-semibold truncate ${
                          isCurrent ? "text-white" : isDone ? "text-slate-500" : "text-slate-700"
                        }`}>
                          {puzzle.title}
                        </p>
                      </div>
                      <span className="text-sm shrink-0">
                        {isDone ? "✓" : isCurrent ? "▶" : "🔒"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Visualizer */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-slate-600 text-xs tracking-widest uppercase mb-4">Audio Signal</p>
              <div className="flex items-end gap-1.5 h-12">
                {[40, 80, 55, 100, 70, 30, 90, 60].map((height, i) => (
                  <motion.div key={i}
                    animate={{ height: [`${height * 0.42}px`, `${height * 0.12}px`, `${height * 0.42}px`] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1, ease: "easeInOut" }}
                    className="w-full rounded-full"
                    style={{ minHeight: "3px", background: `linear-gradient(to top, ${roomMeta.from}, ${roomMeta.to})` }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN AREA ── */}
          <main className="flex-1 flex items-start justify-center p-5 lg:p-10 overflow-y-auto">
            <motion.div
              key={currentPuzzleIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl"
            >
              {/* Mobile back */}
              <button onClick={() => navigate("/rooms")}
                className="lg:hidden text-slate-500 hover:text-slate-300 text-xs tracking-widest uppercase font-medium mb-6 flex items-center gap-1 transition-colors">
                ← Arenas
              </button>

              {/* Puzzle card */}
              <div className="rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">

                {/* Top bar */}
                <div className="border-b border-white/[0.06] px-7 pt-6 pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Puzzle type badge */}
                      <span className="text-[10px] tracking-[4px] uppercase font-bold px-3 py-1 rounded-full mb-3 inline-block"
                        style={{
                          background: `${roomMeta.from}18`,
                          border: `1px solid ${roomMeta.from}40`,
                          color: roomMeta.accent,
                        }}>
                        {typeLabel}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight"
                        style={{ fontFamily: "Orbitron, Arial, sans-serif" }}>
                        {currentPuzzle.title}
                      </h2>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-slate-600 text-xs tracking-widest uppercase mb-1">Puzzle</p>
                      <p className="text-2xl font-black"
                        style={{ fontFamily: "Orbitron, Arial, sans-serif", color: roomMeta.accent }}>
                        {currentPuzzleIndex + 1}
                        <span className="text-slate-600 text-lg">/{puzzles.length}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 space-y-5">

                  {/* Question text */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {currentPuzzle.question}
                    </p>
                  </div>

                  {/* Puzzle-type renderer */}
                  <PuzzleRenderer
                    puzzle={currentPuzzle}
                    onDirectComplete={handleDirectComplete}
                    timerActive={timerActive}
                  />

                  {/* Audio player — shown for audio-based types, but NOT for five_second_clip (has its own player) */}
                  {currentPuzzle.audio_url && currentPuzzle.type !== "five_second_clip" && (
                    <AudioPlayer src={currentPuzzle.audio_url} />
                  )}

                  {/* Timer — always visible above the answer area */}
                  <div className="px-1">
                    <TimerDisplay timeLeft={timeLeft} totalSeconds={totalSeconds} />
                  </div>

                  {/* Standard answer input — hidden for complex types */}
                  {!isComplex && (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="🎵 Type your answer here..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={result.correct === true || timedOut}
                          className="w-full rounded-2xl px-6 py-5 text-lg tracking-widest text-white outline-none transition-all disabled:opacity-50"
                          style={{
                            background: "linear-gradient(135deg,rgba(0,229,255,0.10),rgba(139,92,246,0.08))",
                            border: "1.5px solid rgba(0,229,255,0.55)",
                            caretColor: "#00E5FF",
                            boxShadow: "0 0 24px rgba(0,229,255,0.15), inset 0 0 24px rgba(0,229,255,0.06)",
                          }}
                          onFocus={e => { e.target.style.borderColor = "#00E5FF"; e.target.style.boxShadow = "0 0 40px rgba(0,229,255,0.35), inset 0 0 28px rgba(0,229,255,0.10)" }}
                          onBlur={e => { e.target.style.borderColor = "rgba(0,229,255,0.55)"; e.target.style.boxShadow = "0 0 24px rgba(0,229,255,0.15), inset 0 0 24px rgba(0,229,255,0.06)" }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={!answer.trim() || result.correct === true}
                          className="flex-1 py-4 rounded-2xl font-black text-white tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                          style={{
                            background: `linear-gradient(135deg, ${roomMeta.from}, ${roomMeta.to})`,
                            boxShadow: `0 0 24px ${roomMeta.from}50`,
                            fontFamily: "Orbitron, Arial, sans-serif",
                          }}>
                          DECRYPT ANSWER
                        </motion.button>

                        {currentPuzzle.hint && (
                          <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setShowHint(!showHint)}
                            className="px-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 font-bold hover:bg-yellow-500/20 transition-all text-sm">
                            {showHint ? "HIDE" : "HINT"}
                          </motion.button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Hint for complex types too */}
                  {isComplex && currentPuzzle.hint && (
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setShowHint(!showHint)}
                        className="px-5 py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 font-bold hover:bg-yellow-500/20 transition-all text-xs">
                        {showHint ? "HIDE HINT" : "HINT"}
                      </motion.button>
                    </div>
                  )}

                  {/* Hint panel */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.08] p-5">
                          <p className="text-xs text-yellow-500 tracking-widest uppercase font-semibold mb-2">Hint</p>
                          <p className="text-yellow-100 text-sm leading-relaxed">{currentPuzzle.hint}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Time's Up */}
                  <AnimatePresence>
                    {timedOut && result.correct === null && (
                      <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="rounded-2xl p-7"
                          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.35)" }}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">⏱️</span>
                            <h3 className="text-2xl font-black" style={{ fontFamily: "Orbitron,Arial,sans-serif", color: "#F87171" }}>
                              TIME'S UP!
                            </h3>
                          </div>
                          <p className="text-sm mb-5" style={{ color: "rgba(248,113,113,0.65)" }}>
                            You ran out of time. Give it another shot!
                          </p>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setTimedOut(false); setAnswer(""); resetTimer(totalSeconds) }}
                            className="px-7 py-3 rounded-xl font-black text-white"
                            style={{ background: "linear-gradient(135deg,#F87171,#F59E0B)", fontFamily: "Orbitron,Arial,sans-serif", boxShadow: "0 0 20px rgba(248,113,113,0.3)" }}>
                            TRY AGAIN →
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Result */}
                  <AnimatePresence>
                    {result.correct !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.3 }}>
                        {result.correct ? (
                          <div className="border border-emerald-500/30 bg-emerald-500/[0.08] rounded-2xl p-7">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl">✅</span>
                              <h3 style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                                className="text-2xl font-black text-emerald-400">
                                ACCESS GRANTED
                              </h3>
                            </div>
                            <p className="text-emerald-300/70 text-sm mb-6">
                              {computeScore() > 0 ? `+${computeScore()} pts` : "Puzzle complete!"} You're one step closer to escaping.
                            </p>
                            {currentPuzzleIndex < puzzles.length - 1 ? (
                              <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={nextPuzzle}
                                className="px-8 py-3.5 rounded-xl font-black text-white tracking-wide shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${roomMeta.from}, ${roomMeta.to})`, fontFamily: "Orbitron, Arial, sans-serif", boxShadow: `0 0 20px ${roomMeta.from}40` }}>
                                NEXT PUZZLE →
                              </motion.button>
                            ) : (
                              <div>
                                <p style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                                  className="text-cyan-300 text-2xl font-black mb-6">
                                  ARENA ESCAPED 🎵
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={handlePlayAgain}
                                    className="px-6 py-3 rounded-xl font-black text-white"
                                    style={{ background: `linear-gradient(135deg, ${roomMeta.from}, ${roomMeta.to})`, fontFamily: "Orbitron, Arial, sans-serif", boxShadow: `0 0 20px ${roomMeta.from}40` }}>
                                    🔄 Play Again
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/rooms")}
                                    className="px-6 py-3 rounded-xl font-bold text-white transition-colors"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                                    ← Arenas
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/leaderboard")}
                                    className="px-6 py-3 rounded-xl font-bold text-black"
                                    style={{ background: "linear-gradient(135deg,#FFD700,#FF6B35)" }}>
                                    🏆 Leaderboard
                                  </motion.button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-2xl p-7"
                            style={{
                              background: "linear-gradient(135deg,rgba(245,158,11,0.07),rgba(139,92,246,0.08))",
                              border: "1px solid rgba(245,158,11,0.35)",
                              boxShadow: "0 0 24px rgba(245,158,11,0.08)",
                            }}>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">🎵</span>
                              <h3 style={{ fontFamily: "Orbitron, Arial, sans-serif", color: "#F59E0B" }}
                                className="text-2xl font-black">
                                WRONG NOTE!
                              </h3>
                            </div>
                            <p className="text-sm" style={{ color: "rgba(245,158,11,0.65)" }}>
                              That's not quite right. Listen closely and try again!
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* Mobile progress */}
              <div className="lg:hidden mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 tracking-widest uppercase">Progress</span>
                  <span className="font-bold" style={{ color: roomMeta.accent }}>{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${roomMeta.from}, ${roomMeta.to})`,
                    }} />
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </MainLayout>
  )
}
