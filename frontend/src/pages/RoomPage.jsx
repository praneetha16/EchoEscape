import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import RoomCard from "../components/RoomCard"
import { getRooms } from "../services/roomService"
import { useNavigate } from "react-router-dom"

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    fetchRooms()
  }, [])
  const fetchRooms = async () => {
    try {
      const data = await getRooms()
      setRooms(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
<MainLayout>
<div className="px-8 py-12">
<h1 className="text-5xl font-bold mb-10">
          Escape Rooms 🎮
</h1>
        {loading ? (
<p className="text-slate-400">
            Loading rooms...
</p>
        ) : (
<div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
<RoomCard
                key={room.id}
                room={room}
                onEnter={() => {
                  navigate(`/rooms/${room.id}`)
                }}
              />
            ))}
</div>
        )}
</div>
</MainLayout>
  )
}

export default RoomsPage