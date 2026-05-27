import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import { getPuzzlesByRoom, submitPuzzleAnswer } from "../services/puzzleService"
import { markPuzzleComplete, getCompletedPuzzlesForRoom } from "../services/progressService"
import { useAuth } from "../context/AuthContext"

/* ── Custom Audio Player ─────────────────────────── */
function AudioPlayer({ src }) {
  const audioRef             = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume,   setVolume]   = useState(1)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    playing ? a.pause() : a.play()
    setPlaying(!playing)
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * duration
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgba(0,229,255,0.08),rgba(139,92,246,0.10))",
        border: "1.5px solid rgba(0,229,255,0.40)",
        boxShadow: "0 0 28px rgba(0,229,255,0.12), inset 0 0 30px rgba(0,229,255,0.04)",
      }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom:"1px solid rgba(0,229,255,0.12)" }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse"
            style={{ background:"#00E5FF", boxShadow:"0 0 6px #00E5FF" }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color:"#00E5FF" }}>
            Audio Stream Active
          </span>
        </div>
        <div className="flex items-end gap-[3px] h-5">
          {[60,100,45,80,55].map((h, i) => (
            <motion.div key={i}
              animate={{ scaleY: playing ? [1,0.2,1] : 0.2 }}
              transition={{ repeat: Infinity, duration:1.1, delay:i*0.12, ease:"easeInOut" }}
              className="w-1 rounded-full origin-bottom"
              style={{ height:`${h*0.18}px`, background:"linear-gradient(to top,#00E5FF,#8B5CF6)" }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Play/Pause */}
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
            boxShadow: "0 0 16px rgba(0,229,255,0.4)",
          }}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </motion.button>

        {/* Time */}
        <span className="text-xs font-mono shrink-0" style={{ color:"rgba(0,229,255,0.8)", minWidth:"36px" }}>
          {fmt(current)}
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-2 rounded-full cursor-pointer relative"
          style={{ background:"rgba(255,255,255,0.08)" }}
          onClick={seek}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: duration ? `${(current/duration)*100}%` : "0%",
              background: "linear-gradient(90deg,#00E5FF,#8B5CF6)",
              boxShadow: "0 0 8px rgba(0,229,255,0.6)",
            }} />
          {/* Thumb */}
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#00E5FF] bg-[#0d0d1a]"
            style={{
              left: duration ? `calc(${(current/duration)*100}% - 6px)` : "-6px",
              boxShadow:"0 0 6px rgba(0,229,255,0.8)",
            }} />
        </div>

        {/* Duration */}
        <span className="text-xs font-mono shrink-0" style={{ color:"rgba(255,255,255,0.35)", minWidth:"36px", textAlign:"right" }}>
          {fmt(duration)}
        </span>

        {/* Volume */}
        <button onClick={() => { const v = volume === 0 ? 1 : 0; setVolume(v); if(audioRef.current) audioRef.current.volume = v }}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          {volume === 0 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
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

function PuzzlePage() {
  const { roomId } = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()

  const [puzzles,             setPuzzles]             = useState([])
  const [currentPuzzleIndex,  setCurrentPuzzleIndex]  = useState(0)
  const [answer,              setAnswer]              = useState("")
  const [showHint,            setShowHint]            = useState(false)
  const [result,              setResult]              = useState({ correct: null })
  const [loading,             setLoading]             = useState(true)

  useEffect(() => { fetchPuzzles() }, [roomId])

  const fetchPuzzles = async () => {
    try {
      const [puzzleData, completedIds] = await Promise.all([
        getPuzzlesByRoom(roomId),
        getCompletedPuzzlesForRoom(roomId).catch(() => []),
      ])
      setPuzzles(puzzleData)

      // Resume from the first puzzle the user hasn't completed yet
      const firstUncompleted = puzzleData.findIndex(p => !completedIds.includes(p.id))
      setCurrentPuzzleIndex(firstUncompleted === -1 ? puzzleData.length - 1 : firstUncompleted)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const currentPuzzle = puzzles[currentPuzzleIndex]

  const handleSubmit = async () => {
    if (!answer.trim()) return
    try {
      const response = await submitPuzzleAnswer(currentPuzzle.id, answer)
      setResult(response)
      if (response.correct) {
        // One row per puzzle — room completion is derived from these on the backend
        markPuzzleComplete(currentPuzzle.id).catch(() => {})
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  const nextPuzzle = () => {
    setAnswer("")
    setShowHint(false)
    setResult({ correct: null })
    setCurrentPuzzleIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
              className="text-cyan-400 text-3xl font-black tracking-widest"
            >
              LOADING...
            </motion.div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!currentPuzzle) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-6xl mb-6">🎵</p>
            <h1
              style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
              className="text-cyan-400 text-4xl font-black mb-4"
            >
              NO PUZZLES FOUND
            </h1>
            <p className="text-slate-400 mb-8">This room has no puzzles yet.</p>
            <button
              onClick={() => navigate("/rooms")}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
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

  return (
    <MainLayout>
      <div className="min-h-screen text-white overflow-hidden relative">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 flex min-h-screen">

          {/* ── SIDEBAR ──────────────────────────────── */}
          <aside className="w-[300px] border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl p-6 hidden lg:flex flex-col shrink-0">

            {/* Brand */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/rooms")}
                className="text-slate-500 hover:text-slate-300 text-xs tracking-widest uppercase font-medium mb-4 flex items-center gap-1 transition-colors"
              >
                ← Rooms
              </button>
              <h1
                style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                className="text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                ECHO ESCAPE
              </h1>
              <p className="text-slate-600 text-xs mt-1 tracking-widest uppercase">
                Music Vault System
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs mb-2.5">
                <span className="text-slate-500 tracking-widest uppercase">Progress</span>
                <span className="text-cyan-400 font-bold">{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Puzzle list */}
            <div className="space-y-2 flex-1">
              {puzzles.map((puzzle, index) => (
                <div
                  key={puzzle.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    index === currentPuzzleIndex
                      ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.15)]"
                      : index < currentPuzzleIndex
                      ? "bg-white/[0.03] border-white/[0.06]"
                      : "bg-white/[0.02] border-white/[0.04]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Puzzle {index + 1}</p>
                      <p
                        className={`text-sm font-semibold truncate max-w-[180px] ${
                          index === currentPuzzleIndex
                            ? "text-white"
                            : index < currentPuzzleIndex
                            ? "text-slate-500"
                            : "text-slate-600"
                        }`}
                      >
                        {puzzle.title}
                      </p>
                    </div>
                    <span className="text-base">
                      {index < currentPuzzleIndex ? "✓" : index === currentPuzzleIndex ? "▶" : "🔒"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audio visualizer */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-slate-600 text-xs tracking-widest uppercase mb-4">Audio Signal</p>
              <div className="flex items-end gap-1.5 h-16">
                {[40, 80, 55, 100, 70, 30, 90, 60].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${height}%`, `${height * 0.3}%`, `${height}%`] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1, ease: "easeInOut" }}
                    className="w-full rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
                    style={{ minHeight: "3px" }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN AREA ─────────────────────────────── */}
          <main className="flex-1 flex items-start justify-center p-6 lg:p-10 overflow-y-auto">
            <motion.div
              key={currentPuzzleIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl"
            >
              {/* Mobile back button */}
              <button
                onClick={() => navigate("/rooms")}
                className="lg:hidden text-slate-500 hover:text-slate-300 text-xs tracking-widest uppercase font-medium mb-6 flex items-center gap-1 transition-colors"
              >
                ← Rooms
              </button>

              {/* Card */}
              <div className="rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">

                {/* Top bar */}
                <div className="border-b border-white/[0.06] px-8 py-6 flex justify-between items-start">
                  <div>
                    <p className="text-xs tracking-[4px] text-cyan-400 uppercase mb-2">
                      Puzzle Mission
                    </p>
                    <h2
                      style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                      className="text-2xl md:text-3xl font-black text-white"
                    >
                      {currentPuzzle.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-slate-600 text-xs tracking-widest uppercase mb-1">Puzzle</p>
                    <p
                      style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                      className="text-2xl font-black text-pink-400"
                    >
                      {currentPuzzleIndex + 1}
                      <span className="text-slate-600 text-lg">/{puzzles.length}</span>
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">

                  {/* Question */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <p className="text-slate-300 leading-relaxed text-base">
                      {currentPuzzle.question}
                    </p>
                  </div>

                  {/* Audio player */}
                  {currentPuzzle.audio_url && (
                    <AudioPlayer src={currentPuzzle.audio_url} />
                  )}

                  {/* Answer input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🎵 Type your answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={result.correct === true}
                      className="w-full rounded-2xl px-6 py-5 text-lg tracking-widest text-white outline-none transition-all disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg,rgba(0,229,255,0.10),rgba(139,92,246,0.08))",
                        border: "1.5px solid rgba(0,229,255,0.55)",
                        caretColor: "#00E5FF",
                        boxShadow: "0 0 24px rgba(0,229,255,0.15), inset 0 0 24px rgba(0,229,255,0.06)",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "#00E5FF"
                        e.target.style.boxShadow = "0 0 40px rgba(0,229,255,0.35), inset 0 0 28px rgba(0,229,255,0.10)"
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "rgba(0,229,255,0.55)"
                        e.target.style.boxShadow = "0 0 24px rgba(0,229,255,0.15), inset 0 0 24px rgba(0,229,255,0.06)"
                      }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!answer.trim() || result.correct === true}
                      className="flex-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 py-4 rounded-2xl font-black text-white tracking-wider shadow-[0_0_24px_rgba(168,85,247,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                    >
                      DECRYPT ANSWER
                    </motion.button>

                    {currentPuzzle.hint && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowHint(!showHint)}
                        className="px-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 font-bold hover:bg-yellow-500/20 transition-all text-sm"
                      >
                        {showHint ? "HIDE" : "HINT"}
                      </motion.button>
                    )}
                  </div>

                  {/* Hint */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.08] p-5">
                          <p className="text-xs text-yellow-500 tracking-widest uppercase font-semibold mb-2">
                            Hint
                          </p>
                          <p className="text-yellow-100 text-sm leading-relaxed">
                            {currentPuzzle.hint}
                          </p>
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
                        transition={{ duration: 0.3 }}
                      >
                        {result.correct ? (
                          <div className="border border-emerald-500/30 bg-emerald-500/[0.08] rounded-2xl p-7">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl">✅</span>
                              <h3
                                style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                                className="text-2xl font-black text-emerald-400"
                              >
                                ACCESS GRANTED
                              </h3>
                            </div>
                            <p className="text-emerald-300/70 text-sm mb-6">
                              Correct frequency detected. Sequence unlocked.
                            </p>

                            {currentPuzzleIndex < puzzles.length - 1 ? (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={nextPuzzle}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3.5 rounded-xl font-black text-white tracking-wide shadow-lg shadow-purple-500/20"
                                style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                              >
                                NEXT PUZZLE →
                              </motion.button>
                            ) : (
                              <div>
                                <p
                                  style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                                  className="text-cyan-300 text-2xl font-black mb-4"
                                >
                                  MUSIC VAULT ESCAPED 🎵
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => navigate("/rooms")}
                                  className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                                >
                                  ← Back to Rooms
                                </motion.button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border border-red-500/30 bg-red-500/[0.08] rounded-2xl p-7">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">❌</span>
                              <h3
                                style={{ fontFamily: "Orbitron, Arial, sans-serif" }}
                                className="text-2xl font-black text-red-400"
                              >
                                ACCESS DENIED
                              </h3>
                            </div>
                            <p className="text-red-300/70 text-sm">
                              Incorrect frequency detected. Try again.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* Mobile progress bar */}
              <div className="lg:hidden mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 tracking-widest uppercase">Progress</span>
                  <span className="text-cyan-400 font-bold">{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </MainLayout>
  )
}

export default PuzzlePage
