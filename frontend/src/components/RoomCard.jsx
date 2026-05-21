import { motion } from "framer-motion"

function RoomCard({

  room,

  onEnter

}) {

  return (
<motion.div

      whileHover={{

        scale: 1.03

      }}

      className="

        bg-slate-900

        border border-slate-800

        rounded-3xl

        p-6

        shadow-lg

        hover:border-cyan-400

        transition

      "
>
<h2 className="text-3xl font-bold mb-3">

        {room.name}
</h2>
<p className="text-slate-400 mb-4">

        {room.description}
</p>
<div className="flex justify-between items-center">
<span className="

          bg-cyan-500/20

          text-cyan-400

          px-4 py-1

          rounded-full

          text-sm

        ">

          {room.difficulty}
</span>
<button

          onClick={onEnter}

          className="

            bg-cyan-500

            hover:bg-cyan-400

            text-black

            font-semibold

            px-5 py-2

            rounded-xl

          "
>

          Enter
</button>
</div>
</motion.div>

  )

}

export default RoomCard