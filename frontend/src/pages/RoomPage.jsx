import MainLayout from "../layouts/MainLayout"
import RoomCard from "../components/RoomCard"
function RoomsPage() {
  const rooms = [
    {
      id: 1,
      name: "Broken Broadcast",
      description:
        "An abandoned radio station filled with hidden audio clues.",
      difficulty: "Easy"
    },
    {
      id: 2,
      name: "Composer Chamber",
      description:
        "Decode melodies and uncover forgotten musical secrets.",
      difficulty: "Medium"
    },
    {
      id: 3,
      name: "Final Performance",
      description:
        "The ultimate concert hall escape challenge.",
      difficulty: "Hard"
    }
  ]
  return (
<MainLayout>
<div className="px-8 py-12">
<h1 className="text-5xl font-bold mb-10">
          Escape Rooms 🎮
</h1>
<div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
<RoomCard
              key={room.id}
              room={room}
              onEnter={() => {
                alert(`Entering ${room.name}`)
              }}
            />
          ))}
</div>
</div>
</MainLayout>
  )
}
export default RoomsPage