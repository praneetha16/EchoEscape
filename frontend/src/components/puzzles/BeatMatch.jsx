import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

function shuffleUnique(arr) {
  // Deduplicate first, then shuffle
  const unique = [...new Map(arr.map(v => [v, v])).values()]
  return unique.sort(() => Math.random() - 0.5)
}

export default function BeatMatch({ puzzle, onDirectComplete }) {
  const pairs   = puzzle.options_json?.pairs || []
  const songs   = pairs.map(p => p.song)
  // Guarantee unique artist list regardless of data
  const artists = useMemo(() => shuffleUnique(pairs.map(p => p.artist)), [puzzle.id])

  const [selectedSong, setSelectedSong] = useState(null)
  const [matches,      setMatches]      = useState({}) // song → artist
  const [wrongArtist,  setWrongArtist]  = useState(null)
  const [allCorrect,   setAllCorrect]   = useState(false)

  const handleSong = (song) => {
    if (matches[song] || allCorrect) return
    setSelectedSong(s => s === song ? null : song)
  }

  const handleArtist = (artist) => {
    if (allCorrect || !selectedSong) return
    const correct = pairs.find(p => p.song === selectedSong)?.artist
    if (correct === artist) {
      const next = { ...matches, [selectedSong]: artist }
      setMatches(next)
      setSelectedSong(null)
      if (Object.keys(next).length === pairs.length) {
        setAllCorrect(true)
        setTimeout(() => onDirectComplete(), 1000)
      }
    } else {
      setWrongArtist(artist)
      setTimeout(() => setWrongArtist(null), 500)
    }
  }

  const matchedArtists = new Set(Object.values(matches))
  const progress = Object.keys(matches).length

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(0,229,255,0.25)",
        background: "linear-gradient(135deg, rgba(0,229,255,0.04), rgba(139,92,246,0.04))",
        boxShadow: "0 0 30px rgba(0,229,255,0.06)",
      }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0,229,255,0.10)" }}>
        <p className="text-[10px] tracking-[4px] uppercase font-bold" style={{ color: "#00E5FF" }}>
          🎯 Beat Match
        </p>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {songs.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i < progress ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  background: i < progress
                    ? `linear-gradient(135deg, #00E5FF, #8B5CF6)`
                    : "rgba(255,255,255,0.12)",
                  boxShadow: i < progress ? "0 0 6px #00E5FF" : "none",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: "rgba(0,229,255,0.6)" }}>
            {progress}/{songs.length}
          </span>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {allCorrect ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center py-10"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >🎯</motion.div>
              <p className="text-2xl font-black" style={{ color: "#00E5FF", fontFamily: "Orbitron,Arial,sans-serif" }}>
                PERFECT MATCH!
              </p>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>All songs correctly matched</p>
            </motion.div>
          ) : (
            <motion.div key="game" className="grid grid-cols-2 gap-4">
              {/* Songs column */}
              <div className="space-y-2">
                <p className="text-[10px] tracking-[3px] uppercase text-center mb-3 font-semibold"
                  style={{ color: "rgba(0,229,255,0.5)" }}>Songs</p>
                {songs.map(song => {
                  const isMatched  = !!matches[song]
                  const isSelected = selectedSong === song
                  return (
                    <motion.button
                      key={song}
                      onClick={() => handleSong(song)}
                      whileHover={!isMatched ? { scale: 1.03 } : {}}
                      whileTap={!isMatched ? { scale: 0.97 } : {}}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{
                        background: isMatched
                          ? "rgba(0,229,255,0.10)"
                          : isSelected
                          ? "rgba(0,229,255,0.15)"
                          : "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${isMatched
                          ? "rgba(0,229,255,0.50)"
                          : isSelected
                          ? "rgba(0,229,255,0.80)"
                          : "rgba(255,255,255,0.08)"}`,
                        color: isMatched ? "#00E5FF" : isSelected ? "#fff" : "rgba(255,255,255,0.65)",
                        cursor: isMatched ? "default" : "pointer",
                        boxShadow: isSelected ? "0 0 16px rgba(0,229,255,0.25)" : "none",
                      }}
                    >
                      {isMatched ? "✓ " : isSelected ? "▶ " : ""}{song}
                    </motion.button>
                  )
                })}
              </div>

              {/* Artists column */}
              <div className="space-y-2">
                <p className="text-[10px] tracking-[3px] uppercase text-center mb-3 font-semibold"
                  style={{ color: "rgba(139,92,246,0.5)" }}>Artists</p>
                {artists.map(artist => {
                  const isMatched = matchedArtists.has(artist)
                  const isWrong   = wrongArtist === artist
                  return (
                    <motion.button
                      key={artist}
                      onClick={() => handleArtist(artist)}
                      whileHover={!isMatched ? { scale: 1.03 } : {}}
                      whileTap={!isMatched ? { scale: 0.97 } : {}}
                      animate={isWrong ? { x: [-5, 5, -5, 0] } : {}}
                      transition={isWrong ? { duration: 0.3 } : {}}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{
                        background: isMatched
                          ? "rgba(139,92,246,0.12)"
                          : isWrong
                          ? "rgba(255,45,120,0.15)"
                          : "rgba(139,92,246,0.06)",
                        border: `1.5px solid ${isMatched
                          ? "rgba(139,92,246,0.55)"
                          : isWrong
                          ? "rgba(255,45,120,0.60)"
                          : "rgba(139,92,246,0.22)"}`,
                        color: isMatched ? "#A78BFA" : isWrong ? "#FF2D78" : "rgba(255,255,255,0.65)",
                        cursor: isMatched ? "default" : selectedSong ? "pointer" : "not-allowed",
                        opacity: !selectedSong && !isMatched ? 0.5 : 1,
                        boxShadow: isMatched ? "0 0 10px rgba(139,92,246,0.20)" : "none",
                      }}
                    >
                      {isMatched ? "✓ " : ""}{artist}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!allCorrect && (
          <p className="mt-4 text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
            {selectedSong
              ? `🎵 "${selectedSong}" selected — now pick the matching artist`
              : "Click a song first, then click its artist to match them"}
          </p>
        )}
      </div>
    </div>
  )
}
