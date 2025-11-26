import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Aksiyon Oyunları
import BreakoutGame from '../Oyunlar/Aksiyon/BreakoutGame'
import CityRunner from '../Oyunlar/Aksiyon/CityRunner'
import DartGame from '../Oyunlar/Aksiyon/DartGame'
import FlappyBird from '../Oyunlar/Aksiyon/FlappyBird'
import PongGame from '../Oyunlar/Aksiyon/PongGame'
import SkyJumper from '../Oyunlar/Aksiyon/SkyJumper'
import SnakeGame from '../Oyunlar/Aksiyon/SnakeGame'

// Bulmaca Oyunları
import CizimGame from '../Oyunlar/Bulmaca/CizimGame'
import Game2048 from '../Oyunlar/Bulmaca/Game2048'
import JigsawPuzzle from '../Oyunlar/Bulmaca/JigsawPuzzle'
import MemoryGame from '../Oyunlar/Bulmaca/MemoryGame'
import MinesweeperGame from '../Oyunlar/Bulmaca/MinesweeperGame'
import NonogramGame from '../Oyunlar/Bulmaca/NonogramGame'
import PuzzleGame from '../Oyunlar/Bulmaca/PuzzleGame'
import SekerEslestirmece from '../Oyunlar/Bulmaca/SekerEslestirmece'
import TetrisGame from '../Oyunlar/Bulmaca/TetrisGame'
import WordSearchGame from '../Oyunlar/Bulmaca/WordSearchGame'

// Strateji Oyunları
import BatakGame from '../Oyunlar/Strateji/BatakGame'
import CardGames from '../Oyunlar/Strateji/CardGames'
import ConnectFourGame from '../Oyunlar/Strateji/ConnectFourGame'
import OkeyGame101 from '../Oyunlar/Strateji/OkeyGame101'
import OkeyPro from '../Oyunlar/Strateji/OkeyPro'
import PokerGame from '../Oyunlar/Strateji/PokerGame'
import TicTacToeGame from '../Oyunlar/Strateji/TicTacToeGame'

// Macera Oyunları
import MazeGame from '../Oyunlar/Macera/MazeGame'

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Aksiyon */}
        <Route path="/oyunlar/breakout" element={<BreakoutGame />} />
        <Route path="/oyunlar/cityrunner" element={<CityRunner />} />
        <Route path="/oyunlar/dart" element={<DartGame />} />
        <Route path="/oyunlar/flappybird" element={<FlappyBird />} />
        <Route path="/oyunlar/pong" element={<PongGame />} />
        <Route path="/oyunlar/skyjumper" element={<SkyJumper />} />
        <Route path="/oyunlar/snake" element={<SnakeGame />} />

        {/* Bulmaca */}
        <Route path="/oyunlar/cizim" element={<CizimGame />} />
        <Route path="/oyunlar/2048" element={<Game2048 />} />
        <Route path="/oyunlar/jigsaw" element={<JigsawPuzzle />} />
        <Route path="/oyunlar/memory" element={<MemoryGame />} />
        <Route path="/oyunlar/minesweeper" element={<MinesweeperGame />} />
        <Route path="/oyunlar/nonogram" element={<NonogramGame />} />
        <Route path="/oyunlar/puzzle" element={<PuzzleGame />} />
        <Route path="/oyunlar/seker" element={<SekerEslestirmece />} />
        <Route path="/oyunlar/tetris" element={<TetrisGame />} />
        <Route path="/oyunlar/wordsearch" element={<WordSearchGame />} />

        {/* Strateji */}
        <Route path="/oyunlar/batak" element={<BatakGame />} />
        <Route path="/oyunlar/cards" element={<CardGames />} />
        <Route path="/oyunlar/connect4" element={<ConnectFourGame />} />
        <Route path="/oyunlar/okey101" element={<OkeyGame101 />} />
        <Route path="/oyunlar/okeypro" element={<OkeyPro />} />
        <Route path="/oyunlar/poker" element={<PokerGame />} />
        <Route path="/oyunlar/tictactoe" element={<TicTacToeGame />} />

        {/* Macera */}
        <Route path="/oyunlar/maze" element={<MazeGame />} />
      </Routes>
    </BrowserRouter>
  )
}
