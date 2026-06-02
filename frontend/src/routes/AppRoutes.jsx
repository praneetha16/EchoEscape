import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage       from "../pages/HomePage"
import RoomsPage      from "../pages/RoomPage"
import PuzzlePage     from "../pages/PuzzlePage"
import LoginPage      from "../pages/Login"
import RegisterPage   from "../pages/Register"
import LeaderboardPage from "../pages/LeaderboardPage"
import ProtectedRoute from "../components/ProtectedRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/register"      element={<RegisterPage />} />
        <Route path="/rooms"         element={<RoomsPage />} />
        <Route path="/leaderboard"   element={<LeaderboardPage />} />
        <Route path="/rooms/:roomId" element={
          <ProtectedRoute><PuzzlePage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
