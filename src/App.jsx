import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Galaxy Pages
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import AllToolsPage from './pages/AllToolsPage'
import MathPage from './pages/MathPage'
import TurkishPage from './pages/TurkishPage'
import TranslatePage from './pages/TranslatePage'
import MultiAIComparePage from './pages/MultiAIComparePage'

// NeuraVerse (3D Metaverse)
import NeuraVerse from './pages/NeuraVerse/NeuraVerse'
import NeuraVerse2 from './pages/NeuraVerse/NeuraVerse2'
import NeuraVerse3 from './pages/NeuraVerse/NeuraVerse3'
import NeuraVerseSimple from './pages/NeuraVerse/NeuraVerseSimple'
import NeuraGameMinecraft from './pages/NeuraVerse/NeuraGameMinecraft'

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

// Galaxy Oyunları
import OkeyGame from './pages/games/OkeyGame'
import OkeyGamePage from './pages/games/OkeyGamePage'

// Matematik Oyunları
import DeepThinkPage from './pages/math/DeepThinkPage'
import QuickPracticePage from './pages/math/QuickPracticePage'
import Calculator from './pages/math/calculator/Calculator'
import BasicOpsGame from './pages/math/games/BasicOpsGame'
import NumberGuessGame from './pages/math/games/NumberGuessGame'
import PatternGame from './pages/math/games/PatternGame'
import PolynomialArena from './pages/math/games/PolynomialArena'
import SudokuGame from './pages/math/games/SudokuGame'

// Türkçe Oyunları
import GrammarTestPage from './pages/turkish/GrammarTestPage'
import WritingRulesPage from './pages/turkish/WritingRulesPage'
import FiiilmsaGame from './pages/turkish/games/FiiilmsaGame'
import HangmanGame from './pages/turkish/games/HangmanGame'
import PunctuationGame from './pages/turkish/games/PunctuationGame'
import WordChainGame from './pages/turkish/games/WordChainGame'

