import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "@/pages/Lobby";
import GameRoom from "@/pages/GameRoom";
import Vocabulary from "@/pages/Vocabulary";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game" element={<GameRoom />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
      </Routes>
    </Router>
  );
}
