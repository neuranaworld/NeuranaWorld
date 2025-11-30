import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Heart } from 'lucide-react';
import { Ball } from './classes/Ball';
import { Paddle } from './classes/Paddle';
import { CANVAS, BALL, PADDLE, SCORING, STORAGE_KEY, POWERUP_DURATION } from './constants/gameConfig';
import { createBricks, createPowerUp, createParticles } from './utils/spawner';
import { checkBallPaddleCollision, checkBallBrickCollision, checkPowerUpPaddleCollision } from './utils/collision';
import { drawBackground, drawBall, drawPaddle, drawBricks, drawPowerUps, drawParticles } from './utils/renderer';

const BreakoutGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [powerUp, setPowerUp] = useState(null);

  const gameRef = useRef({
    ball: null,
    paddle: null,
    bricks: [],
    powerUps: [],
    particles: [],
    animationId: null,
    canvas: null,
    ctx: null,
    keys: {}
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEY, score.toString());
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

    gameRef.current.paddle = new Paddle(
      canvas.width / 2 - PADDLE.WIDTH / 2,
      canvas.height - PADDLE.Y_OFFSET
    );

    gameRef.current.ball = new Ball(
      canvas.width / 2,
      canvas.height - BALL.INIT_Y_OFFSET
    );

    gameRef.current.bricks = createBricks(level);
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { ball, paddle, bricks, powerUps, particles, canvas, ctx, keys } = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);

    // Update particles
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
    });
    gameRef.current.particles = particles.filter(p => p.life > 0);
    drawParticles(ctx, particles);

    // Paddle movement
    if (keys['ArrowLeft'] || keys['a']) paddle.moveLeft();
    if (keys['ArrowRight'] || keys['d']) paddle.moveRight(canvas.width);

    // Ball update
    ball.update();

    // Wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.reverseX();
      createParticles(ball.x, ball.y, '#fbbf24', particles);
    }
    if (ball.y - ball.radius < 0) {
      ball.reverseY();
      createParticles(ball.x, ball.y, '#fbbf24', particles);
    }

    // Paddle collision
    if (checkBallPaddleCollision(ball, paddle)) {
      ball.bounceOffPaddle(paddle);
      createParticles(ball.x, paddle.y, '#3b82f6', particles);
    }

    // Brick collision
    bricks.forEach(brick => {
      if (checkBallBrickCollision(ball, brick)) {
        ball.reverseY();
        brick.hits--;

        if (brick.hits <= 0) {
          brick.visible = false;
          setScore(s => s + SCORING.BRICK_BASE * level);
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, particles);

          if (brick.hasPowerUp) {
            powerUps.push(createPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2));
          }
        } else {
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, particles);
        }
      }
    });

    // Power-ups update
    powerUps.forEach(pu => {
      pu.y += pu.dy;

      if (checkPowerUpPaddleCollision(pu, paddle)) {
        pu.collected = true;
        if (pu.type === 'expand') {
          paddle.expand();
          setPowerUp({ type: 'expand', time: Date.now() });
          setTimeout(() => {
            paddle.reset();
            setPowerUp(null);
          }, POWERUP_DURATION);
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
          ball.reset(canvas.width / 2, canvas.height - BALL.INIT_Y_OFFSET);
        }
        return newLives;
      });
    }

    // Level complete
    if (bricks.every(b => !b.visible)) {
      setLevel(l => l + 1);
      setGameState('ready');
    }

    // Draw everything
    drawBricks(ctx, bricks);
    drawPowerUps(ctx, powerUps);
    drawPaddle(ctx, paddle);
    drawBall(ctx, ball);

    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, level]);

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

  const startGame = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">🧱 Breakout</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-blue-100 text-xs mb-1 font-semibold">SKOR</div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-red-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Heart className="w-4 h-4" /> CAN
            </div>
            <div className="text-3xl font-bold text-white">{lives}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-purple-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> SEVİYE
            </div>
            <div className="text-3xl font-bold text-white">{level}</div>
          </div>
        </div>

        {powerUp && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl mb-4 text-center font-bold shadow-lg animate-pulse">
            ⚡ Power-Up: {powerUp.type === 'expand' ? '↔ Genişleme' : '● Multi-ball'}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl">
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
            <div className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-600 rounded-3xl p-8 max-w-lg text-center shadow-2xl">
              <h2 className="text-5xl font-bold mb-6 text-white">Oyun Bitti!</h2>
              <div className="text-3xl font-bold text-white mb-6">Skor: {score}</div>
              {score === bestScore && score > 0 && (
                <div className="bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-xl mb-6 text-xl">
                  🏆 YENİ REKOR!
                </div>
              )}
              <button onClick={resetGame}
                className="w-full bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-xl shadow-lg">
                🔄 Tekrar Oyna
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakoutGame;
