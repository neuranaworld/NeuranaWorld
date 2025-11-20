import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bird, Trophy, RotateCcw, Star, Crown } from 'lucide-react';

const FlappyBirdGame = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [frame, setFrame] = useState(0);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -10;
  const BIRD_SIZE = 40;
  const PIPE_WIDTH = 80;
  const PIPE_GAP = 180;
  const PIPE_SPEED = 3;

  useEffect(() => {
    const saved = localStorage.getItem('flappy_best_score');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setPipes([{ x: 600, topHeight: Math.random() * 200 + 100 }]);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [jump]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setFrame(f => f + 1);

      // Bird physics
      setBirdY(y => {
        const newY = y + birdVelocity;
        if (newY > 550 || newY < 0) {
          setGameOver(true);
          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('flappy_best_score', score);
          }
        }
        return newY;
      });

      setBirdVelocity(v => v + GRAVITY);

      // Pipes
      setPipes(prevPipes => {
        let newPipes = prevPipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 300) {
          newPipes.push({ x: 600, topHeight: Math.random() * 200 + 100 });
        }

        // Remove off-screen pipes and increase score
        newPipes = newPipes.filter(pipe => {
          if (pipe.x + PIPE_WIDTH < 0) {
            setScore(s => s + 1);
            return false;
          }
          return true;
        });

        // Collision detection
        newPipes.forEach(pipe => {
          if (
            100 + BIRD_SIZE > pipe.x &&
            100 < pipe.x + PIPE_WIDTH &&
            (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.topHeight + PIPE_GAP)
          ) {
            setGameOver(true);
            if (score > bestScore) {
              setBestScore(score);
              localStorage.setItem('flappy_best_score', score);
            }
          }
        });

        return newPipes;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdVelocity, birdY, score, bestScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const cloudOffset = (frame * 0.5) % 800;
    [[100 - cloudOffset, 100], [400 - cloudOffset, 150], [700 - cloudOffset, 80]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      ctx.fill();
    });

    // Pipes
    pipes.forEach(pipe => {
      // Top pipe
      const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      topGradient.addColorStop(0, '#2ECC40');
      topGradient.addColorStop(1, '#01FF70');
      ctx.fillStyle = topGradient;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = '#01B140';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      // Bottom pipe
      const bottomY = pipe.topHeight + PIPE_GAP;
      ctx.fillStyle = topGradient;
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);
      ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);
    });

    // Bird
    const birdRotation = Math.min(Math.max(birdVelocity * 3, -30), 90) * (Math.PI / 180);
    ctx.save();
    ctx.translate(100 + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);
    ctx.rotate(birdRotation);

    // Bird body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 4, -BIRD_SIZE / 4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 4 + 2, -BIRD_SIZE / 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 15, -5);
    ctx.lineTo(BIRD_SIZE / 2 + 15, 5);
    ctx.closePath();
    ctx.fill();

    // Bird wing
    if (Math.floor(frame / 10) % 2 === 0) {
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.ellipse(-5, 5, 15, 8, -20 * (Math.PI / 180), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 580, canvas.width, 20);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 575, canvas.width, 5);
  }, [pipes, birdY, frame]);

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setFrame(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Bird className="w-12 h-12" />
            Flappy Bird
          </h1>
          <p className="text-white/90 text-lg">Uç ve borulardan kaç!</p>
        </div>

        <div className="flex justify-between mb-4">
          <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg">
            <div className="text-sm text-gray-600">Skor</div>
            <div className="text-3xl font-bold text-blue-600">{score}</div>
          </div>
          <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> En İyi
            </div>
            <div className="text-3xl font-bold text-yellow-600">{bestScore}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-2xl mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onClick={jump}
            className="border-4 border-blue-600 rounded-lg cursor-pointer mx-auto"
          />
        </div>

        {!gameStarted && !gameOver && (
          <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-6 py-4 rounded-xl mb-4 text-center">
            <p className="font-bold text-lg">🎮 Başlamak için tıkla veya SPACE tuşuna bas!</p>
            <p className="text-sm mt-2">Kuşu zıplatmak için tıklayın veya SPACE kullanın</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-6 h-6 inline mr-2" />
            Yeni Oyun
          </button>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl transform scale-100 animate-bounce-in">
              <div className="text-center">
                {score > bestScore ? (
                  <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                ) : (
                  <Star className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                )}
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {score > bestScore ? '🎉 Yeni Rekor!' : 'Oyun Bitti!'}
                </h2>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 mb-6">
                  <div className="text-lg text-gray-700 mb-2">Skorun</div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{score}</div>
                  <div className="text-sm text-gray-600">En İyi: {bestScore}</div>
                </div>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700"
                >
                  Tekrar Oyna
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBirdGame;
