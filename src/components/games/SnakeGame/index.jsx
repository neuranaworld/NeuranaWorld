import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Star, Crown, Zap, Heart, Shield } from 'lucide-react';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15, type: 'normal' });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [shield, setShield] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');

  const gridSize = 25;
  const tileSize = 20;

  const DIFFICULTIES = {
    easy: { name: 'Kolay', speed: 200, obstacles: 0, icon: '🌱' },
    medium: { name: 'Orta', speed: 150, obstacles: 3, icon: '🌿' },
    hard: { name: 'Zor', speed: 100, obstacles: 6, icon: '🌳' },
  };

  useEffect(() => {
    const saved = localStorage.getItem(`snake_best_${difficulty}`);
    if (saved) setBestScore(parseInt(saved));
  }, [difficulty]);

  const generateFood = useCallback(() => {
    const types = ['normal', 'bonus', 'speed'];
    const type = Math.random() < 0.7 ? 'normal' : Math.random() < 0.5 ? 'bonus' : 'speed';
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        type
      };
    } while (
      snake.some(s => s.x === newFood.x && s.y === newFood.y) ||
      obstacles.some(o => o.x === newFood.x && o.y === newFood.y)
    );
    setFood(newFood);
  }, [snake, obstacles]);

  const generateObstacles = useCallback((count) => {
    const newObstacles = [];
    for (let i = 0; i < count; i++) {
      let obstacle;
      do {
        obstacle = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } while (
        (obstacle.x === 10 && obstacle.y === 10) ||
        newObstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)
      );
      newObstacles.push(obstacle);
    }
    setObstacles(newObstacles);
  }, []);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(DIFFICULTIES[difficulty].speed);
    setIsPaused(false);
    setGameStarted(true);
    setShowMenu(false);
    setShield(false);
    setSlowMode(false);
    generateObstacles(DIFFICULTIES[difficulty].obstacles);
    generateFood();
  };

  const checkCollision = (head, snakeBody) => {
    // Wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return !shield;
    }
    // Self collision
    for (let segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return !shield;
      }
    }
    // Obstacle collision
    for (let obstacle of obstacles) {
      if (head.x === obstacle.x && head.y === obstacle.y) {
        return !shield;
      }
    }
    return false;
  };

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      if (checkCollision(head, newSnake)) {
        if (shield) {
          setShield(false);
          return prevSnake;
        }
        setGameOver(true);
        if (score > bestScore) {
          setBestScore(score);
          localStorage.setItem(`snake_best_${difficulty}`, score);
        }
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        const points = food.type === 'bonus' ? 30 : food.type === 'speed' ? 20 : 10;
        setScore((prev) => {
          const newScore = prev + points;
          if (newScore % 100 === 0) {
            setLevel(l => l + 1);
            generateObstacles(DIFFICULTIES[difficulty].obstacles + Math.floor(newScore / 100));
          }
          return newScore;
        });

        // Power-up effects
        if (food.type === 'speed') {
          setSlowMode(true);
          setTimeout(() => setSlowMode(false), 5000);
        }

        // Random power-ups
        if (Math.random() < 0.2) {
          const powerUp = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
            type: 'shield'
          };
          setPowerUps([powerUp]);
          setTimeout(() => setPowerUps([]), 5000);
        }

        generateFood();
      } else {
        newSnake.pop();
      }

      // Check power-ups
      powerUps.forEach((powerUp, idx) => {
        if (head.x === powerUp.x && head.y === powerUp.y) {
          if (powerUp.type === 'shield') {
            setShield(true);
            setTimeout(() => setShield(false), 10000);
          }
          setPowerUps(prev => prev.filter((_, i) => i !== idx));
        }
      });

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, gameStarted, score, bestScore, difficulty, shield, powerUps, obstacles, generateFood, generateObstacles]); // eslint-disable-line

  useEffect(() => {
    const currentSpeed = slowMode ? speed * 1.5 : speed;
    const interval = setInterval(gameLoop, currentSpeed);
    return () => clearInterval(interval);
  }, [gameLoop, speed, slowMode]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused, gameStarted, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, gridSize * tileSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(gridSize * tileSize, i * tileSize);
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(obstacle.x * tileSize, obstacle.y * tileSize, tileSize, tileSize);
    });

    // Draw power-ups
    powerUps.forEach(powerUp => {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(
        powerUp.x * tileSize + tileSize / 2,
        powerUp.y * tileSize + tileSize / 2,
        tileSize / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Draw snake
    snake.forEach((segment, index) => {
      if (shield) {
        ctx.fillStyle = index === 0 ? '#3b82f6' : '#60a5fa';
      } else {
        ctx.fillStyle = index === 0 ? '#059669' : '#10b981';
      }
      ctx.fillRect(segment.x * tileSize + 1, segment.y * tileSize + 1, tileSize - 2, tileSize - 2);

      if (index === 0) {
        ctx.fillStyle = 'white';
        const eyeSize = 3;
        if (direction.x === 1) {
          ctx.fillRect(segment.x * tileSize + 12, segment.y * tileSize + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * tileSize + 12, segment.y * tileSize + 12, eyeSize, eyeSize);
        } else if (direction.x === -1) {
          ctx.fillRect(segment.x * tileSize + 5, segment.y * tileSize + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * tileSize + 5, segment.y * tileSize + 12, eyeSize, eyeSize);
        } else if (direction.y === 1) {
          ctx.fillRect(segment.x * tileSize + 5, segment.y * tileSize + 12, eyeSize, eyeSize);
          ctx.fillRect(segment.x * tileSize + 12, segment.y * tileSize + 12, eyeSize, eyeSize);
        } else {
          ctx.fillRect(segment.x * tileSize + 5, segment.y * tileSize + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * tileSize + 12, segment.y * tileSize + 5, eyeSize, eyeSize);
        }
      }
    });

    // Draw food
    if (food.type === 'bonus') {
      ctx.fillStyle = '#fbbf24';
    } else if (food.type === 'speed') {
      ctx.fillStyle = '#8b5cf6';
    } else {
      ctx.fillStyle = '#ef4444';
    }
    ctx.beginPath();
    ctx.arc(
      food.x * tileSize + tileSize / 2,
      food.y * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food, direction, obstacles, powerUps, shield]);

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">🐍 Yılan Oyunu</h1>
            <p className="text-xl text-white/90">Yemeği topla, büyü ama çarpma!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Zorluk Seç</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(DIFFICULTIES).map(([key, val]) => (
                <button key={key} onClick={() => setDifficulty(key)}
                  className={`p-6 rounded-xl font-semibold transition-all ${difficulty === key ?
                    'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <div className="text-4xl mb-2">{val.icon}</div>
                  <div className="text-lg">{val.name}</div>
                  <div className="text-sm opacity-75">{val.obstacles} engel</div>
                </button>
              ))}
            </div>

            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-600 inline mr-2" />
                <span className="text-xl font-bold text-yellow-800">En İyi: {bestScore}</span>
              </div>
            )}

            <button onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg mb-6">
              🎮 Oyunu Başlat
            </button>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2">🎁 Özellikler:</h3>
              <ul className="text-sm space-y-1">
                <li>🔴 Kırmızı yemek: 10 puan</li>
                <li>🟡 Sarı yemek: 30 puan (bonus)</li>
                <li>🟣 Mor yemek: 20 puan (yavaşlatma)</li>
                <li>🛡️ Mavi top: Kalkan (10 saniye)</li>
                <li>⬛ Gri kareler: Engeller</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-gray-600">Skor</div>
            <div className="text-2xl font-bold text-green-600">{score}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-sm text-gray-600">En İyi</div>
            <div className="text-2xl font-bold text-orange-600">{bestScore}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-sm text-gray-600">Seviye</div>
            <div className="text-2xl font-bold text-purple-600">{level}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <div className="text-sm text-gray-600">Uzunluk</div>
            <div className="text-2xl font-bold text-red-600">{snake.length}</div>
          </div>
        </div>

        {(shield || slowMode) && (
          <div className="flex gap-2 mb-4">
            {shield && (
              <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" /> Kalkan Aktif
              </div>
            )}
            {slowMode && (
              <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5" /> Yavaşlatma
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-4">
          <canvas ref={canvasRef} width={gridSize * tileSize} height={gridSize * tileSize}
            className="border-4 border-green-800 rounded-lg mx-auto" />
        </div>

        {!gameStarted && !gameOver && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
            <p className="font-bold">Ok tuşları ile başla!</p>
          </div>
        )}

        {isPaused && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-center">
            <p className="font-bold">DURAKLAT (SPACE ile devam et)</p>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setShowMenu(true)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold">
            <RotateCcw className="inline w-5 h-5 mr-2" />
            Menü
          </button>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-center text-green-600 mb-4">Oyun Bitti!</h2>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-lg text-gray-700 mb-2">Skor</div>
                <div className="text-5xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600 mt-2">Uzunluk: {snake.length}</div>
              </div>
              {score > bestScore && (
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 p-3 rounded-xl mb-4 text-center font-bold">
                  🎉 Yeni Rekor!
                </div>
              )}
              <div className="flex gap-4">
                <button onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
                  Tekrar Oyna
                </button>
                <button onClick={() => setShowMenu(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold">
                  Menü
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
