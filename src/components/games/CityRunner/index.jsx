import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Coins, Star, Target, Zap, Award } from 'lucide-react';

// Constants
import { GAME_CONFIG } from './constants/gameConfig';
import { MISSIONS, generateRandomMission } from './constants/missions';
import { CHARACTERS, DEFAULT_CHARACTER } from './constants/characters';

// Classes
import { Player } from './classes/Player';

// Utils
import { checkCollision, checkCircleCollision } from './utils/collision';
import { calculateScore } from './utils/scoreCalculator';
import { createObstacle, createCoin, createPowerUp, createParticle, initBuildings, initClouds } from './utils/spawner';
import { drawPlayer, drawObstacle, drawCoin, drawPowerUp, drawParticles, drawBackground } from './utils/renderer';

const CityRunner = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [mission, setMission] = useState(null);
  const [character, setCharacter] = useState(DEFAULT_CHARACTER);

  const gameRef = useRef({
    player: new Player(),
    lanes: GAME_CONFIG.LANES,
    obstacles: [],
    coins: [],
    powerUps: [],
    particles: [],
    buildings: [],
    clouds: [],
    speed: GAME_CONFIG.BASE_SPEED,
    baseSpeed: GAME_CONFIG.BASE_SPEED,
    frame: 0,
    groundY: GAME_CONFIG.PLAYER.GROUND_Y,
    comboTimer: 0,
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

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('cityrunner-best');
    const savedCoins = localStorage.getItem('cityrunner-total-coins');
    const savedAchievements = localStorage.getItem('cityrunner-achievements');

    if (saved) setBestScore(parseInt(saved));
    if (savedCoins) setTotalCoins(parseInt(savedCoins));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    setMission(generateRandomMission());
  }, []);

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('cityrunner-best', score.toString());
    }
  }, [score, bestScore]);

  // Initialize canvas
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
    gameRef.current.player.reset();
    gameRef.current.obstacles = [];
    gameRef.current.coins = [];
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
    gameRef.current.buildings = initBuildings();
    gameRef.current.clouds = initClouds();
    gameRef.current.speed = GAME_CONFIG.BASE_SPEED;
    gameRef.current.baseSpeed = GAME_CONFIG.BASE_SPEED;
    gameRef.current.frame = 0;
    gameRef.current.comboTimer = 0;
    gameRef.current.shake = 0;
    gameRef.current.boost = 1;
    gameRef.current.trail = [];
    gameRef.current.shield = false;
    gameRef.current.magnet = false;
    gameRef.current.doubleCoins = false;
    gameRef.current.invincible = false;
  };

  const updateCombo = () => {
    setCombo(c => {
      const newCombo = c + 1;
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
        checkAchievement('combo', newCombo);
      }
      return newCombo;
    });
    gameRef.current.comboTimer = GAME_CONFIG.COMBO.TIME_WINDOW;
  };

  const checkAchievement = (type, value) => {
    const newAchievements = [...achievements];
    let unlocked = false;

    if (type === 'combo' && value >= 10 && !achievements.includes('combo10')) {
      newAchievements.push('combo10');
      unlocked = true;
      console.log('🏆 Başarı: 10x Kombo!');
    }
    if (type === 'distance' && value >= 1000 && !achievements.includes('distance1000')) {
      newAchievements.push('distance1000');
      unlocked = true;
      console.log('🏆 Başarı: 1000m Koşu!');
    }
    if (type === 'coins' && value >= 100 && !achievements.includes('coins100')) {
      newAchievements.push('coins100');
      unlocked = true;
      console.log('🏆 Başarı: 100 Coin!');
    }

    if (unlocked) {
      setAchievements(newAchievements);
      localStorage.setItem('cityrunner-achievements', JSON.stringify(newAchievements));
    }
  };

  const checkCoinCollection = (player, coin) => {
    const lanes = gameRef.current.lanes;
    if (Math.abs(player.lane - coin.lane) > 0.5) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y - player.height / 2;
    const dist = Math.hypot(playerX - lanes[coin.lane], playerY - coin.y);

    return dist < player.width / 2 + coin.radius + 20;
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, obstacles, coins, powerUps, lanes, canvas, ctx, frame, speed } = gameRef.current;

    // Screen shake
    if (gameRef.current.shake > 0) {
      ctx.save();
      ctx.translate(
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2,
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2
      );
      gameRef.current.shake *= 0.9;
    }

    drawBackground(ctx, canvas, gameRef.current);

    // Update player
    player.update();

    // Animation frame
    player.animFrame++;

    // Combo timer
    if (gameRef.current.comboTimer > 0) {
      gameRef.current.comboTimer--;
      if (gameRef.current.comboTimer === 0) {
        setCombo(0);
      }
    }

    // Spawn obstacles
    if (frame % Math.max(60 - level * 5, 30) === 0) {
      obstacles.push(createObstacle());
    }

    // Spawn coins
    if (frame % 50 === 0) {
      const newCoins = createCoin(gameRef.current.groundY);
      coins.push(...newCoins);
    }

    // Spawn power-ups
    if (frame % 400 === 0) {
      powerUps.push(createPowerUp(gameRef.current.groundY));
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed * gameRef.current.boost;
      drawObstacle(ctx, obstacles[i], lanes, gameRef.current);

      if (checkCollision(player.getBounds(),
          { x: lanes[obstacles[i].lane], y: gameRef.current.groundY,
            width: obstacles[i].width, height: obstacles[i].height })) {
        if (gameRef.current.shield) {
          gameRef.current.shield = false;
          setPowerUp(null);
          createParticle(lanes[obstacles[i].lane], gameRef.current.groundY - 30, '#3b82f6', 20, gameRef.current.particles);
          obstacles.splice(i, 1);
        } else if (gameRef.current.invincible) {
          createParticle(lanes[obstacles[i].lane], gameRef.current.groundY - 30, '#a855f7', 20, gameRef.current.particles);
          obstacles.splice(i, 1);
          setScore(s => s + 50);
        } else {
          gameRef.current.shake = 10;
          createParticle(lanes[player.lane], player.y - player.height / 2, '#ef4444', 30, gameRef.current.particles);
          setGameState('gameOver');
        }
      }

      if (!obstacles[i]?.passed && obstacles[i]?.x < lanes[player.lane] - 50) {
        obstacles[i].passed = true;
        setScore(s => s + 10);
        updateCombo();
      }

      if (obstacles[i] && obstacles[i].x < -100) {
        obstacles.splice(i, 1);
      }
    }

    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].x -= speed * gameRef.current.boost;

      if (gameRef.current.magnet) {
        const playerX = lanes[player.lane];
        const dx = playerX - lanes[coins[i].lane];
        const dy = (player.y - player.height / 2) - coins[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          coins[i].lane = player.lane;
          const magnetSpeed = 8;
          coins[i].y += dy / dist * magnetSpeed;
        }
      }

      drawCoin(ctx, coins[i], lanes, frame);

      if (checkCoinCollection(player, coins[i])) {
        const coinValue = gameRef.current.doubleCoins ? 2 : 1;
        setCoins(c => c + coinValue);
        setTotalCoins(tc => tc + coinValue);
        setScore(s => s + 5 * coinValue);
        updateCombo();
        createParticle(lanes[coins[i].lane], coins[i].y, '#fbbf24', 15, gameRef.current.particles);
        coins.splice(i, 1);

        if (mission?.type === 'coins') {
          setMission(m => ({ ...m, progress: m.progress + coinValue }));
        }
      }

      if (coins[i] && coins[i].x < -50) {
        coins.splice(i, 1);
      }
    }

    // Update power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].x -= speed * gameRef.current.boost;
      drawPowerUp(ctx, powerUps[i], lanes, frame);

      if (player.lane === powerUps[i].lane &&
          Math.abs(lanes[player.lane] - powerUps[i].x) < 60 &&
          Math.abs(player.y - player.height / 2 - powerUps[i].y) < 60) {

        const type = powerUps[i].type;
        const colors = {
          shield: '#3b82f6',
          magnet: '#8b5cf6',
          doubleCoins: '#10b981',
          boost: '#f59e0b',
          invincible: '#a855f7'
        };

        createParticle(lanes[powerUps[i].lane], powerUps[i].y, colors[type], 25, gameRef.current.particles);
        setPowerUp({ type, time: Date.now() });

        if (type === 'shield') {
          gameRef.current.shield = true;
          setTimeout(() => { gameRef.current.shield = false; setPowerUp(null); }, 7000);
        } else if (type === 'magnet') {
          gameRef.current.magnet = true;
          setTimeout(() => { gameRef.current.magnet = false; setPowerUp(null); }, 7000);
        } else if (type === 'doubleCoins') {
          gameRef.current.doubleCoins = true;
          setTimeout(() => { gameRef.current.doubleCoins = false; setPowerUp(null); }, 7000);
        } else if (type === 'boost') {
          gameRef.current.boost = 2;
          setTimeout(() => { gameRef.current.boost = 1; setPowerUp(null); }, 5000);
        } else if (type === 'invincible') {
          gameRef.current.invincible = true;
          setTimeout(() => { gameRef.current.invincible = false; setPowerUp(null); }, 6000);
        }

        powerUps.splice(i, 1);

        if (mission?.type === 'powerups') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      if (powerUps[i] && powerUps[i].x < -50) {
        powerUps.splice(i, 1);
      }
    }

    drawParticles(ctx, gameRef.current.particles);
    drawPlayer(ctx, player, lanes, character, gameRef.current);

    // Increase speed
    if (frame % 500 === 0) {
      gameRef.current.speed = Math.min(GAME_CONFIG.MAX_SPEED, gameRef.current.baseSpeed + Math.floor(frame / 500) * 0.8);
      setLevel(l => l + 1);
    }

    setDistance(d => {
      const newDist = d + 1;
      if (newDist % 100 === 0) {
        checkAchievement('distance', Math.floor(newDist / 10));
      }
      if (mission?.type === 'distance' && newDist % 10 === 0) {
        setMission(m => ({ ...m, progress: Math.floor(newDist / 10) }));
      }
      return newDist;
    });

    if (gameRef.current.shake > 0) {
      ctx.restore();
    }

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, level, mission, achievements, maxCombo, character]);

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
        player.moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        player.moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        if (player.jump()) {
          if (mission?.type === 'jump') {
            setMission(m => ({ ...m, progress: m.progress + 1 }));
          }
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (player.duck()) {
          setTimeout(() => player.standUp(), 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, mission]);

  const startGame = () => {
    setScore(0);
    setDistance(0);
    setCoins(0);
    setPowerUp(null);
    setCombo(0);
    setLevel(1);
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setDistance(0);
    setCoins(0);
    setPowerUp(null);
    setCombo(0);
    setLevel(1);
    initGame();
    setGameState('ready');
  };

  // Mission completion
  useEffect(() => {
    if (mission && mission.progress >= mission.target && gameState === 'playing') {
      setScore(s => s + mission.reward);
      setTotalCoins(tc => tc + mission.reward);
      console.log(`✅ Görev Tamamlandı! +${mission.reward} coin`);
      setMission(generateRandomMission());
    }
  }, [mission, gameState]);

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
            <div className="text-3xl font-bold text-white">{Math.floor(distance / 10)}m</div>
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
                  <div className="text-3xl font-bold text-white">{Math.floor(distance / 10)}m</div>
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
              <div className="text-2xl font-bold">{achievements.length}/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityRunner;
