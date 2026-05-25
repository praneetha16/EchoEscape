import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "../layouts/MainLayout"
import { getPuzzlesByRoom, submitPuzzleAnswer } from "../services/puzzleService"

function PuzzlePage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [puzzles, setPuzzles] = useState([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState({ correct: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPuzzles()
  }, [roomId])

  const fetchPuzzles = async () => {
    try {
      const data = await getPuzzlesByRoom(roomId)
      setPuzzles(data)
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
    setCurrentPuzzleIndex((prev) => prev + 1)
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

  const progressPct = Math.round(((currentPuzzleIndex + 1) / puzzles.length) * 100)

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
                <span className="text-slate-500 tracking-widest uppercase">System Breach</span>
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
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-400 text-xs tracking-widest uppercase font-semibold">
                          Audio Stream Active
                        </span>
                      </div>
                      <audio controls className="w-full rounded-xl">
                        <source src={currentPuzzle.audio_url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* Answer input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ENTER ACCESS CODE..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={result.correct === true}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-lg tracking-widest text-cyan-300 outline-none focus:border-cyan-500/60 focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all placeholder:text-slate-700 disabled:opacity-50"
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
