import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import RoomsPage from "../pages/RoomPage"
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
</Routes>
</BrowserRouter>
  )
}
export default AppRoutes