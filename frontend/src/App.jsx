import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RoomPage from "./pages/RoomPage";
import PuzzlePage from "./pages/PuzzlePage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/puzzle/:id" element={<PuzzlePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;