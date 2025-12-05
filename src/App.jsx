import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Galaxy Pages
import HomePage from './pages/HomePage.jsx'
import GamesPage from './pages/GamesPage.jsx'
import AllToolsPage from './pages/AllToolsPage.jsx'
import MathPage from './pages/MathPage.jsx'
import TurkishPage from './pages/TurkishPage.jsx'
import TranslatePage from './pages/TranslatePage.jsx'
import MultiAIComparePage from './pages/MultiAIComparePage.jsx'

// NeuraVerse (3D Metaverse)
import NeuraVerse from './pages/NeuraVerse/NeuraVerse.jsx'
import NeuraVerse2 from './pages/NeuraVerse/NeuraVerse2.jsx'
import NeuraVerse3 from './pages/NeuraVerse/NeuraVerse3.jsx'
import NeuraVerseSimple from './pages/NeuraVerse/NeuraVerseSimple.jsx'
import NeuraGameMinecraft from './pages/NeuraVerse/NeuraGameMinecraft.jsx'

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
import OkeyGame from './pages/games/OkeyGame.jsx'
import OkeyGamePage from './pages/games/OkeyGamePage.jsx'

// Unique Oyunlar
import FarmDominion from './pages/games/FarmDominion.jsx'
import GalaxyGame from './pages/games/GalaxyGame.jsx'
import SurvivalGame from './pages/games/SurvivalGame.jsx'

// Matematik Oyunları
import DeepThinkPage from './pages/math/DeepThinkPage.jsx'
import QuickPracticePage from './pages/math/QuickPracticePage.jsx'
import Calculator from './pages/math/calculator/Calculator.jsx'
import BasicOpsGame from './pages/math/games/BasicOpsGame.jsx'
import NumberGuessGame from './pages/math/games/NumberGuessGame.jsx'
import PatternGame from './pages/math/games/PatternGame.jsx'
import PolynomialArena from './pages/math/games/PolynomialArena.jsx'
import SudokuGame from './pages/math/games/SudokuGame.jsx'

// Türkçe Oyunları
import GrammarTestPage from './pages/turkish/GrammarTestPage.jsx'
import WritingRulesPage from './pages/turkish/WritingRulesPage.jsx'
import FiiilmsaGame from './pages/turkish/games/FiiilmsaGame.jsx'
import HangmanGame from './pages/turkish/games/HangmanGame.jsx'
import PunctuationGame from './pages/turkish/games/PunctuationGame.jsx'
import WordChainGame from './pages/turkish/games/WordChainGame.jsx'

// Araçlar (30 adet)
import AlarmSystem from './pages/tools/AlarmSystem.jsx'
import BirimDonusturme from './pages/tools/BirimDonusturme.jsx'
import ColorPicker from './pages/tools/ColorPicker.jsx'
import DailyQuote from './pages/tools/DailyQuote.jsx'
import ExamMode from './pages/tools/ExamMode.jsx'
import FatigueDetector from './pages/tools/FatigueDetector.jsx'
import FocusSounds from './pages/tools/FocusSounds.jsx'
import GeometryCalculator from './pages/tools/GeometryCalculator.jsx'
import Graph2D from './pages/tools/Graph2D.jsx'
import HandwritingOCR from './pages/tools/HandwritingOCR.jsx'
import IsimSehirHayvan from './pages/tools/IsimSehirHayvan.jsx'
import JSONVisualizer from './pages/tools/JSONVisualizer.jsx'
import MarkdownEditor from './pages/tools/MarkdownEditor.jsx'
import MatrixCalculator from './pages/tools/MatrixCalculator.jsx'
import MindMap from './pages/tools/MindMap.jsx'
import MindMapAdvanced from './pages/tools/MindMapAdvanced.jsx'
import NoiseCancellation from './pages/tools/NoiseCancellation.jsx'
import PasswordGenerator from './pages/tools/PasswordGenerator.jsx'
import PomodoroTimer from './pages/tools/PomodoroTimer.jsx'
import QRCodeGenerator from './pages/tools/QRCodeGenerator.jsx'
import SpacedRepetition from './pages/tools/SpacedRepetition.jsx'
import StatisticsCalculator from './pages/tools/StatisticsCalculator.jsx'
import StepCounter from './pages/tools/StepCounter.jsx'
import Stopwatch from './pages/tools/Stopwatch.jsx'
import TextDiff from './pages/tools/TextDiff.jsx'
import UnitConverter from './pages/tools/UnitConverter.jsx'
import VoiceRecorder from './pages/tools/VoiceRecorder.jsx'
import WaterReminder from './pages/tools/WaterReminder.jsx'
import Weather from './pages/tools/Weather.jsx'

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

        {/* Unique/Special Oyunlar */}
        <Route path="/games/farmdominion" element={<FarmDominion />} />
        <Route path="/games/galaxy" element={<GalaxyGame />} />
        <Route path="/games/survival" element={<SurvivalGame />} />

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
