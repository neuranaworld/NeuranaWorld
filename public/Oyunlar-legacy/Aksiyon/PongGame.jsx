import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Target } from 'lucide-react';

const PongGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [difficulty, setDifficulty] = useState('medium');
  const [bestScore, setBestScore] = useState(0);

  const gameRef = useRef({
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 8, speed: 5 },
    player: { x: 0, y: 0, width: 12, height: 80, speed: 8 },
    ai: { x: 0, y: 0, width: 12, height: 80, speed: 6 },
    keys: {},
    animationId: null,
    canvas: null,
    ctx: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('pong-best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score.player > bestScore) {
      setBestScore(score.player);
      localStorage.setItem('pong-best', score.player.toString());
    }
  }, [score.player, bestScore]);

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
  }, [difficulty]);

  const initGame = () => {
    const canvas = gameRef.current.canvas;
    if (!canvas) return;

    const player = gameRef.current.player;
    player.x = 20;
    player.y = canvas.height / 2 - player.height / 2;

    const ai = gameRef.current.ai;
    ai.x = canvas.width - 20 - ai.width;
    ai.y = canvas.height / 2 - ai.height / 2;
    ai.speed = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

    const ball = gameRef.current.ball;
    resetBall();
  };

  const resetBall = () => {
    const canvas = gameRef.current.canvas;
    const ball = gameRef.current.ball;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
  };

  const drawRect = (ctx, x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  const drawCircle = (ctx, x, y, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawNet = (ctx, canvas) => {
    for (let i = 0; i < canvas.height; i += 20) {
      drawRect(ctx, canvas.width / 2 - 2, i, 4, 10, 'rgba(255, 255, 255, 0.3)');
    }
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { ball, player, ai, canvas, ctx } = gameRef.current;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawNet(ctx, canvas);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    if (
      ball.x - ball.radius < player.x + player.width &&
      ball.y > player.y &&
      ball.y < player.y + player.height &&
      ball.dx < 0
    ) {
      const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
      ball.dx = Math.abs(ball.dx) * 1.05;
      ball.dy = hitPos * ball.speed;
    }

    if (
      ball.x + ball.radius > ai.x &&
      ball.y > ai.y &&
      ball.y < ai.y + ai.height &&
      ball.dx > 0
    ) {
      const hitPos = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
      ball.dx = -Math.abs(ball.dx) * 1.05;
      ball.dy = hitPos * ball.speed;
    }

    const aiCenter = ai.y + ai.height / 2;
    const reactionDelay = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 15 : 5;

    if (ball.dx > 0) {
      if (Math.abs(ball.y - aiCenter) > reactionDelay) {
        if (ball.y < aiCenter) {
          ai.y = Math.max(0, ai.y - ai.speed);
        } else {
          ai.y = Math.min(canvas.height - ai.height, ai.y + ai.speed);
        }
      }
    }

    const keys = gameRef.current.keys;
    if (keys['ArrowUp'] && player.y > 0) {
      player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
      player.y += player.speed;
    }

    if (ball.x - ball.radius < 0) {
      setScore(s => ({ ...s, ai: s.ai + 1 }));
      resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
      setScore(s => ({ ...s, player: s.player + 1 }));
      resetBall();
    }

    drawRect(ctx, player.x, player.y, player.width, player.height, '#3b82f6');
    drawRect(ctx, ai.x, ai.y, ai.width, ai.height, '#ef4444');
    drawCircle(ctx, ball.x, ball.y, ball.radius, '#ffffff');

    if (score.player >= 10 || score.ai >= 10) {
      setGameState('gameOver');
    }

    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, score, difficulty]);

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
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setScore({ player: 0, ai: 0 });
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore({ player: 0, ai: 0 });
    initGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white">Pong</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        {gameState === 'ready' && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Zorluk Seç</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {['easy', 'medium', 'hard'].map(diff => (
                <button key={diff} onClick={() => setDifficulty(diff)}
                  className={`px-6 py-4 rounded-xl font-bold transition ${difficulty === diff ?
                    'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' :
                    'bg-white/20 text-white hover:bg-white/30'}`}>
                  {diff === 'easy' ? '🌱 Kolay' : diff === 'medium' ? '🌿 Orta' : '🔥 Zor'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500/20 backdrop-blur rounded-xl p-6 text-center border-2 border-blue-500">
            <div className="text-blue-300 text-sm mb-2 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" /> Oyuncu
            </div>
            <div className="text-5xl font-bold text-white">{score.player}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="text-white/70 text-sm mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" /> En İyi
            </div>
            <div className="text-5xl font-bold text-yellow-400">{bestScore}</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur rounded-xl p-6 text-center border-2 border-red-500">
            <div className="text-red-300 text-sm mb-2 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" /> AI
            </div>
            <div className="text-5xl font-bold text-white">{score.ai}</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-2xl">
          <canvas ref={canvasRef} width={800} height={400}
            className="w-full rounded-lg border-4 border-white/20 bg-slate-900" />
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
            <div className={`rounded-3xl p-8 max-w-md text-center shadow-2xl ${score.player >= 10 ?
              'bg-gradient-to-br from-green-600 to-emerald-700' :
              'bg-gradient-to-br from-red-600 to-red-800'}`}>
              <div className="text-6xl mb-4">{score.player >= 10 ? '🎉' : '😢'}</div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                {score.player >= 10 ? 'Kazandınız!' : 'Kaybettiniz!'}
              </h2>
              <p className="text-xl text-white/90 mb-2">Final Skoru</p>
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <p className="text-blue-200 text-sm">Siz</p>
                  <p className="text-5xl font-bold text-white">{score.player}</p>
                </div>
                <div className="text-4xl font-bold text-white self-center">-</div>
                <div>
                  <p className="text-red-200 text-sm">AI</p>
                  <p className="text-5xl font-bold text-white">{score.ai}</p>
                </div>
              </div>
              {score.player === bestScore && score.player >= 10 && (
                <p className="text-yellow-300 font-semibold mb-6 text-xl">🏆 Yeni Rekor!</p>
              )}
              <button onClick={startGame}
                className="w-full bg-white text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg">
                Tekrar Oyna
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎮 Kontroller</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>↑</strong>: Raketi yukarı hareket ettir</li>
            <li>• <strong>↓</strong>: Raketi aşağı hareket ettir</li>
            <li>• <strong>Hedef:</strong> 10 puana ilk ulaşan kazanır!</li>
            <li>• <strong>Zorluk Seviyeleri:</strong> Kolay - AI yavaş tepki verir, Zor - AI çok hızlı!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PongGame;
