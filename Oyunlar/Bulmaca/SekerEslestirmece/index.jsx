import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, ArrowLeft, Volume2, VolumeX, Lock, Check, Zap, Bomb, Star } from 'lucide-react';
import { WORLDS, GRID_SIZE, CANDY_DATA } from './core/LevelConfig';
import { audioEngine } from './utils/AudioEngine';
import { findAllMatches } from './core/MatchFinder';
import { createBoard, removeAndFill, findPossibleMoves, shuffleBoard } from './core/BoardLogic';
import { activateSpecial } from './core/SpecialCandies';
import { Candy } from './components/CandyComponents';
import { AdvancedParticle, EnhancedScorePopup, ShockWave, ComboText, StarBurst, PowerUpIndicator } from './components/ParticleSystem';
import {
  ScoreCard, MovesCard, ComboCard, SpecialsCard, ProgressBar, ComboIndicator,
  AchievementToast, LevelCompleteModal, GameOverModal, PowerUpLegend, TargetInfo,
  TotalScoreBadge, UnlockedLevelsBadge
} from './components/UIComponents';

const GameStyles = () => (
  <style>{`
    /* ============================================
       🎨 MODERN UI ANIMATIONS & STYLES
       ============================================ */

    /* Responsive Grid - Mobil/Tablet/Desktop */
    @media (max-width: 640px) {
      .game-board {
        max-width: 100vw !important;
        padding: 0.5rem !important;
      }
      .candy-cell {
        width: calc((100vw - 2rem) / 8) !important;
        height: calc((100vw - 2rem) / 8) !important;
        font-size: clamp(1.5rem, 4vw, 2.5rem) !important;
      }
      .game-header {
        flex-direction: column !important;
        gap: 0.5rem !important;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .game-board {
        max-width: 90vw !important;
      }
      .candy-cell {
        width: calc(min(90vw, 600px) / 8) !important;
        height: calc(min(90vw, 600px) / 8) !important;
        font-size: 2rem !important;
      }
    }
    @media (min-width: 1025px) {
      .candy-cell {
        width: 70px !important;
        height: 70px !important;
        font-size: 2.5rem !important;
      }
    }

    /* Touch support */
    .candy-cell {
      touch-action: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    /* ============================================
       ✨ GLASSMORPHISM & MODERN EFFECTS
       ============================================ */

    .glass-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }

    .glass-card-white {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(30px) saturate(200%);
      -webkit-backdrop-filter: blur(30px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    }

    .neumorphic {
      background: linear-gradient(145deg, #f0f0f0, #cacaca);
      box-shadow:
        20px 20px 60px #bebebe,
        -20px -20px 60px #ffffff;
    }

    /* ============================================
       🌈 ANIMATED GRADIENTS & BACKGROUNDS
       ============================================ */

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes gradient-rotate {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }

    .animated-gradient {
      background: linear-gradient(
        -45deg,
        #ee7752, #e73c7e, #23a6d5, #23d5ab,
        #f093fb, #f5576c, #4facfe, #00f2fe
      );
      background-size: 400% 400%;
      animation: gradient-shift 15s ease infinite;
    }

    .neon-glow {
      text-shadow:
        0 0 10px currentColor,
        0 0 20px currentColor,
        0 0 40px currentColor,
        0 0 80px currentColor;
      animation: neon-flicker 3s infinite alternate;
    }

    @keyframes neon-flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
      55% { opacity: 1; }
      60% { opacity: 0.95; }
    }

    /* ============================================
       🎭 GAME ANIMATIONS
       ============================================ */

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      5% { transform: scale(1.05); }
      10% { transform: scale(1); }
      15% { transform: scale(1.08); }
      20% { transform: scale(1); }
    }

    @keyframes particle-burst-explosion {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }

    @keyframes score-popup-enhanced {
      0% { transform: translateY(0) scale(0.3) rotate(-5deg); opacity: 0; }
      30% { transform: translateY(-20px) scale(1.4) rotate(2deg); opacity: 1; }
      70% { transform: translateY(-50px) scale(1.2) rotate(-1deg); opacity: 1; }
      100% { transform: translateY(-90px) scale(0.8) rotate(3deg); opacity: 0; }
    }

    @keyframes shockwave {
      0% { transform: scale(0.3); opacity: 1; }
      50% { transform: scale(2); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes combo-bounce {
      0% { transform: scale(0) rotate(-15deg); opacity: 0; }
      40% { transform: scale(1.4) rotate(8deg); opacity: 1; }
      60% { transform: scale(0.9) rotate(-5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    @keyframes star-ray {
      0% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 1; }
      50% { transform: rotate(var(--angle, 0deg)) scaleY(2); opacity: 0.9; }
      100% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 0; }
    }

    @keyframes candy-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    @keyframes special-glow {
      0%, 100% {
        filter: brightness(1) drop-shadow(0 0 5px currentColor);
      }
      50% {
        filter: brightness(1.5) drop-shadow(0 0 30px currentColor);
      }
    }

    @keyframes power-up-float {
      0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
      50% { transform: translateY(-40px) scale(1.3) rotate(180deg); opacity: 1; }
      100% { transform: translateY(-80px) scale(0.8) rotate(360deg); opacity: 0; }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    @keyframes float-up-down {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    @keyframes jello {
      0%, 100% { transform: scale(1, 1); }
      30% { transform: scale(1.25, 0.75); }
      40% { transform: scale(0.75, 1.25); }
      50% { transform: scale(1.15, 0.85); }
      65% { transform: scale(0.95, 1.05); }
      75% { transform: scale(1.05, 0.95); }
    }

    @keyframes rainbow-text {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes slide-in-bottom {
      0% { transform: translateY(100px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes slide-in-top {
      0% { transform: translateY(-100px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes scale-in {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
    }

    /* ============================================
       🎯 HOVER & INTERACTION EFFECTS
       ============================================ */

    .hover-lift {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .hover-glow:hover {
      animation: glow-pulse 1.5s infinite;
    }

    .hover-wiggle:hover {
      animation: wiggle 0.5s ease-in-out;
    }

    .hover-jello:hover {
      animation: jello 0.8s ease-in-out;
    }

    .candy-hover {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .candy-hover:hover {
      transform: scale(1.2) rotate(5deg);
      filter: brightness(1.3) drop-shadow(0 0 10px currentColor);
    }

    .candy-hover:active {
      transform: scale(0.95);
    }

    /* ============================================
       🌟 3D TRANSFORMS & DEPTH
       ============================================ */

    .card-3d {
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-3d:hover {
      transform: rotateY(5deg) rotateX(-5deg) scale(1.05);
    }

    .shadow-3d {
      box-shadow:
        0 1px 2px rgba(0,0,0,0.07),
        0 2px 4px rgba(0,0,0,0.07),
        0 4px 8px rgba(0,0,0,0.07),
        0 8px 16px rgba(0,0,0,0.07),
        0 16px 32px rgba(0,0,0,0.07),
        0 32px 64px rgba(0,0,0,0.07);
    }

    /* ============================================
       🎨 MODERN BUTTON STYLES
       ============================================ */

    .modern-button {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .modern-button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .modern-button:hover::before {
      width: 300px;
      height: 300px;
    }

    .button-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .button-gradient::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%
      );
      transform: rotate(45deg);
      animation: shimmer 3s infinite;
    }

    /* ============================================
       💫 PARTICLE ENHANCEMENTS
       ============================================ */

    .particle-trail {
      position: absolute;
      pointer-events: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: radial-gradient(circle, currentColor 0%, transparent 70%);
      animation: particle-burst-explosion 1s ease-out forwards;
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
      animation: confetti-fall 3s ease-in forwards;
    }

    @keyframes confetti-fall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
    }

    /* ============================================
       🎪 LEVEL COMPLETE EFFECTS
       ============================================ */

    .celebration-burst {
      animation: scale-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .star-shine {
      animation: star-shine 1s ease-in-out infinite;
    }

    @keyframes star-shine {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
    }

    /* ============================================
       📱 MOBILE OPTIMIZATIONS
       ============================================ */

    @media (hover: none) and (pointer: coarse) {
      .hover-lift:active {
        transform: translateY(-4px) scale(0.98);
      }

      .candy-hover:active {
        transform: scale(1.1);
      }
    }
  `}</style>
);

