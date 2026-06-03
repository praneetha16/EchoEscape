import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { loginUser, getCurrentUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"

const FIELD = "w-full rounded-2xl px-5 py-4 text-white outline-none transition-all"
const FIELD_STYLE = {
  background: "linear-gradient(135deg,rgba(0,229,255,0.07),rgba(139,92,246,0.07))",
  border: "1.5px solid rgba(0,229,255,0.35)",
  caretColor: "#00E5FF",
  fontFamily: "'Space Grotesk',Arial,sans-serif",
}
const FIELD_FOCUS = {
  borderColor: "#00E5FF",
  boxShadow: "0 0 28px rgba(0,229,255,0.25), inset 0 0 20px rgba(0,229,255,0.06)",
}
const FIELD_BLUR = {
  borderColor: "rgba(0,229,255,0.35)",
  boxShadow: "none",
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError("Please fill in all fields."); return }
    setError(""); setLoading(true)
    try {
      const { access_token } = await loginUser(email, password)
      localStorage.setItem("maestro-token", access_token) // must be set before getCurrentUser
      const userData = await getCurrentUser()
      login(access_token, userData)
      navigate("/rooms")
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#05050F" }}>

      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none blob1"
        style={{ background: "rgba(0,229,255,0.10)", filter: "blur(120px)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none blob2"
        style={{ background: "rgba(139,92,246,0.12)", filter: "blur(110px)" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

      <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(13,13,26,0.85)",
            border: "1px solid rgba(0,229,255,0.18)",
            boxShadow: "0 0 60px rgba(0,229,255,0.08), 0 40px 80px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
          }}>

          {/* Top strip */}
          <div className="px-8 pt-8 pb-6 text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Logo */}
            <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 mx-auto mb-6">
              <img src="/favicon.svg" alt="Maestro" style={{ width:"36px", height:"36px", borderRadius:"12px", boxShadow:"0 0 20px rgba(0,229,255,0.4)" }} />
              <span style={{ fontFamily:"'Orbitron',Arial,sans-serif", fontWeight:900, fontSize:"1.1rem" }}>
                <span className="text-white">MAE</span>
                <span style={{ color:"#00E5FF" }}>STRO</span>
              </span>
            </button>

            <h1 className="font-black text-3xl text-white mb-1"
              style={{ fontFamily:"'Orbitron',Arial,sans-serif", letterSpacing:"0.05em" }}>
              WELCOME BACK
            </h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.9rem" }}>
              Sign in to continue your escape
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                className="rounded-xl px-4 py-3 text-sm"
                style={{ background:"rgba(248,113,113,0.10)", border:"1px solid rgba(248,113,113,0.30)", color:"#F87171" }}>
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-widest uppercase"
                style={{ color:"rgba(0,229,255,0.7)" }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className={FIELD} style={FIELD_STYLE}
                onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-widest uppercase"
                style={{ color:"rgba(0,229,255,0.7)" }}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                className={FIELD} style={FIELD_STYLE}
                onFocus={e => Object.assign(e.target.style, FIELD_FOCUS)}
                onBlur={e => Object.assign(e.target.style, FIELD_BLUR)}
              />
            </div>

            {/* Submit */}
            <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-black text-base tracking-wider mt-2 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#00E5FF,#8B5CF6,#FF2D78)",
                fontFamily: "'Orbitron',Arial,sans-serif",
                boxShadow: "0 0 28px rgba(0,229,255,0.30)",
              }}>
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-7 text-center">
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.875rem" }}>
              Don't have an account?{" "}
              <Link to="/register"
                className="font-bold transition-colors"
                style={{ color:"#00E5FF" }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
