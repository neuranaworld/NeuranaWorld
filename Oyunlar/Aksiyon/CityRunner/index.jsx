import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Coins, Star, Target, Zap, Award } from 'lucide-react';

// Core imports
import { Physics } from './core/Physics.js';
import { Collision } from './core/Collision.js';

// Entity imports
import { PlayerRenderer } from './entities/Player.js';
import { ObstacleRenderer } from './entities/Obstacles.js';
import { CoinRenderer, PowerUpRenderer } from './entities/Collectibles.js';

// System imports
import { SpawnSystem } from './systems/SpawnSystem.js';
import { ScoreSystem, DistanceTracker } from './systems/ScoreSystem.js';
import { MissionSystem } from './systems/MissionSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';

// Rendering imports
import { BackgroundRenderer } from './rendering/Background.js';
import { ParticleSystem } from './rendering/ParticleSystem.js';

// Utils imports
import { GAME_CONFIG, PLAYER_CONFIG, POWERUP_CONFIG, MAGNET_RANGE, MAGNET_PULL_SPEED } from './utils/Config.js';
import { Storage } from './utils/Storage.js';

const CityRunner = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Game state
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [level, setLevel] = useState(1);
  const [character] = useState('runner');

  // Mission and achievements
  const [mission, setMission] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Systems ref
  const systemsRef = useRef({
    scoreSystem: new ScoreSystem(),
    distanceTracker: new DistanceTracker(),
    missionSystem: new MissionSystem(),
    achievementSystem: null,
    particleSystem: new ParticleSystem(),
    backgroundRenderer: new BackgroundRenderer(),
  });

  // Game ref
  const gameRef = useRef({
    player: {
      lane: PLAYER_CONFIG.INITIAL_LANE,
      y: GAME_CONFIG.GROUND_Y,
      velocityY: 0,
      width: PLAYER_CONFIG.WIDTH,
      height: PLAYER_CONFIG.HEIGHT,
      isJumping: false,
      isDucking: false,
      gravity: PLAYER_CONFIG.GRAVITY,
      jumpStrength: PLAYER_CONFIG.JUMP_STRENGTH,
      animFrame: 0,
      rotation: 0
    },
    obstacles: [],
    coins: [],
    powerUps: [],
    speed: GAME_CONFIG.BASE_SPEED,
    baseSpeed: GAME_CONFIG.BASE_SPEED,
    frame: 0,
    shake: 0,
    boost: 1,
    trail: [],
    animationId: null,
    shield: false,
    magnet: false,
    doubleCoins: false,
    invincible: false,
    canvas: null,
    ctx: null,
  });

  // Initialize on mount
  useEffect(() => {
    const savedBest = Storage.getBestScore();
    const savedCoins = Storage.getTotalCoins();
    const savedAchievements = Storage.getAchievements();

    setBestScore(savedBest);
    setTotalCoins(savedCoins);
    setAchievements(savedAchievements);

    systemsRef.current.achievementSystem = new AchievementSystem(savedAchievements);
    systemsRef.current.missionSystem.generateMission();
    setMission(systemsRef.current.missionSystem.getCurrentMission());
  }, []);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      const newBest = Storage.updateBestScoreIfNeeded(score, bestScore);
      setBestScore(newBest);
    }
  }, [score, bestScore]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    gameRef.current.canvas = canvas;
    gameRef.current.ctx = ctx;

    initGame();

    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, []);

  const initGame = () => {
    gameRef.current.player = {
      lane: PLAYER_CONFIG.INITIAL_LANE,
      y: GAME_CONFIG.GROUND_Y,
      velocityY: 0,
      width: PLAYER_CONFIG.WIDTH,
      height: PLAYER_CONFIG.HEIGHT,
      isJumping: false,
      isDucking: false,
      gravity: PLAYER_CONFIG.GRAVITY,
      jumpStrength: PLAYER_CONFIG.JUMP_STRENGTH,
      animFrame: 0,
      rotation: 0
    };
    gameRef.current.obstacles = [];
    gameRef.current.coins = [];
    gameRef.current.powerUps = [];
    gameRef.current.speed = GAME_CONFIG.BASE_SPEED;
    gameRef.current.baseSpeed = GAME_CONFIG.BASE_SPEED;
    gameRef.current.frame = 0;
    gameRef.current.shake = 0;
    gameRef.current.boost = 1;
    gameRef.current.trail = [];
    gameRef.current.shield = false;
    gameRef.current.magnet = false;
    gameRef.current.doubleCoins = false;
    gameRef.current.invincible = false;

    systemsRef.current.scoreSystem.reset();
    systemsRef.current.distanceTracker.reset();
    systemsRef.current.particleSystem.clear();
    systemsRef.current.backgroundRenderer.reset();
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, obstacles, coins, powerUps, canvas, ctx, frame, speed } = gameRef.current;
    const { scoreSystem, distanceTracker, missionSystem, achievementSystem, particleSystem, backgroundRenderer } = systemsRef.current;

    // Screen shake
    if (gameRef.current.shake > 0) {
      ctx.save();
      ctx.translate(
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2,
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2
      );
      gameRef.current.shake *= 0.9;
    }

    // Draw background
    backgroundRenderer.draw(ctx, canvas, frame, speed, gameRef.current.boost);

    // Update player physics
    const { landed } = Physics.updatePlayer(player);
    if (landed) {
      particleSystem.create(GAME_CONFIG.LANES[player.lane], player.y, '#9ca3af', 5);
    }

    // Combo timer update
    scoreSystem.updateComboTimer();

    // Spawn system
    SpawnSystem.update(frame, level, {
      obstacles,
      coins,
      powerUps
    });

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed * gameRef.current.boost;
      ObstacleRenderer.draw(ctx, obstacles[i], GAME_CONFIG.LANES, GAME_CONFIG.GROUND_Y, frame);

      if (Collision.checkObstacleCollision(player, obstacles[i], GAME_CONFIG.LANES, GAME_CONFIG.GROUND_Y)) {
        if (gameRef.current.shield) {
          gameRef.current.shield = false;
          setPowerUp(null);
          particleSystem.create(GAME_CONFIG.LANES[obstacles[i].lane], GAME_CONFIG.GROUND_Y - 30, '#3b82f6', 20);
          obstacles.splice(i, 1);
        } else if (gameRef.current.invincible) {
          particleSystem.create(GAME_CONFIG.LANES[obstacles[i].lane], GAME_CONFIG.GROUND_Y - 30, '#a855f7', 20);
          obstacles.splice(i, 1);
          setScore(s => s + ScoreSystem.calculateDestroyPoints());
        } else {
          gameRef.current.shake = 10;
          particleSystem.create(GAME_CONFIG.LANES[player.lane], player.y - player.height / 2, '#ef4444', 30);
          setGameState('gameOver');
        }
      }

      if (!obstacles[i]?.passed && Collision.isObstaclePassed(obstacles[i], player.lane, GAME_CONFIG.LANES)) {
        obstacles[i].passed = true;
        setScore(s => s + ScoreSystem.calculateObstaclePoints());
        scoreSystem.increaseCombo();
        const newCombo = scoreSystem.combo;

        missionSystem.updateProgress('combo', 1);
        setMission(missionSystem.getCurrentMission());

        const unlockedAchievements = achievementSystem.checkAchievements('combo', newCombo);
        if (unlockedAchievements.length > 0) {
          setAchievements(achievementSystem.getUnlocked());
          Storage.saveAchievements(achievementSystem.getUnlocked());
        }
      }
    }

    // Update and draw coins
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].x -= speed * gameRef.current.boost;

      // Magnet effect
      if (gameRef.current.magnet) {
        const playerX = GAME_CONFIG.LANES[player.lane];
        const dx = playerX - GAME_CONFIG.LANES[coins[i].lane];
        const dy = (player.y - player.height / 2) - coins[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNET_RANGE) {
          coins[i].lane = player.lane;
          coins[i].y += dy / dist * MAGNET_PULL_SPEED;
        }
      }

      CoinRenderer.draw(ctx, coins[i], GAME_CONFIG.LANES, frame);

      if (Collision.checkCoinCollection(player, coins[i], GAME_CONFIG.LANES)) {
        const { points, coinValue } = ScoreSystem.calculateCoinPoints(gameRef.current.doubleCoins);
        setCoins(c => c + coinValue);
        const newTotal = Storage.addCoins(coinValue);
        setTotalCoins(newTotal);
        setScore(s => s + points);
        scoreSystem.increaseCombo();
        particleSystem.create(GAME_CONFIG.LANES[coins[i].lane], coins[i].y, '#fbbf24', 15);
        coins.splice(i, 1);

        const completed = missionSystem.updateProgress('coins', coinValue);
        if (completed) {
          const { reward, newMission } = missionSystem.completeMission();
          setScore(s => s + reward);
          Storage.addCoins(reward);
          setMission(newMission);
        }

        const totalCoinsCollected = Storage.getTotalCoins();
        const unlockedAchievements = achievementSystem.checkAchievements('coins', totalCoinsCollected);
        if (unlockedAchievements.length > 0) {
          setAchievements(achievementSystem.getUnlocked());
          Storage.saveAchievements(achievementSystem.getUnlocked());
        }
      }
    }

    // Update and draw power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].x -= speed * gameRef.current.boost;
      PowerUpRenderer.draw(ctx, powerUps[i], GAME_CONFIG.LANES, frame);

      if (Collision.checkPowerUpCollection(player, powerUps[i], GAME_CONFIG.LANES)) {
        const type = powerUps[i].type;
        const color = POWERUP_CONFIG.COLORS[type].main;

        particleSystem.create(GAME_CONFIG.LANES[powerUps[i].lane], powerUps[i].y, color, 25);
        setPowerUp({ type, time: Date.now() });

        if (type === 'shield') {
          gameRef.current.shield = true;
          setTimeout(() => { gameRef.current.shield = false; setPowerUp(null); }, POWERUP_CONFIG.DURATION.shield);
        } else if (type === 'magnet') {
          gameRef.current.magnet = true;
          setTimeout(() => { gameRef.current.magnet = false; setPowerUp(null); }, POWERUP_CONFIG.DURATION.magnet);
        } else if (type === 'doubleCoins') {
          gameRef.current.doubleCoins = true;
          setTimeout(() => { gameRef.current.doubleCoins = false; setPowerUp(null); }, POWERUP_CONFIG.DURATION.doubleCoins);
        } else if (type === 'boost') {
          gameRef.current.boost = 2;
          setTimeout(() => { gameRef.current.boost = 1; setPowerUp(null); }, POWERUP_CONFIG.DURATION.boost);
        } else if (type === 'invincible') {
          gameRef.current.invincible = true;
          setTimeout(() => { gameRef.current.invincible = false; setPowerUp(null); }, POWERUP_CONFIG.DURATION.invincible);
        }

        powerUps.splice(i, 1);

        const completed = missionSystem.updateProgress('powerups', 1);
        if (completed) {
          const { reward, newMission } = missionSystem.completeMission();
          setScore(s => s + reward);
          Storage.addCoins(reward);
          setMission(newMission);
        }
      }
    }

    // Draw particles and player
    particleSystem.update(ctx);

    // Update trail
    if (gameRef.current.boost > 1 || gameRef.current.invincible) {
      const x = GAME_CONFIG.LANES[player.lane];
      const y = player.y - player.height;
      PlayerRenderer.updateTrail(gameRef.current.trail, x, y + player.height / 2);
    }

    PlayerRenderer.draw(
      ctx,
      player,
      GAME_CONFIG.LANES,
      {
        boost: gameRef.current.boost,
        shield: gameRef.current.shield,
        invincible: gameRef.current.invincible
      },
      gameRef.current.trail,
      GAME_CONFIG.GROUND_Y,
      character
    );

    // Increase speed gradually
    if (frame % GAME_CONFIG.SPEED_INCREASE_INTERVAL === 0) {
      const maxSpeed = GAME_CONFIG.MAX_SPEED;
      const baseSpeed = gameRef.current.baseSpeed;
      const increment = GAME_CONFIG.SPEED_INCREMENT;
      gameRef.current.speed = Math.min(
        maxSpeed,
        baseSpeed + Math.floor(frame / GAME_CONFIG.SPEED_INCREASE_INTERVAL) * increment
      );
      setLevel(l => l + 1);
    }

    // Update distance
    distanceTracker.increase();
    if (distanceTracker.distance % 100 === 0) {
      const meters = distanceTracker.getMeters();
      const unlockedAchievements = achievementSystem.checkAchievements('distance', meters);
      if (unlockedAchievements.length > 0) {
        setAchievements(achievementSystem.getUnlocked());
        Storage.saveAchievements(achievementSystem.getUnlocked());
      }
    }
    if (distanceTracker.distance % 10 === 0) {
      const completed = missionSystem.updateProgress('distance', 1);
      if (completed) {
        const { reward, newMission } = missionSystem.completeMission();
        setScore(s => s + reward);
        Storage.addCoins(reward);
        setMission(newMission);
      }
    }

    if (gameRef.current.shake > 0) {
      ctx.restore();
    }

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, level, character]);

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.animationId = requestAnimationFrame(updateGame);
    }
    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState, updateGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      const player = gameRef.current.player;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        player.lane = Math.max(0, player.lane - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        player.lane = Math.min(2, player.lane + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        const jumped = Physics.jump(player);
        if (jumped) {
          const completed = systemsRef.current.missionSystem.updateProgress('jump', 1);
          if (completed) {
            const { reward, newMission } = systemsRef.current.missionSystem.completeMission();
            setScore(s => s + reward);
            Storage.addCoins(reward);
            setMission(newMission);
          }
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const ducked = Physics.duck(player);
        if (ducked) {
          setTimeout(() => {
            Physics.unduck(player);
          }, PLAYER_CONFIG.DUCK_DURATION);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setCoins(0);
    setPowerUp(null);
    setLevel(1);
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setCoins(0);
    setPowerUp(null);
    setLevel(1);
    initGame();
    setGameState('ready');
  };

  const distance = systemsRef.current.distanceTracker.getMeters();
  const combo = systemsRef.current.scoreSystem.combo;
  const maxCombo = systemsRef.current.scoreSystem.maxCombo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">🏃‍♂️ City Runner</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-blue-300">
            <div className="text-blue-100 text-xs mb-1 font-semibold">SKOR</div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-green-300">
            <div className="text-green-100 text-xs mb-1 font-semibold">MESAFE</div>
            <div className="text-3xl font-bold text-white">{distance}m</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-yellow-300">
            <div className="text-yellow-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Coins className="w-4 h-4" /> COIN
            </div>
            <div className="text-3xl font-bold text-white">{coins}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-purple-300">
            <div className="text-purple-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Zap className="w-4 h-4" /> KOMBO
            </div>
            <div className="text-3xl font-bold text-white">{combo}x</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-pink-300">
            <div className="text-pink-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> EN İYİ
            </div>
            <div className="text-3xl font-bold text-white">{bestScore}</div>
          </div>
        </div>

        {mission && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl mb-4 shadow-lg border-2 border-orange-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <div className="font-bold">{mission.icon} {mission.desc}</div>
                  <div className="text-sm opacity-90">
                    İlerleme: {mission.progress} / {mission.target}
                  </div>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg font-bold">
                +{mission.reward} 💰
              </div>
            </div>
            <div className="mt-2 bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {powerUp && (
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-xl mb-4 text-center font-bold shadow-lg animate-pulse border-2 border-purple-300">
            ⚡ Power-Up Aktif: {
              powerUp.type === 'shield' ? '🛡️ Kalkan' :
              powerUp.type === 'magnet' ? '🧲 Mıknatıs' :
              powerUp.type === 'doubleCoins' ? '💰 2x Coin' :
              powerUp.type === 'boost' ? '⚡ Hız Boost' :
              '✨ Yenilmez'
            }
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl border-2 border-white/30">
          <canvas ref={canvasRef} width={900} height={550}
            className="w-full rounded-xl shadow-inner" />
        </div>

        <div className="flex gap-4 mt-6">
          {gameState === 'ready' && (
            <button onClick={startGame}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all">
              <Play className="w-6 h-6" /> Başlat
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused') && (
            <button onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all">
              {gameState === 'playing' ? <><Pause className="w-6 h-6" /> Duraklat</> : <><Play className="w-6 h-6" /> Devam</>}
            </button>
          )}
        </div>

        {gameState === 'gameOver' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 max-w-lg text-center shadow-2xl border-4 border-white/50 animate-[slideIn_0.3s_ease-out]">
              <div className="text-7xl mb-4 animate-bounce">💥</div>
              <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Oyun Bitti!</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Skor</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Mesafe</div>
                  <div className="text-3xl font-bold text-white">{distance}m</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-yellow-300 text-sm mb-1">Coin</div>
                  <div className="text-3xl font-bold text-yellow-300">{coins}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-purple-300 text-sm mb-1">Max Kombo</div>
                  <div className="text-3xl font-bold text-purple-300">{maxCombo}x</div>
                </div>
              </div>

              {score === bestScore && score > 0 && (
                <div className="bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-xl mb-6 text-xl animate-pulse">
                  🏆 YENİ REKOR!
                </div>
              )}

              <button onClick={startGame}
                className="w-full bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-all">
                🔄 Tekrar Oyna
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" /> Kontroller
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">← →</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">A D</kbd>
                <span>Şerit değiştir</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">↑</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">W Space</kbd>
                <span>Zıpla</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">↓</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">S</kbd>
                <span>Eğil</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-300" /> Power-ups
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="bg-blue-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Kalkan - Bir çarpışmayı önle (7sn)</span>
              </div>
              <div className="bg-purple-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🧲</span>
                <span>Mıknatıs - Coinleri çek (7sn)</span>
              </div>
              <div className="bg-green-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span>2x Coin - Çift kazanç (7sn)</span>
              </div>
              <div className="bg-orange-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Boost - 2x Hız (5sn)</span>
              </div>
              <div className="bg-pink-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Yenilmez - Engelleri yok et (6sn)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white border-2 border-indigo-300">
          <h3 className="text-xl font-bold mb-3">📊 İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Toplam Coin</div>
              <div className="text-2xl font-bold">{totalCoins}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Seviye</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Max Kombo</div>
              <div className="text-2xl font-bold">{maxCombo}x</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Başarılar</div>
              <div className="text-2xl font-bold">{achievements.length}/{systemsRef.current.achievementSystem?.getTotalCount() || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityRunner;
