import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import RoomsPage from "../pages/RoomPage"
import PuzzlePage from "../pages/PuzzlePage"

function AppRoutes() {
  return (
<BrowserRouter>
<Routes>
<Route
          path="/"
          element={<HomePage />}
        />
<Route
          path="/rooms"
          element={<RoomsPage />}
        />
<Route
        path="/rooms/:roomId"
        element={<PuzzlePage />}
        />
</Routes>

</BrowserRouter>
  )
}
export default AppRoutes