import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Heart, Zap } from 'lucide-react';

const BreakoutGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, gameOver, won
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const gameRef = useRef({
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 8, speed: 5 },
    paddle: { x: 0, y: 0, width: 100, height: 12, speed: 8 },
    bricks: [],
    powerUps: [],
    particles: [],
    animationId: null,
    canvas: null,
    ctx: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('breakout-best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('breakout-best', score.toString());
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
  }, [level]);

  const initGame = () => {
    const canvas = gameRef.current.canvas;
    if (!canvas) return;

    const paddle = gameRef.current.paddle;
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - 40;

    const ball = gameRef.current.ball;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = -ball.speed;

    createBricks();
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
  };

  const createBricks = () => {
    const bricks = [];
    const rows = 4 + level;
    const cols = 8;
    const brickWidth = 70;
    const brickHeight = 20;
    const padding = 5;
    const offsetX = 35;
    const offsetY = 60;

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const brickX = offsetX + col * (brickWidth + padding);
        const brickY = offsetY + row * (brickHeight + padding);
        const hits = Math.min(level, 3);
        const hasPowerUp = Math.random() < 0.1;

        bricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          color: colors[row % colors.length],
          hits: hits,
          maxHits: hits,
          visible: true,
          hasPowerUp,
        });
      }
    }

    gameRef.current.bricks = bricks;
  };

  const createParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      gameRef.current.particles.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        color,
        life: 30,
      });
    }
  };

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  const drawPaddle = (ctx, paddle) => {
    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');

    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
  };

  const drawBricks = (ctx, bricks) => {
    bricks.forEach(brick => {
      if (!brick.visible) return;

      const opacity = brick.hits / brick.maxHits;
      ctx.fillStyle = brick.color;
      ctx.globalAlpha = 0.3 + opacity * 0.7;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

      if (brick.hasPowerUp) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('⚡', brick.x + brick.width / 2 - 7, brick.y + brick.height / 2 + 5);
      }
    });
  };

  const drawPowerUps = (ctx, powerUps) => {
    powerUps.forEach(pu => {
      ctx.fillStyle = pu.color;
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(pu.icon, pu.x - 6, pu.y + 4);
    });
  };

  const drawParticles = (ctx, particles) => {
    particles.forEach(p => {
      if (p.life <= 0) return;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.fillRect(p.x, p.y, 3, 3);
      ctx.globalAlpha = 1;
    });
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { ball, paddle, bricks, powerUps, particles, canvas, ctx } = gameRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
    });
    gameRef.current.particles = particles.filter(p => p.life > 0);
    drawParticles(ctx, particles);

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      createParticles(ball.x, ball.y, '#fbbf24');
    }

    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      createParticles(ball.x, ball.y, '#fbbf24');
    }

    // Ball collision with paddle
    if (
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      const hitPos = (ball.x - paddle.x) / paddle.width;
      ball.dx = (hitPos - 0.5) * ball.speed * 2;
      ball.dy = -Math.abs(ball.dy);
      createParticles(ball.x, paddle.y, '#3b82f6');
    }

    // Ball collision with bricks
    bricks.forEach(brick => {
      if (!brick.visible) return;

      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        ball.dy = -ball.dy;
        brick.hits--;

        if (brick.hits <= 0) {
          brick.visible = false;
          setScore(s => s + 10 * level);
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);

          if (brick.hasPowerUp) {
            powerUps.push({
              x: brick.x + brick.width / 2,
              y: brick.y + brick.height / 2,
              dy: 2,
              type: Math.random() > 0.5 ? 'expand' : 'multiball',
              color: '#fbbf24',
              icon: Math.random() > 0.5 ? '↔' : '●',
            });
          }
        } else {
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
        }
      }
    });

    // Update power-ups
    powerUps.forEach(pu => {
      pu.y += pu.dy;

      // Check collision with paddle
      if (
        pu.y + 8 > paddle.y &&
        pu.y - 8 < paddle.y + paddle.height &&
        pu.x > paddle.x &&
        pu.x < paddle.x + paddle.width
      ) {
        pu.collected = true;
        if (pu.type === 'expand') {
          paddle.width = Math.min(150, paddle.width + 30);
          setPowerUp({ type: 'expand', time: Date.now() });
          setTimeout(() => {
            paddle.width = 100;
            setPowerUp(null);
          }, 5000);
        }
      }
    });
    gameRef.current.powerUps = powerUps.filter(pu => !pu.collected && pu.y < canvas.height);

    // Ball out of bounds
    if (ball.y - ball.radius > canvas.height) {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        } else {
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 60;
          ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
          ball.dy = -ball.speed;
        }
        return newLives;
      });
    }

    // Check win condition
    const remainingBricks = bricks.filter(b => b.visible).length;
    if (remainingBricks === 0) {
      setLevel(l => l + 1);
      setGameState('won');
    }

    // Draw everything
    drawBricks(ctx, bricks);
    drawPowerUps(ctx, powerUps);
    drawPaddle(ctx, paddle);
    drawBall(ctx, ball);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      const paddle = gameRef.current.paddle;
      const canvas = gameRef.current.canvas;

      if (e.key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x = Math.max(0, paddle.x - paddle.speed * 3);
      } else if (e.key === 'ArrowRight' && paddle.x < canvas.width - paddle.width) {
        paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed * 3);
      }
    };

    const handleMouseMove = (e) => {
      if (gameState !== 'playing') return;

      const canvas = gameRef.current.canvas;
      const rect = canvas.getBoundingClientRect();
      const paddle = gameRef.current.paddle;

      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, e.clientX - rect.left - paddle.width / 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [gameState]);

  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setPowerUp(null);
    initGame();
    setGameState('ready');
  };

  const nextLevel = () => {
    setLives(l => Math.min(5, l + 1));
    initGame();
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white">Breakout</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> Skor
            </div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm mb-1 flex items-center justify-center gap-1">
              <Heart className="w-4 h-4" /> Can
            </div>
            <div className="text-3xl font-bold text-red-400">{lives}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm mb-1">Seviye</div>
            <div className="text-3xl font-bold text-yellow-400">{level}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> En İyi
            </div>
            <div className="text-3xl font-bold text-green-400">{bestScore}</div>
          </div>
        </div>

        {powerUp && (
          <div className="bg-yellow-500 text-white px-6 py-3 rounded-xl mb-6 text-center font-semibold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" /> Güç Bonusu Aktif: {powerUp.type === 'expand' ? 'Geniş Raket' : 'Çoklu Top'}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full rounded-lg border-4 border-white/20"
          />
        </div>

        <div className="flex gap-4 mt-6">
          {gameState === 'ready' && (
            <button onClick={startGame}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              <Play className="w-6 h-6" /> Başlat
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused') && (
            <button onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              {gameState === 'playing' ? <><Pause className="w-6 h-6" /> Duraklat</> : <><Play className="w-6 h-6" /> Devam</>}
            </button>
          )}
        </div>

        {gameState === 'gameOver' && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md text-center shadow-2xl border-2 border-white/20">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold mb-4 text-white">Oyun Bitti!</h2>
              <p className="text-xl text-gray-300 mb-2">Final Skoru</p>
              <p className="text-5xl font-bold text-yellow-400 mb-2">{score}</p>
              <p className="text-lg text-gray-400 mb-6">Seviye {level}</p>
              {score === bestScore && score > 0 && (
                <p className="text-green-400 font-semibold mb-6 text-xl">🏆 Yeni Rekor!</p>
              )}
              <button onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg">
                Tekrar Oyna
              </button>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 max-w-md text-center shadow-2xl border-2 border-white/20">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold mb-4 text-white">Seviye Tamamlandı!</h2>
              <p className="text-xl text-white/90 mb-2">Skor</p>
              <p className="text-5xl font-bold text-yellow-300 mb-6">{score}</p>
              <button onClick={nextLevel}
                className="w-full bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg">
                Sonraki Seviye ({level + 1})
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎮 Kontroller</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Fare</strong>: Raketi hareket ettir</li>
            <li>• <strong>← →</strong>: Ok tuşları ile raket kontrolü</li>
            <li>• <strong>⚡ Güç Bonusları</strong>: Tuğlaları kırarak bonuslar kazan</li>
            <li>• <strong>Seviyeler</strong>: Her seviyede daha güçlü tuğlalar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreakoutGame;
