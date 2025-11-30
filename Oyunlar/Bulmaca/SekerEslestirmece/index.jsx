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
      0% { transform: translateY(0) scale(0.3); opacity: 0; }
      30% { transform: translateY(-20px) scale(1.3); opacity: 1; }
      70% { transform: translateY(-50px) scale(1.1); opacity: 1; }
      100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
    }
    @keyframes shockwave {
      0% { transform: scale(0.3); opacity: 1; }
      100% { transform: scale(3); opacity: 0; }
    }
    @keyframes combo-bounce {
      0% { transform: scale(0) rotate(-10deg); opacity: 0; }
      50% { transform: scale(1.3) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes star-ray {
      0% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 1; }
      50% { transform: rotate(var(--angle, 0deg)) scaleY(1.5); opacity: 0.8; }
      100% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 0; }
    }
    @keyframes candy-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes special-glow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.3) drop-shadow(0 0 20px currentColor); }
    }
    @keyframes power-up-float {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
      100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
        <GameStyles />
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl w-full">
          <div className="text-center mb-8">
            <Sparkles className="inline-block text-purple-600 mb-4" size={64} style={{ animation: 'spin 4s linear infinite' }} />
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Şeker Eşleştirme Pro
            </h1>
            <p className="text-gray-600 text-lg">Macerana başlamak için bir dünya seç!</p>
            <TotalScoreBadge totalScore={totalScore} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(WORLDS).map((world) => {
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
                  className={`relative p-6 rounded-2xl transition-all duration-300 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${world.bgGradient} hover:scale-105 hover:shadow-2xl cursor-pointer`
                      : 'bg-gray-200 cursor-not-allowed opacity-50'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="text-gray-500" size={32} />
                    </div>
                  )}

                  <div className={`mb-4 p-4 bg-gradient-to-br ${world.color} rounded-xl inline-block`}>
                    <WorldIcon className="text-white" size={48} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{world.name}</h3>
                  <div className="text-xs text-gray-600 font-semibold">
                    Seviye {world.startLevel} - {world.startLevel + world.levels - 1}
                  </div>

                  {isUnlocked && (
                    <div className="mt-4 flex justify-center gap-1">
                      {[...Array(world.levels)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i + world.startLevel <= unlockedLevels ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center space-y-3">
            <UnlockedLevelsBadge unlockedLevels={unlockedLevels} />
            <div className="text-sm text-gray-600">
              <div className="flex justify-center gap-4">
                <span>⚡ Özel Şekerler</span>
                <span>🔥 Kombo Sistemi</span>
                <span>🎵 Ses Efektleri</span>
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
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} p-4`}>
        <GameStyles />
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentScreen('lobby')}
            className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
            Dünyalara Dön
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 bg-gradient-to-br ${world.color} rounded-2xl`}>
                <WorldIcon className="text-white" size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-800">{world.name}</h2>
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
                    className={`relative aspect-square rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg ${
                      isCompleted
                        ? `bg-gradient-to-br ${world.color} text-white hover:scale-110 shadow-xl`
                        : isUnlocked
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white hover:scale-110 shadow-xl animate-pulse'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-gray-400" size={24} />
                      </div>
                    )}
                    {(isUnlocked || isCompleted) && <span>{levelNum}</span>}
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
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} flex items-center justify-center p-4`}>
        <GameStyles />
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-4xl w-full relative">
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
              className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              <ArrowLeft size={18} />
              Harita
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-br ${world.color} rounded-lg`}>
                <WorldIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{world.name}</h2>
                <p className="text-xs text-gray-600">Seviye {currentLevel}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition ${soundEnabled ? 'bg-purple-100 hover:bg-purple-200' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {soundEnabled ? <Volume2 size={20} className="text-purple-600" /> : <VolumeX size={20} className="text-gray-600" />}
              </button>
              <button
                onClick={() => startLevel(selectedWorld, currentLevel)}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
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

          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-3 shadow-2xl overflow-hidden relative">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              {board.map((row, i) =>
                row.map((candy, j) => (
                  <div
                    key={candy.id}
                    onClick={() => handleCellClick(i, j)}
                    className="flex items-center justify-center bg-purple-800/30 rounded-lg cursor-pointer hover:bg-purple-700/50 transition-all aspect-square relative"
                    style={{
                      boxShadow: selected?.row === i && selected?.col === j ? '0 0 20px rgba(255,215,0,0.8)' : 'none'
                    }}
                  >
                    <Candy
                      type={candy.type}
                      special={candy.special}
                      isSelected={selected && selected.row === i && selected.col === j}
                      worldId={selectedWorld}
                    />
                    {candy.special && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
                        {candy.special === 'striped' && <Zap size={12} className="text-white" />}
                        {candy.special === 'wrapped' && <Bomb size={12} className="text-white" />}
                        {candy.special === 'rainbow' && <Star size={12} className="text-white" />}
                      </div>
                    )}
                  </div>
                ))
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
