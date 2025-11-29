import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Büyük Oyunlar (3D/Multiplayer)
import FarmDominion from './pages/games/FarmDominion'
import SurvivalGame from './pages/games/SurvivalGame'
import GalaxyGame from './pages/games/GalaxyGame'

// Aksiyon Oyunları
import BreakoutGame from './components/games/BreakoutGame'
import CityRunner from './components/games/CityRunner'
import DartGame from './components/games/DartGame'
import FlappyBird from './components/games/FlappyBird'
import PongGame from './components/games/PongGame'
import SkyJumper from './components/games/SkyJumper'
import SnakeGame from './components/games/SnakeGame'

// Bulmaca Oyunları
import CizimGame from './components/games/CizimGame'
import JigsawPuzzle from './components/games/JigsawPuzzle'
import MemoryGame from './components/games/MemoryGame'
import SekerEslestirmece from './components/games/SekerEslestirmece'

// Strateji Oyunları
import ConnectFourGame from './components/games/ConnectFourGame'
import OkeyGame101 from './components/games/OkeyGame101'
import OkeyPro from './components/games/OkeyPro'

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Büyük Oyunlar */}
        <Route path="/oyunlar/farmdominion" element={<FarmDominion />} />
        <Route path="/oyunlar/survival" element={<SurvivalGame />} />
        <Route path="/oyunlar/galaxy" element={<GalaxyGame />} />

        {/* Aksiyon Oyunları */}
        <Route path="/oyunlar/breakout" element={<BreakoutGame />} />
        <Route path="/oyunlar/cityrunner" element={<CityRunner />} />
        <Route path="/oyunlar/dart" element={<DartGame />} />
        <Route path="/oyunlar/flappybird" element={<FlappyBird />} />
        <Route path="/oyunlar/pong" element={<PongGame />} />
        <Route path="/oyunlar/skyjumper" element={<SkyJumper />} />
        <Route path="/oyunlar/snake" element={<SnakeGame />} />

        {/* Bulmaca Oyunları */}
        <Route path="/oyunlar/cizim" element={<CizimGame />} />
        <Route path="/oyunlar/jigsaw" element={<JigsawPuzzle />} />
        <Route path="/oyunlar/memory" element={<MemoryGame />} />
        <Route path="/oyunlar/seker" element={<SekerEslestirmece />} />

        {/* Strateji Oyunları */}
        <Route path="/oyunlar/connect4" element={<ConnectFourGame />} />
        <Route path="/oyunlar/okey101" element={<OkeyGame101 />} />
        <Route path="/oyunlar/okeypro" element={<OkeyPro />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
