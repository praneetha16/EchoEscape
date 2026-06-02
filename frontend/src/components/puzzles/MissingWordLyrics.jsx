import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function MissingWordLyrics({ puzzle, onDirectComplete }) {
  const options  = puzzle.options_json || {}
  const blanks   = options.blanks || []
  const lyrics   = options.lyrics || puzzle.question
  const [inputs, setInputs]   = useState(Array(blanks.length).fill(""))
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const inputRefs             = useRef([])

  const handleChange = (i, val) => {
    const next = [...inputs]
    next[i] = val
    setInputs(next)
    setChecked(false)
  }

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      if (i < blanks.length - 1) inputRefs.current[i + 1]?.focus()
      else handleCheck()
    }
  }

  const handleCheck = () => {
    const res = blanks.map((b, i) => b.toLowerCase().trim() === inputs[i].toLowerCase().trim())
    setResults(res)
    setChecked(true)
    if (res.every(Boolean)) {
      setTimeout(() => onDirectComplete(), 1000)
    }
  }

  // Split lyrics into parts around each blank
  const lyricParts = lyrics.split("___")
  const allFilled  = inputs.every(v => v.trim())
  const allCorrect = checked && results.every(Boolean)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid rgba(139,92,246,0.35)", background: "rgba(139,92,246,0.05)" }}>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
        <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#8B5CF6" }}>
          📝 Missing Word Lyrics
        </p>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Fill the blanks
        </span>
      </div>

      <div className="p-6">
        {/* Lyric with inline inputs */}
        <div className="px-5 py-5 rounded-xl mb-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="text-lg sm:text-xl font-semibold leading-loose flex flex-wrap items-center gap-y-2"
            style={{ color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>
            {lyricParts.map((part, i) => (
              <span key={i} className="flex items-center gap-1 flex-wrap">
                <span>{part}</span>
                {i < blanks.length && (
                  <input
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    value={inputs[i]}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    placeholder="___"
                    disabled={allCorrect}
                    className="inline-block rounded-lg px-2 py-0.5 text-center text-base font-bold outline-none transition-all"
                    style={{
                      width: `${Math.max(blanks[i].length * 11 + 20, 60)}px`,
                      background: checked
                        ? results[i]
                          ? "rgba(52,211,153,0.2)"
                          : "rgba(248,113,113,0.2)"
                        : "rgba(139,92,246,0.15)",
                      border: `1.5px solid ${
                        checked
                          ? results[i] ? "rgba(52,211,153,0.6)" : "rgba(248,113,113,0.6)"
                          : inputs[i] ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.25)"
                      }`,
                      color: checked
                        ? results[i] ? "#34D399" : "#F87171"
                        : "#A78BFA",
                      caretColor: "#8B5CF6",
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {checked && !allCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171" }}>
              {results.every(r => !r)
                ? "Not quite — check each blank carefully!"
                : `${results.filter(Boolean).length}/${blanks.length} correct — keep going!`}
            </motion.div>
          )}
          {allCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm text-center font-bold"
              style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.4)", color: "#34D399" }}>
              ✅ All blanks filled correctly!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheck}
          disabled={!allFilled || allCorrect}
          className="w-full py-3 rounded-xl font-black text-sm text-white disabled:opacity-40 transition-opacity"
          style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)", fontFamily: "Orbitron,Arial,sans-serif", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
          CHECK LYRICS
        </motion.button>

        {!allCorrect && (
          <p className="mt-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
            Press Tab to move between blanks, Enter to check
          </p>
        )}
      </div>
    </div>
  )
}
