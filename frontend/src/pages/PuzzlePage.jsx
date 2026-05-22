import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import {
  getPuzzlesByRoom,
  submitPuzzleAnswer
} from "../services/puzzleService"

function PuzzlePage() {
  const { roomId } = useParams()
  const [puzzles, setPuzzles] = useState([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex]
    = useState(0)
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState({
    correct: null
  })
  useEffect(() => {
    fetchPuzzles()
  }, [roomId])
  const fetchPuzzles = async () => {
    try {
      const data = await getPuzzlesByRoom(
        roomId
      )
      setPuzzles(data)
    } catch (error) {
      console.error(error)
    }
  }
  const currentPuzzle =
    puzzles[currentPuzzleIndex]

 const handleSubmit = async () => {
  if (!answer) return
  try {
    const response =
      await submitPuzzleAnswer(
        currentPuzzle.id,
        answer
      )
    console.log(
      "Frontend Received:",
      response
    )
    setResult(response)
  } catch (error) {
    console.error(error)
  }
}

  const nextPuzzle = () => {
    setAnswer("")
    setResult({
      correct: null
    })
    setCurrentPuzzleIndex((prevIndex) => prevIndex + 1)
  }
  if (!currentPuzzle) {
    return (
<MainLayout>
<div className="
          min-h-screen
          flex
          items-center
          justify-center
        ">
<h1 className="text-4xl font-bold">
            Loading Puzzle...
</h1>
</div>
</MainLayout>
    )
  }
  return (
<MainLayout>
<div className="
        min-h-[90vh]
        flex
        items-center
        justify-center
        px-6
      ">
<div className="
          w-full
          max-w-2xl
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-10
        ">
<h2 className="
            text-4xl
            font-bold
            mb-6
          ">
            {currentPuzzle.title}
</h2>
<p className="
            text-slate-400
            mb-8
          ">
            {currentPuzzle.description}
            {currentPuzzle.audio_url && (
<audio
    controls
    className="w-full mb-6"
>
<source
      src={currentPuzzle.audio_url}
      type="audio/mpeg"
    />
</audio>
)}
</p>
<input
            type="text"
            placeholder="Enter your answer..."
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              px-4
              py-4
              text-white
              mb-6
              outline-none
            "
          />
<button
            onClick={handleSubmit}
            type = "button"
            className="
              w-full
              bg-cyan-500
              hover:bg-cyan-400
              text-black
              font-bold
              py-4
              rounded-xl
            "
>
            Submit Answer
</button>
        {result.correct !== null && (

  <div className="mt-8">

    {result.correct ? (

      <div>

        <p className="
          text-green-400
          text-xl
          font-bold
          mb-4
        ">
          Correct Answer 🎉
        </p>

        {currentPuzzleIndex <
        puzzles.length - 1 ? (

          <button
            onClick={nextPuzzle}
            className="
              bg-purple-500
              hover:bg-purple-400
              px-6
              py-3
              rounded-xl
              font-semibold
            "
          >
            Next Puzzle
          </button>

        ) : (

          <p className="
            text-cyan-400
            text-2xl
            font-bold
          ">
            Room Completed 🎵
          </p>

        )}

      </div>

    ) : (

      <div>

        <p className="
          text-red-400
          text-xl
          font-bold
        ">
          Wrong Answer ❌
        </p>

      </div>

    )}

  </div>

)}
</div>
</div>
</MainLayout>
  )
}
export default PuzzlePage