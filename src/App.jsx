import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Aksiyon Oyunları
import BreakoutGame from '@components/games/Aksiyon/BreakoutGame'
import CityRunner from '@components/games/Aksiyon/CityRunner'
import DartGame from '@components/games/Aksiyon/DartGame'
import FlappyBird from '@components/games/Aksiyon/FlappyBird'
import PongGame from '@components/games/Aksiyon/PongGame'
import SkyJumper from '@components/games/Aksiyon/SkyJumper'
import SnakeGame from '@components/games/Aksiyon/SnakeGame'

// Bulmaca Oyunları
import CizimGame from '@components/games/Bulmaca/CizimGame'
import Game2048 from '@components/games/Bulmaca/Game2048'
import JigsawPuzzle from '@components/games/Bulmaca/JigsawPuzzle'
import MemoryGame from '@components/games/Bulmaca/MemoryGame'
import MinesweeperGame from '@components/games/Bulmaca/MinesweeperGame'
import NonogramGame from '@components/games/Bulmaca/NonogramGame'
import PuzzleGame from '@components/games/Bulmaca/PuzzleGame'
import SekerEslestirmece from '@components/games/Bulmaca/SekerEslestirmece'
import TetrisGame from '@components/games/Bulmaca/TetrisGame'
import WordSearchGame from '@components/games/Bulmaca/WordSearchGame'

// Strateji Oyunları
import BatakGame from '@components/games/Strateji/BatakGame'
import CardGames from '@components/games/Strateji/CardGames'
import ConnectFourGame from '@components/games/Strateji/ConnectFourGame'
import OkeyGame101 from '@components/games/Strateji/OkeyGame101'
import OkeyPro from '@components/games/Strateji/OkeyPro'
import PokerGame from '@components/games/Strateji/PokerGame'
import TicTacToeGame from '@components/games/Strateji/TicTacToeGame'

// Macera Oyunları
import MazeGame from '@components/games/Macera/MazeGame'

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

        {/* 404 - Home'a yönlendir */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