const MatchGame = () => {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);

  // Game state
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(500);
  const [moves, setMoves] = useState(30);
  const [stars, setStars] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [specialsUsed, setSpecialsUsed] = useState(0);

  // Visual effects
  const [particles, setParticles] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const [shockWaves, setShockWaves] = useState([]);
  const [comboTexts, setComboTexts] = useState([]);
  const [starBursts, setStarBursts] = useState([]);
  const [powerUpIndicators, setPowerUpIndicators] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const boardRef = useRef(null);

  useEffect(() => {
    audioEngine.init();
    audioEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  const createParticles = (row, col, color, count = 12) => {
    const cellSize = 60;
    const x = col * cellSize + cellSize / 2;
    const y = row * cellSize + cellSize / 2;

    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}-${Math.random()}`,
        x, y, color, index: i, type: 'explosion'
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const createScorePopup = (points, row, col, isCombo = false, isSpecial = false) => {
    const cellSize = 60;
    const popup = {
      id: `score-${Date.now()}-${Math.random()}`,
      score: points,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize - 20,
      isCombo,
      isSpecial
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, 1200);
  };

  const createShockWave = (row, col, color = 'yellow') => {
    const cellSize = 60;
    const wave = {
      id: `wave-${Date.now()}`,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
      color
    };
    setShockWaves(prev => [...prev, wave]);
    setTimeout(() => {
      setShockWaves(prev => prev.filter(w => w.id !== wave.id));
    }, 600);
  };

  const createComboText = (comboLevel, row, col) => {
    const cellSize = 60;
    const text = {
      id: `combo-${Date.now()}`,
      combo: comboLevel,
      x: col * cellSize,
      y: row * cellSize - 40
    };
    setComboTexts(prev => [...prev, text]);
    setTimeout(() => {
      setComboTexts(prev => prev.filter(t => t.id !== text.id));
    }, 800);
  };

  const createStarBurst = (row, col) => {
    const cellSize = 60;
    const burst = {
      id: `burst-${Date.now()}`,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    };
    setStarBursts(prev => [...prev, burst]);
    setTimeout(() => {
      setStarBursts(prev => prev.filter(b => b.id !== burst.id));
    }, 800);
  };

  const createPowerUpIndicator = (type, row, col) => {
    const cellSize = 60;
    const indicator = {
      id: `powerup-${Date.now()}`,
      type,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    };
    setPowerUpIndicators(prev => [...prev, indicator]);
    setTimeout(() => {
      setPowerUpIndicators(prev => prev.filter(i => i.id !== indicator.id));
    }, 1000);
  };

  const processMatches = async (currentBoard, candyTypes) => {
    let workingBoard = currentBoard.map(row => row.map(cell => ({...cell})));
    let totalScoreGained = 0;
    let comboCount = 0;
    let continueProcessing = true;

    while (continueProcessing) {
      const matches = findAllMatches(workingBoard);
      if (matches.length === 0) {
        continueProcessing = false;
      } else {
        comboCount++;
        const matchBonus = matches.length * 10 + (comboCount > 1 ? comboCount * 20 : 0);
        totalScoreGained += matchBonus;

        audioEngine.playMatch(matches.length);

        if (comboCount > 1) {
          audioEngine.playCombo(comboCount);
          createComboText(comboCount, matches[0].row, matches[0].col);
        }

        if (matches.length >= 5) {
          audioEngine.playPowerUp();
        }

        // Create particles
        matches.forEach(match => {
          const candy = workingBoard[match.row][match.col];
          if (candy) {
            createParticles(match.row, match.col, CANDY_DATA[candy.type]?.particle || '#fff', candy.special ? 20 : 12);
            if (match.length >= 4 || candy.special) {
              createStarBurst(match.row, match.col);
            }
          }
        });

        createScorePopup(matchBonus, matches[0].row, matches[0].col, comboCount > 1, matches.length >= 5);
        createShockWave(matches[0].row, matches[0].col);

        workingBoard = removeAndFill(workingBoard, matches, candyTypes);
        setBoard(workingBoard);
        setCombo(comboCount);
        if (comboCount > maxCombo) setMaxCombo(comboCount);
        setIsAnimating(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsAnimating(false);
      }
    }

    // Hamle kontrolü ve otomatik shuffle
    const possibleMoves = findPossibleMoves(workingBoard);
    if (possibleMoves.length === 0 && moves > 0) {
      // Hamle yok! Tahtayı karıştır
      audioEngine.playSwap(); // Shuffle sesi
      setAchievements(prev => [...prev, {
        id: Date.now(),
        text: '🔄 Hamle kalmadı! Tahta karıştırılıyor...',
        type: 'shuffle'
      }]);

      await new Promise(resolve => setTimeout(resolve, 1000));
      workingBoard = shuffleBoard(workingBoard, candyTypes);
      setBoard(workingBoard);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTimeout(() => setCombo(0), 2000);
    return { finalBoard: workingBoard, scoreGained: totalScoreGained };
  };

  const handleSwap = async (row1, col1, row2, col2) => {
    if (isAnimating) return;

    audioEngine.playSwap();

    const newBoard = board.map(row => row.map(cell => ({...cell})));

    // Check for special candy activation
    let specialCells = [];
    if (newBoard[row1][col1].special) {
      const cells = activateSpecial(newBoard[row1][col1].special, row1, col1, newBoard);
      specialCells = [...cells];
      if (newBoard[row1][col1].special === 'striped') audioEngine.playPowerUp();
      if (newBoard[row1][col1].special === 'wrapped') audioEngine.playBomb();
      if (newBoard[row1][col1].special === 'rainbow') audioEngine.playRainbow();
      createShockWave(row1, col1);
    }
    if (newBoard[row2][col2].special) {
      const cells = activateSpecial(newBoard[row2][col2].special, row2, col2, newBoard);
      specialCells = [...specialCells, ...cells];
      if (newBoard[row2][col2].special === 'striped') audioEngine.playPowerUp();
      if (newBoard[row2][col2].special === 'wrapped') audioEngine.playBomb();
      if (newBoard[row2][col2].special === 'rainbow') audioEngine.playRainbow();
      createShockWave(row2, col2);
    }

    [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
    setBoard(newBoard);
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 250));
    setIsAnimating(false);

    if (specialCells.length > 0) {
      const specialScore = specialCells.length * 50;
      setScore(prev => prev + specialScore);
      createScorePopup(specialScore, row1, col1, false, true);
      setSpecialsUsed(prev => prev + 1);
      const cleanedBoard = removeAndFill(newBoard, [], WORLDS[selectedWorld].candyTypes, specialCells);
      setBoard(cleanedBoard);
      await new Promise(resolve => setTimeout(resolve, 400));
      const { finalBoard, scoreGained } = await processMatches(cleanedBoard, WORLDS[selectedWorld].candyTypes);
      setScore(prev => prev + scoreGained);
      setBoard(finalBoard);
    } else {
      const { finalBoard, scoreGained } = await processMatches(newBoard, WORLDS[selectedWorld].candyTypes);

      if (scoreGained > 0) {
        setScore(prev => prev + scoreGained);
        setBoard(finalBoard);

        if (combo >= 5) addAchievement('🔥 Combo Master! 5x Kombo!');
        if (scoreGained >= 100) addAchievement('💎 Mega Skor! +100 puan!');
        if (specialsUsed >= 3) addAchievement('⚡ Power-Up Pro! 3 özel şeker!');
      } else {
        setBoard(board);
      }
    }

    setMoves(prev => {
      const newMoves = prev - 1;
      if (newMoves <= 0) setTimeout(checkLevelEnd, 500);
      return newMoves;
    });

    setSelected(null);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || levelComplete || isAnimating) return;
    if (selected === null) {
      setSelected({ row, col });
    } else {
      const rowDiff = Math.abs(selected.row - row);
      const colDiff = Math.abs(selected.col - col);
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        handleSwap(selected.row, selected.col, row, col);
      } else {
        setSelected({ row, col });
      }
    }
  };

  const addAchievement = (text) => {
    const achievement = { id: Date.now(), text };
    setAchievements(prev => [...prev, achievement]);
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 3000);
  };

  const checkLevelEnd = () => {
    if (score >= targetScore) {
      const earnedStars = score >= targetScore * 1.5 ? 3 : score >= targetScore * 1.2 ? 2 : 1;
      setStars(earnedStars);
      setLevelComplete(true);
      setTotalScore(prev => prev + score);
      if (currentLevel === unlockedLevels) {
        setUnlockedLevels(prev => prev + 1);
      }
      audioEngine.playLevelComplete();
      addAchievement('🎉 Seviye Tamamlandı!');
      if (maxCombo >= 7) {
        addAchievement('🏆 Efsane Kombo! 7x+');
      }
    } else {
      setGameOver(true);
    }
  };

  const startLevel = (world, level) => {
    setSelectedWorld(world);
    setCurrentLevel(level);
    setScore(0);
    setMoves(30);
    setTargetScore(500 + (level - 1) * 100);
    setStars(0);
    setGameOver(false);
    setLevelComplete(false);
    setCombo(0);
    setMaxCombo(0);
    setSpecialsUsed(0);
    setParticles([]);
    setScorePopups([]);
    setShockWaves([]);
    setComboTexts([]);
    setStarBursts([]);
    setPowerUpIndicators([]);
    setAchievements([]);
    setBoard(createBoard(WORLDS[world].candyTypes));
    setCurrentScreen('game');
  };

  const nextLevel = () => {
    const world = WORLDS[selectedWorld];
    const nextLevelNum = currentLevel + 1;
    if (nextLevelNum <= world.startLevel + world.levels - 1) {
      startLevel(selectedWorld, nextLevelNum);
    } else {
      setCurrentScreen('map');
    }
  };

  useEffect(() => {
    if (board.length > 0 && !isAnimating && !gameOver && !levelComplete) {
      const matches = findAllMatches(board);
      if (matches.length > 0) {
        processMatches(board, WORLDS[selectedWorld]?.candyTypes || []);
      }
    }
  }, [board]);

  // LOBBY SCREEN
  if (currentScreen === 'lobby') {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
        <GameStyles />
        <div className="glass-card-white rounded-3xl shadow-3d p-8 max-w-5xl w-full" style={{ animation: 'scale-in 0.5s ease-out' }}>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mb-4 shadow-lg hover-jello" style={{ animation: 'float-up-down 3s ease-in-out infinite' }}>
              <Sparkles className="text-white" size={64} style={{ animation: 'spin 4s linear infinite' }} />
            </div>
            <h1 className="text-6xl font-black mb-3" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              backgroundSize: '200% 200%',
              animation: 'rainbow-text 5s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Şeker Eşleştirme Pro
            </h1>
            <p className="text-gray-700 text-xl font-semibold mb-4" style={{ animation: 'fade-in 1s ease-out' }}>
              ✨ Macerana başlamak için bir dünya seç! ✨
            </p>
            <TotalScoreBadge totalScore={totalScore} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(WORLDS).map((world, index) => {
              const WorldIcon = world.icon;
              const isUnlocked = unlockedLevels >= world.startLevel;

              return (
                <button
                  key={world.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedWorld(world.id);
                      setCurrentScreen('map');
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`relative p-6 rounded-2xl transition-all duration-500 card-3d ${
                    isUnlocked
                      ? `bg-gradient-to-br ${world.bgGradient} hover-lift cursor-pointer shadow-lg`
                      : 'bg-gray-200 cursor-not-allowed opacity-50'
                  }`}
                  style={{
                    animation: `slide-in-bottom 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4" style={{ animation: 'wiggle 2s ease-in-out infinite' }}>
                      <Lock className="text-gray-500" size={32} />
                    </div>
                  )}

                  <div className={`mb-4 p-4 bg-gradient-to-br ${world.color} rounded-xl inline-block shadow-lg hover-wiggle`}>
                    <WorldIcon className="text-white" size={48} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{world.name}</h3>
                  <div className="text-sm text-white/90 font-semibold">
                    Seviye {world.startLevel} - {world.startLevel + world.levels - 1}
                  </div>

                  {isUnlocked && (
                    <div className="mt-4 flex justify-center gap-1">
                      {[...Array(world.levels)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i + world.startLevel <= unlockedLevels
                              ? 'bg-green-400 shadow-lg'
                              : 'bg-white/40'
                          }`}
                          style={{
                            animation: i + world.startLevel <= unlockedLevels
                              ? `glow-pulse 2s ease-in-out infinite ${i * 0.1}s`
                              : 'none'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center space-y-4">
            <UnlockedLevelsBadge unlockedLevels={unlockedLevels} />
            <div className="text-base text-gray-700 font-medium">
              <div className="flex justify-center gap-6 flex-wrap">
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white shadow-lg hover-lift" style={{ animation: 'float-up-down 3s ease-in-out infinite' }}>
                  ⚡ Özel Şekerler
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white shadow-lg hover-lift" style={{ animation: 'float-up-down 3s ease-in-out infinite 0.5s' }}>
                  🔥 Kombo Sistemi
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white shadow-lg hover-lift" style={{ animation: 'float-up-down 3s ease-in-out infinite 1s' }}>
                  🎵 Ses Efektleri
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAP SCREEN
  if (currentScreen === 'map' && selectedWorld) {
    const world = WORLDS[selectedWorld];
    const WorldIcon = world.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} p-4`} style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
      }}>
        <GameStyles />
        <div className="max-w-6xl mx-auto" style={{ animation: 'fade-in 0.5s ease-out' }}>
          <button
            onClick={() => setCurrentScreen('lobby')}
            className="mb-4 flex items-center gap-2 bg-white/95 px-5 py-3 rounded-xl shadow-lg hover-lift modern-button font-semibold text-gray-800"
          >
            <ArrowLeft size={20} />
            Dünyalara Dön
          </button>

          <div className="glass-card-white rounded-3xl shadow-3d p-8" style={{ animation: 'slide-in-bottom 0.6s ease-out' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-5 bg-gradient-to-br ${world.color} rounded-2xl shadow-xl hover-wiggle`} style={{ animation: 'float-up-down 3s ease-in-out infinite' }}>
                <WorldIcon className="text-white" size={56} />
              </div>
              <div>
                <h2 className="text-5xl font-black" style={{
                  background: `linear-gradient(135deg, ${world.color.split(' ')[1]} 0%, ${world.color.split(' ')[2]} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {world.name}
                </h2>
                <p className="text-gray-600 font-semibold mt-1">
                  🎯 {world.levels} Seviye Macerasını Tamamla
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {[...Array(world.levels)].map((_, i) => {
                const levelNum = world.startLevel + i;
                const isUnlocked = levelNum <= unlockedLevels;
                const isCompleted = levelNum < unlockedLevels;

                return (
                  <button
                    key={levelNum}
                    onClick={() => isUnlocked && startLevel(world.id, levelNum)}
                    disabled={!isUnlocked}
                    className={`relative aspect-square rounded-2xl transition-all duration-500 font-bold text-lg shadow-lg ${
                      isCompleted
                        ? `bg-gradient-to-br ${world.color} text-white hover-lift card-3d`
                        : isUnlocked
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white hover-lift card-3d'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      animation: isUnlocked && !isCompleted
                        ? `glow-pulse 2s ease-in-out infinite, bounce 2s ease-in-out infinite`
                        : isCompleted
                        ? `scale-in 0.3s ease-out ${i * 0.05}s both`
                        : 'none'
                    }}
                  >
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-1 shadow-lg star-shine">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-gray-400" size={24} style={{ animation: 'wiggle 2s ease-in-out infinite' }} />
                      </div>
                    )}
                    {(isUnlocked || isCompleted) && <span className="drop-shadow-lg">{levelNum}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  if (currentScreen === 'game' && selectedWorld) {
    const world = WORLDS[selectedWorld];
    const WorldIcon = world.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} flex items-center justify-center p-4`} style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
        animation: 'fade-in 0.5s ease-out'
      }}>
        <GameStyles />
        <div className="glass-card-white rounded-3xl shadow-3d p-6 max-w-4xl w-full relative" style={{ animation: 'scale-in 0.5s ease-out' }}>
          <AchievementToast achievements={achievements} />

          <div className="relative" ref={boardRef}>
            {particles.map(particle => <AdvancedParticle key={particle.id} {...particle} />)}
            {scorePopups.map(popup => <EnhancedScorePopup key={popup.id} {...popup} />)}
            {shockWaves.map(wave => <ShockWave key={wave.id} {...wave} />)}
            {comboTexts.map(text => <ComboText key={text.id} {...text} />)}
            {starBursts.map(burst => <StarBurst key={burst.id} {...burst} />)}
            {powerUpIndicators.map(indicator => <PowerUpIndicator key={indicator.id} {...indicator} />)}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentScreen('map')}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-xl hover-lift modern-button font-semibold text-gray-800 shadow-lg"
            >
              <ArrowLeft size={18} />
              Harita
            </button>

            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-white/80 to-white/60 rounded-xl shadow-lg">
              <div className={`p-2 bg-gradient-to-br ${world.color} rounded-lg shadow-md hover-wiggle`}>
                <WorldIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{
                  background: `linear-gradient(135deg, ${world.color.split(' ')[1]} 0%, ${world.color.split(' ')[2]} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {world.name}
                </h2>
                <p className="text-xs text-gray-600 font-semibold">Seviye {currentLevel}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-xl transition-all duration-300 shadow-lg hover-lift modern-button ${
                  soundEnabled
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                }`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                onClick={() => startLevel(selectedWorld, currentLevel)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover-lift modern-button shadow-lg font-semibold"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <ScoreCard score={score} />
            <MovesCard moves={moves} />
            <ComboCard combo={combo} />
            <SpecialsCard specialsUsed={specialsUsed} />
          </div>

          <ProgressBar score={score} targetScore={targetScore} worldColor={world.color} />
          <ComboIndicator combo={combo} worldColor={world.color} />

          {levelComplete && (
            <LevelCompleteModal
              stars={stars}
              score={score}
              maxCombo={maxCombo}
              specialsUsed={specialsUsed}
              worldColor={world.color}
              onNext={nextLevel}
            />
          )}

          {gameOver && (
            <GameOverModal
              score={score}
              targetScore={targetScore}
              maxCombo={maxCombo}
              onRetry={() => startLevel(selectedWorld, currentLevel)}
            />
          )}

          <div className="rounded-3xl p-4 shadow-3d overflow-hidden relative" style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              {board.map((row, i) =>
                row.map((candy, j) => {
                  const isSelected = selected?.row === i && selected?.col === j;
                  return (
                    <div
                      key={candy.id}
                      onClick={() => handleCellClick(i, j)}
                      className={`flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 aspect-square relative candy-hover ${
                        isSelected ? 'bg-yellow-400/40' : 'bg-purple-900/30 hover:bg-purple-800/50'
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? '0 0 25px rgba(255, 215, 0, 0.9), inset 0 0 20px rgba(255, 215, 0, 0.3)'
                          : 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                        animation: isSelected ? 'glow-pulse 1s ease-in-out infinite' : 'none'
                      }}
                    >
                      <Candy
                        type={candy.type}
                        special={candy.special}
                        isSelected={isSelected}
                        worldId={selectedWorld}
                      />
                      {candy.special && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full p-1 shadow-lg" style={{ animation: 'spin 3s linear infinite' }}>
                          {candy.special === 'striped' && <Zap size={12} className="text-white" />}
                          {candy.special === 'wrapped' && <Bomb size={12} className="text-white" />}
                          {candy.special === 'rainbow' && <Star size={12} className="text-white" />}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <PowerUpLegend />
          <TargetInfo score={score} targetScore={targetScore} />
        </div>
      </div>
    );
  }

  return null;
};

export default MatchGame;
