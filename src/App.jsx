import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Yeni Oyunlar
import FarmDominion from './pages/games/FarmDominion'
import SurvivalGame from './pages/games/SurvivalGame'
import GalaxyGame from './pages/games/GalaxyGame'

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Yeni Oyunlar */}
        <Route path="/oyunlar/farmdominion" element={<FarmDominion />} />
        <Route path="/oyunlar/survival" element={<SurvivalGame />} />
        <Route path="/oyunlar/galaxy" element={<GalaxyGame />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