// Araçlar (30 adet)
import AlarmSystem from './pages/tools/AlarmSystem'
import BirimDonusturme from './pages/tools/BirimDonusturme'
import ColorPicker from './pages/tools/ColorPicker'
import DailyQuote from './pages/tools/DailyQuote'
import ExamMode from './pages/tools/ExamMode'
import FatigueDetector from './pages/tools/FatigueDetector'
import FocusSounds from './pages/tools/FocusSounds'
import GeometryCalculator from './pages/tools/GeometryCalculator'
import Graph2D from './pages/tools/Graph2D'
import HandwritingOCR from './pages/tools/HandwritingOCR'
import IsimSehirHayvan from './pages/tools/IsimSehirHayvan'
import JSONVisualizer from './pages/tools/JSONVisualizer'
import MarkdownEditor from './pages/tools/MarkdownEditor'
import MatrixCalculator from './pages/tools/MatrixCalculator'
import MindMap from './pages/tools/MindMap'
import MindMapAdvanced from './pages/tools/MindMapAdvanced'
import NoiseCancellation from './pages/tools/NoiseCancellation'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import PomodoroTimer from './pages/tools/PomodoroTimer'
import QRCodeGenerator from './pages/tools/QRCodeGenerator'
import SpacedRepetition from './pages/tools/SpacedRepetition'
import StatisticsCalculator from './pages/tools/StatisticsCalculator'
import StepCounter from './pages/tools/StepCounter'
import Stopwatch from './pages/tools/Stopwatch'
import TextDiff from './pages/tools/TextDiff'
import UnitConverter from './pages/tools/UnitConverter'
import VoiceRecorder from './pages/tools/VoiceRecorder'
import WaterReminder from './pages/tools/WaterReminder'
import Weather from './pages/tools/Weather'

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Galaxy Ana Sayfalar */}
        <Route path="/galaxy" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/tools" element={<AllToolsPage />} />
        <Route path="/math" element={<MathPage />} />
        <Route path="/turkish" element={<TurkishPage />} />
        <Route path="/translate" element={<TranslatePage />} />
        <Route path="/ai-compare" element={<MultiAIComparePage />} />

        {/* NeuraVerse (3D Metaverse) */}
        <Route path="/neuraverse" element={<NeuraVerse />} />
        <Route path="/neuraverse2" element={<NeuraVerse2 />} />
        <Route path="/neuraverse3" element={<NeuraVerse3 />} />
        <Route path="/neuraverse-simple" element={<NeuraVerseSimple />} />
        <Route path="/neuraverse-minecraft" element={<NeuraGameMinecraft />} />

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
        <Route path="/oyunlar/okey" element={<OkeyGame />} />
        <Route path="/games/okey" element={<OkeyGamePage />} />

        {/* Matematik Sayfaları ve Oyunları */}
        <Route path="/math/deep-think" element={<DeepThinkPage />} />
        <Route path="/math/quick-practice" element={<QuickPracticePage />} />
        <Route path="/math/calculator" element={<Calculator />} />
        <Route path="/math/games/basic-ops" element={<BasicOpsGame />} />
        <Route path="/math/games/number-guess" element={<NumberGuessGame />} />
        <Route path="/math/games/pattern" element={<PatternGame />} />
        <Route path="/math/games/polynomial" element={<PolynomialArena />} />
        <Route path="/math/games/sudoku" element={<SudokuGame />} />

        {/* Türkçe Eğitim */}
        <Route path="/turkish/grammar" element={<GrammarTestPage />} />
        <Route path="/turkish/writing-rules" element={<WritingRulesPage />} />
        <Route path="/turkish/games/fiilimsa" element={<FiiilmsaGame />} />
        <Route path="/turkish/games/hangman" element={<HangmanGame />} />
        <Route path="/turkish/games/punctuation" element={<PunctuationGame />} />
        <Route path="/turkish/games/word-chain" element={<WordChainGame />} />

        {/* Araçlar */}
        <Route path="/tools/alarm" element={<AlarmSystem />} />
        <Route path="/tools/birim-donusturme" element={<BirimDonusturme />} />
        <Route path="/tools/color-picker" element={<ColorPicker />} />
        <Route path="/tools/daily-quote" element={<DailyQuote />} />
        <Route path="/tools/exam-mode" element={<ExamMode />} />
        <Route path="/tools/fatigue-detector" element={<FatigueDetector />} />
        <Route path="/tools/focus-sounds" element={<FocusSounds />} />
        <Route path="/tools/geometry" element={<GeometryCalculator />} />
        <Route path="/tools/graph2d" element={<Graph2D />} />
        <Route path="/tools/handwriting-ocr" element={<HandwritingOCR />} />
        <Route path="/tools/isim-sehir-hayvan" element={<IsimSehirHayvan />} />
        <Route path="/tools/json-visualizer" element={<JSONVisualizer />} />
        <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
        <Route path="/tools/matrix-calculator" element={<MatrixCalculator />} />
        <Route path="/tools/mind-map" element={<MindMap />} />
        <Route path="/tools/mind-map-advanced" element={<MindMapAdvanced />} />
        <Route path="/tools/noise-cancellation" element={<NoiseCancellation />} />
        <Route path="/tools/password-generator" element={<PasswordGenerator />} />
        <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
        <Route path="/tools/qr-code" element={<QRCodeGenerator />} />
        <Route path="/tools/spaced-repetition" element={<SpacedRepetition />} />
        <Route path="/tools/statistics" element={<StatisticsCalculator />} />
        <Route path="/tools/step-counter" element={<StepCounter />} />
        <Route path="/tools/stopwatch" element={<Stopwatch />} />
        <Route path="/tools/text-diff" element={<TextDiff />} />
        <Route path="/tools/unit-converter" element={<UnitConverter />} />
        <Route path="/tools/voice-recorder" element={<VoiceRecorder />} />
        <Route path="/tools/water-reminder" element={<WaterReminder />} />
        <Route path="/tools/weather" element={<Weather />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
