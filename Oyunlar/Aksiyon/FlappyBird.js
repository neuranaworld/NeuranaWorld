import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Trophy } from 'lucide-react';

const FlappyBird = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const gameRef = useRef({
    bird: { x: 100, y: 200, velocity: 0, radius: 15, gravity: 0.5, jump: -8 },
    pipes: [],
    frame: 0,
    pipeGap: 150,
    pipeWidth: 60,
    pipeSpeed: 2,
    animationId: null,
    canvas: null,
    ctx: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('flappy-best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('flappy-best', score.toString());
    }
  }, [score, bestScore]);

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
    const canvas = gameRef.current.canvas;
    if (!canvas) return;

    gameRef.current.bird = {
      x: 100,
      y: canvas.height / 2,
      velocity: 0,
      radius: 15,
      gravity: 0.5,
      jump: -8
    };

    gameRef.current.pipes = [];
    gameRef.current.frame = 0;
  };

  const createPipe = () => {
    const canvas = gameRef.current.canvas;
    const gap = gameRef.current.pipeGap;
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: canvas.width,
      top: topHeight,
      bottom: topHeight + gap,
      scored: false
    };
  };

  const drawBird = (ctx, bird) => {
    // Body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.radius, bird.y);
    ctx.lineTo(bird.x + bird.radius + 8, bird.y - 3);
    ctx.lineTo(bird.x + bird.radius + 8, bird.y + 3);
    ctx.closePath();
    ctx.fill();
  };

  const drawPipe = (ctx, pipe, canvas) => {
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + gameRef.current.pipeWidth, 0);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(0.5, '#16a34a');
    gradient.addColorStop(1, '#22c55e');

    // Top pipe
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 0, gameRef.current.pipeWidth, pipe.top);
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.strokeRect(pipe.x, 0, gameRef.current.pipeWidth, pipe.top);

    // Top pipe cap
    ctx.fillRect(pipe.x - 5, pipe.top - 20, gameRef.current.pipeWidth + 10, 20);
    ctx.strokeRect(pipe.x - 5, pipe.top - 20, gameRef.current.pipeWidth + 10, 20);

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, gameRef.current.pipeWidth, canvas.height - pipe.bottom);
    ctx.strokeRect(pipe.x, pipe.bottom, gameRef.current.pipeWidth, canvas.height - pipe.bottom);

    // Bottom pipe cap
    ctx.fillRect(pipe.x - 5, pipe.bottom, gameRef.current.pipeWidth + 10, 20);
    ctx.strokeRect(pipe.x - 5, pipe.bottom, gameRef.current.pipeWidth + 10, 20);
  };

  const checkCollision = (bird, pipe) => {
    const birdLeft = bird.x - bird.radius;
    const birdRight = bird.x + bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + gameRef.current.pipeWidth;

    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipe.top || birdBottom > pipe.bottom) {
        return true;
      }
    }

    return false;
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { bird, pipes, canvas, ctx, frame, pipeSpeed } = gameRef.current;

    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 3; i++) {
      const cloudX = (frame * 0.3 + i * 200) % (canvas.width + 100);
      ctx.beginPath();
      ctx.arc(cloudX, 80 + i * 50, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, 80 + i * 50, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 50, 80 + i * 50, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create pipes
    if (gameRef.current.frame % 120 === 0) {
      pipes.push(createPipe());
    }

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= pipeSpeed;

      drawPipe(ctx, pipes[i], canvas);

      // Check collision
      if (checkCollision(bird, pipes[i])) {
        setGameState('gameOver');
      }

      // Score
      if (!pipes[i].scored && pipes[i].x + gameRef.current.pipeWidth < bird.x) {
        pipes[i].scored = true;
        setScore(s => s + 1);
      }

      // Remove off-screen pipes
      if (pipes[i].x + gameRef.current.pipeWidth < 0) {
        pipes.splice(i, 1);
      }
    }

    // Draw bird
    drawBird(ctx, bird);

    // Check boundaries
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
      setGameState('gameOver');
    }

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < canvas.width; i += 10) {
      ctx.fillRect(i - (frame % 10), canvas.height - 22, 5, 2);
    }

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState]);

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

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.bird.velocity = gameRef.current.bird.jump;
    } else if (gameState === 'ready') {
      startGame();
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [jump]);

  const startGame = () => {
    setScore(0);
    initGame();
    setGameState('playing');
  };

  const resetGame = () => {
    setScore(0);
    initGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-cyan-400 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white">Flappy Bird</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-white/80 text-sm mb-2">Skor</div>
            <div className="text-5xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-white/80 text-sm mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" /> En İyi
            </div>
            <div className="text-5xl font-bold text-yellow-300">{bestScore}</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl relative">
          <canvas ref={canvasRef} width={640} height={480}
            className="w-full rounded-lg border-4 border-white/30 cursor-pointer" />

          {gameState === 'ready' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
              <div className="text-center bg-white/90 p-8 rounded-2xl">
                <div className="text-6xl mb-4">🐦</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Başlamaya Hazır!</h2>
                <button onClick={startGame}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto">
                  <Play className="w-6 h-6" /> Başlat
                </button>
                <p className="text-sm text-gray-600 mt-4">Tıkla veya Space tuşuna bas!</p>
              </div>
            </div>
          )}
        </div>

        {gameState === 'gameOver' && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 max-w-md text-center shadow-2xl">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold mb-4 text-white">Oyun Bitti!</h2>
              <p className="text-xl text-white/90 mb-2">Skorunuz</p>
              <p className="text-6xl font-bold text-white mb-6">{score}</p>
              {score === bestScore && score > 0 && (
                <p className="text-yellow-300 font-semibold mb-6 text-xl">🏆 Yeni Rekor!</p>
              )}
              <button onClick={startGame}
                className="w-full bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg">
                Tekrar Oyna
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎮 Nasıl Oynanır?</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Tıkla</strong> veya <strong>Space</strong> tuşuna basarak kuşu zıpla!</li>
            <li>• Yeşil borulardan geç</li>
            <li>• Yere veya borulara çarpmadan devam et</li>
            <li>• Her borudan geçtiğinde 1 puan kazan!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
