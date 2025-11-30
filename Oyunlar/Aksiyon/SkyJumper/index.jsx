import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Zap, Star, Award, Target } from 'lucide-react';

// Import modular components
import { Player } from './classes/Player';
import { CANVAS, PLATFORM, ENEMY, POWERUP, PHYSICS, STORAGE_KEYS } from './constants/gameConfig';
import { MISSION_TYPES } from './constants/missions';
import { generateInitialPlatforms, createPlatform, createEnemy, createPowerUp, createParticle } from './utils/spawner';
import { checkPlatformCollision, checkCircleCollision, getDistance } from './utils/collision';
import { ScoreCalculator } from './utils/scoreCalculator';
import { MissionManager } from './utils/missionManager';
import { drawBackground, drawPlayer, drawPlatform, drawEnemy, drawPowerUp, drawParticles } from './utils/renderer';

const SkyJumper = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [height, setHeight] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [mission, setMission] = useState(null);
  const [theme, setTheme] = useState('sky');

  const gameRef = useRef({
    player: new Player(),
    platforms: [],
    enemies: [],
    powerUps: [],
    particles: [],
    camera: { y: 0, targetY: 0 },
    frame: 0,
    maxHeight: 0,
    lastPlatformY: PLATFORM.INIT_Y,
    comboTimer: 0,
    shield: false,
    jetpack: false,
    magnet: false,
    slowmo: false,
    starMultiplier: 1,
    animationId: null,
    canvas: null,
    ctx: null,
    keys: {}
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);

    if (saved) setBestScore(parseInt(saved));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    setMission(MissionManager.generateMission());
  }, []);

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
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
    gameRef.current.platforms = generateInitialPlatforms();
    gameRef.current.enemies = [];
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
    gameRef.current.camera.y = 0;
    gameRef.current.camera.targetY = 0;
    gameRef.current.frame = 0;
    gameRef.current.maxHeight = 0;
    gameRef.current.lastPlatformY = PLATFORM.INIT_Y;
    gameRef.current.comboTimer = 0;
    gameRef.current.shield = false;
    gameRef.current.jetpack = false;
    gameRef.current.magnet = false;
    gameRef.current.slowmo = false;
    gameRef.current.starMultiplier = 1;
  };

  const updateCombo = () => {
    setCombo(c => {
      const newCombo = c + 1;
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
        const newAchievements = ScoreCalculator.checkAchievements(
          'combo',
          newCombo,
          achievements,
          showNotification
        );
        if (newAchievements !== achievements) {
          setAchievements(newAchievements);
          localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements));
        }
      }
      return newCombo;
    });
    gameRef.current.comboTimer = PHYSICS.COMBO_TIMEOUT;
  };

  const showNotification = (text) => {
    console.log(text);
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, platforms, enemies, powerUps, camera, keys, ctx, canvas, particles } = gameRef.current;
    const timeScale = gameRef.current.slowmo ? PHYSICS.SLOWMO_SCALE : PHYSICS.NORMAL_SCALE;

    // Clear and draw background
    drawBackground(ctx, canvas, camera.y, theme, gameRef.current.frame);

    // Update player
    player.update(keys, canvas.width, timeScale, gameRef.current.jetpack);

    // Camera follow
    if (player.y < camera.targetY + 200) {
      camera.targetY = player.y - 200;
    }
    camera.y += (camera.targetY - camera.y) * 0.1;

    // Update max height and score
    const currentHeight = Math.max(0, -player.y);
    if (currentHeight > gameRef.current.maxHeight) {
      gameRef.current.maxHeight = currentHeight;
      setHeight(Math.floor(currentHeight));
      setScore(s => s + 1 * gameRef.current.starMultiplier);

      if (ScoreCalculator.shouldCheckAchievement(currentHeight)) {
        const newAchievements = ScoreCalculator.checkAchievements(
          'height',
          Math.floor(currentHeight),
          achievements,
          showNotification
        );
        if (newAchievements !== achievements) {
          setAchievements(newAchievements);
          localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements));
        }
      }

      if (mission?.type === 'height') {
        setMission(m => ({ ...m, progress: Math.floor(currentHeight) }));
      }
    }

    // Combo timer
    if (gameRef.current.comboTimer > 0) {
      gameRef.current.comboTimer--;
      if (gameRef.current.comboTimer === 0) {
        setCombo(0);
      }
    }

    // Platform updates and collision
    for (let i = platforms.length - 1; i >= 0; i--) {
      const platform = platforms[i];

      // Moving platforms
      if (platform.moving) {
        platform.x += platform.moveSpeed * timeScale;
        if (platform.x < 50 || platform.x > canvas.width - 50) {
          platform.moveSpeed *= -1;
        }
      }

      // Spring compression
      if (platform.compressed > 0) {
        platform.compressed *= 0.8;
        if (platform.compressed < 0.5) platform.compressed = 0;
      }

      // Platform collision
      if (checkPlatformCollision(player, platform)) {
        if (platform.type === 'breaking') {
          if (!platform.broken) {
            platform.broken = true;
            setTimeout(() => {
              const idx = platforms.indexOf(platform);
              if (idx > -1) platforms.splice(idx, 1);
            }, 200);
          } else {
            continue;
          }
        }

        if (platform.type === 'spring') {
          player.jump(PLATFORM.TYPES.SPRING.jumpMultiplier);
          platform.compressed = 10;
          createParticle(platform.x, platform.y, '#f87171', 20, 4, particles);
        } else {
          player.jump();
        }

        player.y = platform.y - player.height / 2;
        updateCombo();
        createParticle(platform.x, platform.y, '#10b981', 8, 2, particles);

        if (mission?.type === 'platforms') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      // Remove off-screen platforms
      if (platform.y - camera.y > canvas.height + 100) {
        platforms.splice(i, 1);
      }
    }

    // Generate new platforms
    if (player.y < gameRef.current.lastPlatformY) {
      const newPlatform = createPlatform(gameRef.current.lastPlatformY - PLATFORM.SPAWN_DISTANCE);
      platforms.push(newPlatform);
      gameRef.current.lastPlatformY -= PLATFORM.SPAWN_DISTANCE;

      // Spawn enemies
      if (Math.random() < ENEMY.SPAWN_CHANCE && currentHeight > ENEMY.MIN_HEIGHT) {
        enemies.push(createEnemy(gameRef.current.lastPlatformY - 40));
      }

      // Spawn power-ups
      if (Math.random() < POWERUP.SPAWN_CHANCE && currentHeight > POWERUP.MIN_HEIGHT) {
        powerUps.push(createPowerUp(gameRef.current.lastPlatformY));
      }
    }

    // Enemy updates
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      if (enemy.moving) {
        enemy.x += enemy.moveSpeed * timeScale;
        if (enemy.x < 50 || enemy.x > canvas.width - 50) {
          enemy.moveSpeed *= -1;
        }
      }

      // Enemy collision
      if (checkCircleCollision(player, enemy)) {
        if (gameRef.current.shield) {
          gameRef.current.shield = false;
          setPowerUp(null);
          createParticle(enemy.x, enemy.y, '#3b82f6', 25, 5, particles);
          enemies.splice(i, 1);
        } else if (player.velocityY > 0 && player.y < enemy.y) {
          // Jump on enemy
          player.jump(0.8);
          createParticle(enemy.x, enemy.y, '#a855f7', 30, 4, particles);
          enemies.splice(i, 1);
          setScore(s => s + ScoreCalculator.calculateEnemyKillScore(gameRef.current.starMultiplier));
          updateCombo();

          if (mission?.type === 'enemies') {
            setMission(m => ({ ...m, progress: m.progress + 1 }));
          }
        } else {
          // Game over
          createParticle(player.x, player.y, '#ef4444', 40, 5, particles);
          setGameState('gameOver');
        }
      }

      // Remove off-screen enemies
      if (enemy.y - camera.y > canvas.height + 100) {
        enemies.splice(i, 1);
      }
    }

    // Power-up updates
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUpItem = powerUps[i];

      // Magnet pull
      if (gameRef.current.magnet) {
        const dx = player.x - powerUpItem.x;
        const dy = player.y - powerUpItem.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < POWERUP.EFFECTS.MAGNET.range) {
          powerUpItem.x += (dx / dist) * POWERUP.EFFECTS.MAGNET.speed;
          powerUpItem.y += (dy / dist) * POWERUP.EFFECTS.MAGNET.speed;
        }
      }

      // Collection
      if (checkCircleCollision(player, powerUpItem)) {
        const type = powerUpItem.type;
        const colors = { jetpack: '#f59e0b', shield: '#3b82f6', magnet: '#8b5cf6', slowmo: '#06b6d4', star: '#fbbf24' };

        createParticle(powerUpItem.x, powerUpItem.y, colors[type], 30, 5, particles);
        setPowerUp({ type, time: Date.now() });

        const duration = POWERUP.DURATIONS[type.toUpperCase()];

        if (type === 'jetpack') {
          gameRef.current.jetpack = true;
          setTimeout(() => { gameRef.current.jetpack = false; setPowerUp(null); }, duration);
        } else if (type === 'shield') {
          gameRef.current.shield = true;
          setTimeout(() => { gameRef.current.shield = false; setPowerUp(null); }, duration);
        } else if (type === 'magnet') {
          gameRef.current.magnet = true;
          setTimeout(() => { gameRef.current.magnet = false; setPowerUp(null); }, duration);
        } else if (type === 'slowmo') {
          gameRef.current.slowmo = true;
          setTimeout(() => { gameRef.current.slowmo = false; setPowerUp(null); }, duration);
        } else if (type === 'star') {
          gameRef.current.starMultiplier = POWERUP.EFFECTS.STAR.scoreMultiplier;
          setTimeout(() => { gameRef.current.starMultiplier = 1; setPowerUp(null); }, duration);
        }

        powerUps.splice(i, 1);

        if (mission?.type === 'powerups') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      // Remove off-screen power-ups
      if (powerUpItem.y - camera.y > canvas.height + 100) {
        powerUps.splice(i, 1);
      }
    }

    // Fall death
    if (player.y - camera.y > canvas.height) {
      createParticle(player.x, player.y, '#ef4444', 50, 6, particles);
      setGameState('gameOver');
    }

    // Draw everything
    platforms.forEach(p => drawPlatform(ctx, p, camera.y));
    enemies.forEach(e => drawEnemy(ctx, e, camera.y));
    powerUps.forEach(p => drawPowerUp(ctx, p, camera.y, gameRef.current.frame));
    drawParticles(ctx, particles, camera.y);
    drawPlayer(ctx, player, camera.y, gameRef.current.jetpack, gameRef.current.shield, gameRef.current.starMultiplier);

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, mission, achievements, maxCombo, theme]);

  // Game loop
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
      gameRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mission completion
  useEffect(() => {
    if (MissionManager.isMissionComplete(mission) && gameState === 'playing') {
      const reward = MissionManager.getMissionReward(mission);
      setScore(s => s + reward);
      showNotification(`✅ Görev Tamamlandı! +${reward} puan`);
      setMission(MissionManager.generateMission());
    }
  }, [mission, gameState]);

  const startGame = () => {
    setScore(0);
    setHeight(0);
    setCombo(0);
    setPowerUp(null);
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setHeight(0);
    setCombo(0);
    setPowerUp(null);
    initGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">🚀 Sky Jumper</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-blue-300">
            <div className="text-blue-100 text-xs mb-1 font-semibold">SKOR</div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-green-300">
            <div className="text-green-100 text-xs mb-1 font-semibold">YÜKSEKLİK</div>
            <div className="text-3xl font-bold text-white">{height}m</div>
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
                +{mission.reward} 🏆
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
            ⚡ Power-Up: {
              powerUp.type === 'jetpack' ? '🚀 Jetpack' :
              powerUp.type === 'shield' ? '🛡️ Kalkan' :
              powerUp.type === 'magnet' ? '🧲 Mıknatıs' :
              powerUp.type === 'slowmo' ? '⏱️ Yavaşlatma' :
              '⭐ 2x Puan'
            }
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl border-2 border-white/30">
          <canvas ref={canvasRef} width={CANVAS.WIDTH} height={CANVAS.HEIGHT}
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
              <div className="text-7xl mb-4 animate-bounce">💫</div>
              <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Oyun Bitti!</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Skor</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Yükseklik</div>
                  <div className="text-3xl font-bold text-white">{height}m</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-purple-300 text-sm mb-1">Max Kombo</div>
                  <div className="text-3xl font-bold text-purple-300">{maxCombo}x</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-yellow-300 text-sm mb-1">Başarılar</div>
                  <div className="text-3xl font-bold text-yellow-300">{achievements.length}/7</div>
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
                <span>Sağa-sola hareket</span>
              </div>
            </div>
            <div className="mt-4 text-sm bg-cyan-500/20 p-3 rounded-lg">
              💡 <strong>İpucu:</strong> Ekranın kenarından çıkarsan diğer taraftan girersin!
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-300" /> Power-ups
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="bg-orange-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span>Jetpack - Yukarı uç (3sn)</span>
              </div>
              <div className="bg-blue-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Kalkan - Düşman koruması (8sn)</span>
              </div>
              <div className="bg-purple-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🧲</span>
                <span>Mıknatıs - Power-up çek (6sn)</span>
              </div>
              <div className="bg-cyan-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span>Slow-mo - Yavaşlatma (5sn)</span>
              </div>
              <div className="bg-yellow-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Star - 2x Puan (7sn)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white border-2 border-indigo-300">
          <h3 className="text-xl font-bold mb-3">📊 Platform Tipleri</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🟢</div>
              <div className="text-sm font-bold">Normal</div>
              <div className="text-xs opacity-80">Standart</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🔵</div>
              <div className="text-sm font-bold">Hareketli</div>
              <div className="text-xs opacity-80">Sağa-sola</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🟤</div>
              <div className="text-sm font-bold">Kırılan</div>
              <div className="text-xs opacity-80">1 kullanım</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🔴</div>
              <div className="text-sm font-bold">Yaylı</div>
              <div className="text-xs opacity-80">Süper zıplama</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyJumper;
