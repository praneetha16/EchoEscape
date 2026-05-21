import { motion } from "framer-motion"

import { useNavigate } from "react-router-dom"

import MainLayout from "../layouts/MainLayout"

function HomePage() {

  const navigate = useNavigate()

  return (
<MainLayout>
<div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
<motion.h1

          initial={{ opacity: 0, y: -40 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 1 }}

          className="text-7xl font-extrabold mb-6"
>

          EchoEscape 🎵
</motion.h1>
<motion.p

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ delay: 0.5 }}

          className="text-slate-400 text-xl max-w-2xl mb-10"
>

          Solve musical mysteries, decode hidden songs,

          and escape immersive puzzle rooms using your ears,

          memory, and rhythm.
</motion.p>
<motion.button

          whileHover={{

            scale: 1.05

          }}

          whileTap={{

            scale: 0.95

          }}

          onClick={() => navigate("/rooms")}

          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl text-xl shadow-lg shadow-cyan-500/30"
>

          Enter The Escape 🎧
</motion.button>
</div>
</MainLayout>

  )

}

export default HomePage
 