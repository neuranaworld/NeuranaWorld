import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import '@/App.css';
import HomePage from './pages/HomePage';
import MultiAIComparePage from './pages/MultiAIComparePage';
import GamesPage from './pages/GamesPage';
import MathPage from './pages/MathPage';
import TurkishPage from './pages/TurkishPage';
import TranslatePage from './pages/TranslatePage';
import DeepThinkPage from './pages/math/DeepThinkPage';
import QuickPracticePage from './pages/math/QuickPracticePage';
import BasicOpsGame from './pages/math/games/BasicOpsGame';
import NumberGuessGame from './pages/math/games/NumberGuessGame';
import PatternGame from './pages/math/games/PatternGame';
import PolynomialArena from './pages/math/games/PolynomialArena';
import SudokuGame from './pages/math/games/SudokuGame';
import Calculator from './pages/math/calculator/Calculator';
import HangmanGame from './pages/turkish/games/HangmanGame';
import WordChainGame from './pages/turkish/games/WordChainGame';
import PunctuationGame from './pages/turkish/games/PunctuationGame';
import FiiilmsaGame from './pages/turkish/games/FiiilmsaGame';
import GrammarTestPage from './pages/turkish/GrammarTestPage';
import WritingRulesPage from './pages/turkish/WritingRulesPage';
import IsimSehirHayvan from './pages/tools/IsimSehirHayvan';
import PomodoroTimer from './pages/tools/PomodoroTimer';
import TetrisGame from './pages/games/TetrisGame';
import MinesweeperGame from './pages/games/MinesweeperGame';
import MazeGame from './pages/games/MazeGame';
import NonogramGame from './pages/games/NonogramGame';
import OkeyGame from './pages/games/OkeyGame';
import OkeyPro from './pages/games/OkeyPro';
import BatakGame from './pages/games/BatakGame';
import PokerGame from './pages/games/PokerGame';
import NeuraVerse from './pages/NeuraVerse/NeuraGameMinecraft';
import CityRunner from './pages/games/CityRunner';
import SkyJumper from './pages/games/SkyJumper';

// Yeni Araçlar
import UnitConverter from './pages/tools/UnitConverter';
import Graph2D from './pages/tools/Graph2D';
import AlarmSystem from './pages/tools/AlarmSystem';
import Stopwatch from './pages/tools/Stopwatch';
import WaterReminder from './pages/tools/WaterReminder';
import FocusSounds from './pages/tools/FocusSounds';
import NoiseCancellation from './pages/tools/NoiseCancellation';
import VoiceRecorder from './pages/tools/VoiceRecorder';
import Weather from './pages/tools/Weather';
import DailyQuote from './pages/tools/DailyQuote';
import MindMap from './pages/tools/MindMap';
import SpacedRepetition from './pages/tools/SpacedRepetition';
import ExamMode from './pages/tools/ExamMode';
import HandwritingOCR from './pages/tools/HandwritingOCR';
import FatigueDetector from './pages/tools/FatigueDetector';
import StepCounter from './pages/tools/StepCounter';
import PlaceholderTool from './pages/tools/PlaceholderTool';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/multi-ai" element={<MultiAIComparePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/math" element={<MathPage />} />
          <Route path="/math/deep-think" element={<DeepThinkPage />} />
          <Route path="/math/quick-practice" element={<QuickPracticePage />} />
          <Route path="/math/calculator" element={<Calculator />} />
          <Route path="/math/games/basic-ops" element={<BasicOpsGame />} />
          <Route path="/math/games/number-guess" element={<NumberGuessGame />} />
          <Route path="/math/games/pattern" element={<PatternGame />} />
          <Route path="/math/games/polynomial-arena" element={<PolynomialArena />} />
          <Route path="/math/games/sudoku" element={<SudokuGame />} />
          <Route path="/turkish" element={<TurkishPage />} />
          <Route path="/turkish/grammar-test" element={<GrammarTestPage />} />
          <Route path="/turkish/writing-rules" element={<WritingRulesPage />} />
          <Route path="/turkish/games/hangman" element={<HangmanGame />} />
          <Route path="/turkish/games/word-chain" element={<WordChainGame />} />
          <Route path="/turkish/games/punctuation" element={<PunctuationGame />} />
          <Route path="/turkish/games/fiilimsa" element={<FiiilmsaGame />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/tools/isim-sehir-hayvan" element={<IsimSehirHayvan />} />
          <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
          
          {/* Yeni Araçlar */}
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/2d-graph" element={<Graph2D />} />
          <Route path="/tools/parametric-graph" element={<Graph2D />} />
          <Route path="/tools/alarm" element={<AlarmSystem />} />
          <Route path="/tools/stopwatch" element={<Stopwatch />} />
          <Route path="/tools/water-reminder" element={<WaterReminder />} />
          <Route path="/tools/focus-sounds" element={<FocusSounds />} />
          <Route path="/tools/weather" element={<Weather />} />
          <Route path="/tools/daily-quote" element={<DailyQuote />} />
          
          {/* Placeholder Araçlar */}
          <Route path="/tools/mind-map" element={<MindMap />} />
          <Route path="/tools/spaced-repetition" element={<SpacedRepetition />} />
          <Route path="/tools/exam-mode" element={<ExamMode />} />
          <Route path="/tools/handwriting-ocr" element={<HandwritingOCR />} />
          <Route path="/tools/fatigue-detector" element={<FatigueDetector />} />
          <Route path="/tools/voice-recorder" element={<VoiceRecorder />} />
          <Route path="/tools/noise-cancellation" element={<NoiseCancellation />} />
          <Route path="/tools/step-counter" element={<StepCounter />} />
          
          <Route path="/games/tetris" element={<TetrisGame />} />
          <Route path="/games/minesweeper" element={<MinesweeperGame />} />
          <Route path="/games/maze" element={<MazeGame />} />
          <Route path="/games/nonogram" element={<NonogramGame />} />
          <Route path="/games/okey" element={<OkeyGame />} />
          <Route path="/games/101-okey" element={<OkeyPro />} />
          <Route path="/games/batak" element={<BatakGame />} />
          <Route path="/games/poker" element={<PokerGame />} />
          <Route path="/games/city-runner" element={<CityRunner />} />
          <Route path="/games/sky-jumper" element={<SkyJumper />} />
          <Route path="/neuraverse" element={<NeuraVerse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
