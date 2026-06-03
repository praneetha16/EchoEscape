import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

/* ─── letter animation variants ────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}
const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90, scale: 0.5 },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 12 } },
}

/* ─── tiny helpers ─────────────────────────────── */
const WAVE_HEIGHTS = [35, 65, 50, 90, 70, 100, 55, 80, 45, 75, 60, 85]

function Equalizer({ barCount = 12, className = "" }) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {WAVE_HEIGHTS.slice(0, barCount).map((h, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [1, 0.25, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1 + (i % 4) * 0.15,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full origin-bottom"
          style={{
            height: `${h * 0.6}px`,
            background: `linear-gradient(to top, #00E5FF, #8B5CF6)`,
          }}
        />
      ))}
    </div>
  )
}

const FEATURES = [
  {
    emoji: "🎧",
    title: "Listen & Decode",
    desc: "Hidden clues live inside the music — rhythm, melody, silence. Train your ears and decode them.",
    color: "#00E5FF",
  },
  {
    emoji: "🧩",
    title: "Solve Puzzles",
    desc: "Each puzzle tests your music knowledge, pitch memory, and lateral thinking in a new way.",
    color: "#8B5CF6",
  },
  {
    emoji: "🏆",
    title: "Score & Conquer",
    desc: "Crack every puzzle in the room, beat the clock, and etch your name into the leaderboard.",
    color: "#FF2D78",
  },
]

const STATS = [
  { value: "3",  label: "Music Rooms" },
  { value: "8+", label: "Puzzles Per Room" },
  { value: "∞",  label: "Replayability" },
]

/* ─── page ─────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate()

  return (
    <MainLayout>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* — animated colour blobs — */}
        <div
          className="blob1 absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "rgba(0,229,255,0.18)", filter: "blur(120px)" }}
        />
        <div
          className="blob2 absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "rgba(255,45,120,0.18)", filter: "blur(110px)" }}
        />
        <div
          className="blob3 absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "rgba(139,92,246,0.14)", filter: "blur(100px)" }}
        />

        {/* — faint grid overlay — */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* — content — */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl w-full"
        >
          {/* equalizer decoration */}
          <div className="flex justify-center mb-10">
            <Equalizer barCount={12} className="h-16" />
          </div>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 mb-8 text-xs font-semibold tracking-widest uppercase"
            style={{
              borderColor: "rgba(0,229,255,0.35)",
              background: "rgba(0,229,255,0.07)",
              color: "#00E5FF",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#00E5FF" }}
            />
            Music-Powered Puzzle Rooms
          </motion.div>

          {/* headline */}
          <motion.h1
            className="font-black leading-none mb-6 flicker"
            style={{ fontSize: "clamp(4rem,12vw,9rem)", letterSpacing: "0.04em", perspective: "600px" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {"MAESTRO".split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                whileHover={{
                  y: -18, scale: 1.3,
                  rotate: i % 2 === 0 ? -8 : 8,
                  filter: "drop-shadow(0 0 40px rgba(0,229,255,1)) drop-shadow(0 0 80px rgba(139,92,246,0.8))",
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                style={{
                  display: "inline-block",
                  cursor: "default",
                  background: "linear-gradient(90deg,#00E5FF,#8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 18px rgba(0,229,255,0.6))",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "'Space Grotesk',Arial,sans-serif" }}
          >
            Decode hidden songs, crack audio puzzles, and conquer immersive
            rooms using nothing but your ears, memory, and rhythm.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/rooms")}
              className="pulse-glow-cyan px-9 py-4 rounded-2xl font-black text-lg text-black tracking-wide"
              style={{
                background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
                fontFamily: "'Orbitron',Arial,sans-serif",
              }}
            >
              START PLAYING →
            </motion.button>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-neon px-9 py-4 rounded-2xl font-bold text-base"
            >
              HOW IT WORKS
            </button>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          <span className="text-[10px] tracking-[4px] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-px h-8 rounded-full"
            style={{ background: "linear-gradient(to bottom,rgba(0,229,255,0.5),transparent)" }}
          />
        </motion.div>
      </section>

      {/* ═════════════════════ STATS STRIP ════════════════════ */}
      <section
        className="py-10 border-y"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p
                className="font-black text-4xl md:text-5xl glow-cyan mb-1"
                style={{
                  fontFamily: "'Orbitron',Arial,sans-serif",
                  background: "linear-gradient(135deg,#00E5FF,#8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURES ════════════════════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p
              className="text-xs tracking-[6px] uppercase font-semibold mb-4"
              style={{ color: "#00E5FF" }}
            >
              The Experience
            </p>
            <h2
              className="font-black text-4xl md:text-5xl text-white mb-4"
              style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}
            >
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Pick a room. Solve the puzzles. Own the leaderboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="gradient-border rounded-2xl p-8 relative overflow-hidden group cursor-default"
              >
                {/* number watermark */}
                <span
                  className="absolute top-4 right-6 font-black select-none pointer-events-none"
                  style={{
                    fontFamily: "'Orbitron',Arial,sans-serif",
                    fontSize: "5rem",
                    color: "rgba(255,255,255,0.04)",
                    lineHeight: 1,
                  }}
                >
                  0{i + 1}
                </span>

                {/* icon bubble */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110"
                  style={{
                    background: `rgba(${
                      f.color === "#00E5FF" ? "0,229,255" :
                      f.color === "#8B5CF6" ? "139,92,246" : "255,45,120"
                    },0.12)`,
                    border: `1px solid ${f.color}30`,
                  }}
                >
                  {f.emoji}
                </div>

                <h3
                  className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors"
                  style={{ fontFamily: "'Space Grotesk',Arial,sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ══════════════════════ */}
      <section className="py-16 px-6 pb-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden text-center px-8 py-16 md:py-20"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.08), rgba(139,92,246,0.12), rgba(255,45,120,0.08))",
              border: "1px solid rgba(0,229,255,0.2)",
            }}
          >
            {/* radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,229,255,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <Equalizer barCount={8} className="justify-center h-12 mb-8" />

              <h2
                className="font-black text-3xl md:text-5xl text-white mb-5"
                style={{ fontFamily: "'Orbitron',Arial,sans-serif" }}
              >
                Ready to Play?
              </h2>
              <p
                className="text-lg mb-10 max-w-lg mx-auto"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Choose a room, follow the clues, and prove your musical instincts.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/rooms")}
                className="px-10 py-4 rounded-2xl font-black text-lg text-black"
                style={{
                  background: "linear-gradient(135deg,#00E5FF,#8B5CF6,#FF2D78)",
                  fontFamily: "'Orbitron',Arial,sans-serif",
                  boxShadow: "0 0 40px rgba(0,229,255,0.3), 0 0 80px rgba(139,92,246,0.2)",
                }}
              >
                BROWSE ROOMS →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ══════════════════════════ */}
      <footer
        className="py-8 px-6 border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span
            className="font-black text-sm tracking-widest"
            style={{ fontFamily: "'Orbitron',Arial,sans-serif", color: "rgba(255,255,255,0.25)" }}
          >
            MAE<span style={{ color: "#00E5FF" }}>STRO</span>
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Built with ♪ and code
          </span>
        </div>
      </footer>

    </MainLayout>
  )
}
