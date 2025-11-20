import React, { useState, useEffect, useRef } from 'react';
import { Target, Trophy, RotateCcw, Crosshair, Award, Crown } from 'lucide-react';

const DartGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [dartsLeft, setDartsLeft] = useState(10);
  const [throws, setThrows] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [power, setPower] = useState(0);
  const [isPowering, setIsPowering] = useState(false);
  const [currentThrow, setCurrentThrow] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [showMenu, setShowMenu] = useState(true);

  const DIFFICULTIES = {
    easy: { name: 'Kolay', darts: 15, targetSize: 1.2, icon: '🌱' },
    medium: { name: 'Orta', darts: 10, targetSize: 1.0, icon: '🌿' },
    hard: { name: 'Zor', darts: 7, targetSize: 0.8, icon: '🌳' },
  };

  useEffect(() => {
    const saved = localStorage.getItem(`dart_best_${difficulty}`);
    if (saved) setBestScore(parseInt(saved));
  }, [difficulty]);

  useEffect(() => {
    drawBoard();
  }, [throws, currentThrow]); // eslint-disable-line

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 300);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 600);

    // Draw dartboard
    const centerX = 300;
    const centerY = 300;
    const sizeMultiplier = DIFFICULTIES[difficulty].targetSize;

    // Outer ring (miss)
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 280 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // White ring
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 240 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Black ring (5 points)
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 200 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Red ring (10 points)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 150 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Yellow ring (25 points)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Green center (50 points)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Bullseye (100 points)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20 * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();

    // Draw score zones text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('100', centerX, centerY + 5);
    ctx.fillText('50', centerX, centerY - 60 * sizeMultiplier);
    ctx.fillText('25', centerX, centerY - 120 * sizeMultiplier);
    ctx.fillText('10', centerX, centerY - 165 * sizeMultiplier);
    ctx.fillText('5', centerX, centerY - 215 * sizeMultiplier);

    // Draw thrown darts
    throws.forEach(dart => {
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(dart.x, dart.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Dart tail
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dart.x, dart.y);
      ctx.lineTo(dart.x - 15, dart.y - 15);
      ctx.stroke();
    });

    // Draw current throw animation
    if (currentThrow) {
      const progress = currentThrow.progress;
      const x = currentThrow.targetX;
      const y = currentThrow.targetY;
      const startX = 300;
      const startY = 550;
      
      const currentX = startX + (x - startX) * progress;
      const currentY = startY + (y - startY) * progress;
      
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const calculateScore = (x, y) => {
    const centerX = 300;
    const centerY = 300;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const sizeMultiplier = DIFFICULTIES[difficulty].targetSize;

    if (distance <= 20 * sizeMultiplier) return 100;
    if (distance <= 50 * sizeMultiplier) return 50;
    if (distance <= 100 * sizeMultiplier) return 25;
    if (distance <= 150 * sizeMultiplier) return 10;
    if (distance <= 200 * sizeMultiplier) return 5;
    if (distance <= 240 * sizeMultiplier) return 2;
    return 0;
  };

  const throwDart = (e) => {
    if (gameOver || dartsLeft <= 0 || isPowering) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add some randomness based on power
    const accuracy = power / 100;
    const spread = 30 * (1 - accuracy);
    const finalX = x + (Math.random() - 0.5) * spread;
    const finalY = y + (Math.random() - 0.5) * spread;

    // Animate throw
    let progress = 0;
    const animate = () => {
      progress += 0.05;
      setCurrentThrow({ targetX: finalX, targetY: finalY, progress });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const points = calculateScore(finalX, finalY);
        setScore(prev => prev + points);
        setThrows(prev => [...prev, { x: finalX, y: finalY, points }]);
        setCurrentThrow(null);
        setDartsLeft(prev => {
          const newDarts = prev - 1;
          if (newDarts === 0) {
            endGame();
          }
          return newDarts;
        });
      }
    };
    animate();
  };

  const startPowering = () => {
    setIsPowering(true);
    setPower(0);
  };

  useEffect(() => {
    if (!isPowering) return;
    
    const interval = setInterval(() => {
      setPower(prev => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPowering]);

  const releasePower = () => {
    setIsPowering(false);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(`dart_best_${difficulty}`, score);
    }
  };

  const startGame = () => {
    setDartsLeft(DIFFICULTIES[difficulty].darts);
    setScore(0);
    setThrows([]);
    setGameOver(false);
    setPower(0);
    setShowMenu(false);
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Target className="w-16 h-16" />
              Dart Oyunu
            </h1>
            <p className="text-xl text-white/90">Hedefe nişan al ve yüksek skor yap!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Zorluk Seç</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(DIFFICULTIES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`p-6 rounded-xl font-semibold transition-all ${
                    difficulty === key
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{val.icon}</div>
                  <div className="text-lg">{val.name}</div>
                  <div className="text-sm opacity-75">{val.darts} dart</div>
                </button>
              ))}
            </div>

            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-6 text-center">
                <Trophy className="w-8 h-8 text-orange-600 inline mr-2" />
                <span className="text-xl font-bold text-orange-800">En İyi Skor: {bestScore}</span>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg"
            >
              <Crosshair className="inline w-6 h-6 mr-2" />
              Oyunu Başlat
            </button>

            <div className="mt-6 bg-blue-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2">💡 Nasıl Oynanır:</h3>
              <ul className="text-sm space-y-1">
                <li>• Tahtaya tıklayarak dart atın</li>
                <li>• Güç çubuğu dolup boşalır - doğru zamanda atın!</li>
                <li>• Merkezden puan: 100, 50, 25, 10, 5, 2</li>
                <li>• En yüksek skoru yapın!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-sm text-gray-600">Kalan Dart</div>
            <div className="text-3xl font-bold text-red-600">{dartsLeft}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-sm text-gray-600">Skor</div>
            <div className="text-3xl font-bold text-orange-600">{score}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-gray-600">En İyi</div>
            <div className="text-3xl font-bold text-yellow-600">{bestScore}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onClick={throwDart}
            onMouseDown={startPowering}
            onMouseUp={releasePower}
            className="border-4 border-gray-800 rounded-lg cursor-crosshair mx-auto"
          />
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Güç</span>
            <span className="text-sm font-bold text-orange-600">{power}%</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all"
              style={{ width: `${power}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Fare ile basılı tutun, doğru zamanda bırakın
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowMenu(true)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700"
          >
            <RotateCcw className="inline w-5 h-5 mr-2" />
            Menü
          </button>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-center text-orange-600 mb-4">Oyun Bitti!</h2>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-lg text-gray-700 mb-2">Final Skoru</div>
                <div className="text-5xl font-bold text-orange-600">{score}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Ortalama: {(score / DIFFICULTIES[difficulty].darts).toFixed(1)} puan/dart
                </div>
              </div>
              {score > bestScore && (
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 p-3 rounded-xl mb-4 text-center font-bold">
                  🎉 Yeni Rekor!
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Tekrar Oyna
                </button>
                <button
                  onClick={() => setShowMenu(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold"
                >
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

export default DartGame;
