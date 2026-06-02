import { useState } from "react"
import { motion } from "framer-motion"

export default function PictureTunePuzzle({ puzzle }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(255,45,120,0.35)",
        background: "rgba(255,45,120,0.05)",
      }}>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,45,120,0.15)" }}>
        <p className="text-xs tracking-[4px] uppercase font-bold" style={{ color: "#FF2D78" }}>
          🖼️ Picture Tune Puzzle
        </p>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Image Clues
        </span>
      </div>

      <div className="p-4">
        {puzzle.image_url ? (
          <div className="relative rounded-xl overflow-hidden"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(255,45,120,0.05)" }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ borderColor: "transparent #FF2D78 transparent transparent" }}
                />
              </div>
            )}
            <img
              src={puzzle.image_url}
              alt="Song clue"
              onLoad={() => setImageLoaded(true)}
              className="w-full rounded-xl"
              style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.4s" }}
            />
            {imageLoaded && (
              <div className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ boxShadow: "inset 0 0 40px rgba(255,45,120,0.15)" }} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 rounded-xl"
            style={{ background: "rgba(255,45,120,0.05)", border: "1px dashed rgba(255,45,120,0.3)" }}>
            <span className="text-5xl mb-3">🖼️</span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Visual clue unavailable in demo mode
            </p>
          </div>
        )}

        <p className="mt-4 text-sm text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
          👀 Use these visual clues to identify the song
        </p>
      </div>
    </div>
  )
}
