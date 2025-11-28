import React, { useState, useEffect, useRef } from 'react';
import { Puzzle, Trophy, RotateCcw, Shuffle, Image as ImageIcon, Clock, Star } from 'lucide-react';

const JigsawPuzzle = () => {
  const canvasRef = useRef(null);
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [completedPieces, setCompletedPieces] = useState([]);
  const [image, setImage] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [bestTime, setBestTime] = useState(null);

  const IMAGES = [
    { id: 1, name: 'Doğa Manzarası', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop' },
    { id: 2, name: 'Gökyüzü', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=600&fit=crop' },
    { id: 3, name: 'Deniz', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=600&fit=crop' },
    { id: 4, name: 'Şehir', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=600&fit=crop' },
  ];

  const DIFFICULTIES = {
    easy: { size: 3, name: 'Kolay (3x3)', icon: '🌱' },
    medium: { size: 4, name: 'Orta (4x4)', icon: '🌿' },
    hard: { size: 5, name: 'Zor (5x5)', icon: '🌳' },
    expert: { size: 6, name: 'Uzman (6x6)', icon: '👑' },
  };

  useEffect(() => {
    const saved = localStorage.getItem(`jigsaw_best_${gridSize}x${gridSize}`);
    if (saved) setBestTime(parseInt(saved));
  }, [gridSize]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      const timer = setTimeout(() => setTime(t => t + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, gameWon, time]);

  useEffect(() => {
    if (image) {
      drawPuzzle();
    }
  }, [pieces, selectedPiece, completedPieces]); // eslint-disable-line

  const loadImage = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      initializePuzzle(img);
    };
    img.src = imageUrl;
  };

  const initializePuzzle = (img) => {
    const pieceWidth = 600 / gridSize;
    const pieceHeight = 600 / gridSize;
    const newPieces = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newPieces.push({
          id: row * gridSize + col,
          correctRow: row,
          correctCol: col,
          currentX: Math.random() * 400 + 100,
          currentY: Math.random() * 400 + 100,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentX, newPieces[j].currentX] = [newPieces[j].currentX, newPieces[i].currentX];
      [newPieces[i].currentY, newPieces[j].currentY] = [newPieces[j].currentY, newPieces[i].currentY];
    }

    setPieces(newPieces);
    setCompletedPieces([]);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
    setGameWon(false);
    setShowMenu(false);
  };

  const drawPuzzle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, 800, 700);

    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 800, 700);

    // Draw grid outline
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    for (let row = 0; row <= gridSize; row++) {
      ctx.beginPath();
      ctx.moveTo(100, 50 + row * (600 / gridSize));
      ctx.lineTo(700, 50 + row * (600 / gridSize));
      ctx.stroke();
    }
    for (let col = 0; col <= gridSize; col++) {
      ctx.beginPath();
      ctx.moveTo(100 + col * (600 / gridSize), 50);
      ctx.lineTo(100 + col * (600 / gridSize), 650);
      ctx.stroke();
    }

    // Draw completed pieces first
    completedPieces.forEach(pieceId => {
      const piece = pieces.find(p => p.id === pieceId);
      if (!piece) return;

      const targetX = 100 + piece.correctCol * piece.width;
      const targetY = 50 + piece.correctRow * piece.height;

      ctx.save();
      ctx.beginPath();
      ctx.rect(targetX, targetY, piece.width, piece.height);
      ctx.clip();

      ctx.drawImage(
        image,
        piece.correctCol * piece.width, piece.correctRow * piece.height,
        piece.width, piece.height,
        targetX, targetY,
        piece.width, piece.height
      );

      ctx.restore();

      // Green border for completed
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.strokeRect(targetX, targetY, piece.width, piece.height);
    });

    // Draw uncompleted pieces
    pieces.forEach(piece => {
      if (completedPieces.includes(piece.id)) return;

      ctx.save();
      
      // Shadow for selected piece
      if (selectedPiece === piece.id) {
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 15;
      }

      ctx.beginPath();
      ctx.rect(piece.currentX, piece.currentY, piece.width, piece.height);
      ctx.clip();

      ctx.drawImage(
        image,
        piece.correctCol * piece.width, piece.correctRow * piece.height,
        piece.width, piece.height,
        piece.currentX, piece.currentY,
        piece.width, piece.height
      );

      ctx.restore();

      // Border
      ctx.strokeStyle = selectedPiece === piece.id ? '#3b82f6' : '#9ca3af';
      ctx.lineWidth = selectedPiece === piece.id ? 3 : 2;
      ctx.strokeRect(piece.currentX, piece.currentY, piece.width, piece.height);

      // Piece number
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(piece.currentX, piece.currentY, 30, 25);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(piece.id + 1, piece.currentX + 10, piece.currentY + 17);
    });
  };

  const handleCanvasClick = (e) => {
    if (gameWon) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a piece
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (completedPieces.includes(piece.id)) continue;

      if (
        x >= piece.currentX &&
        x <= piece.currentX + piece.width &&
        y >= piece.currentY &&
        y <= piece.currentY + piece.height
      ) {
        if (selectedPiece === piece.id) {
          // Deselect
          setSelectedPiece(null);
        } else {
          setSelectedPiece(piece.id);
        }
        return;
      }
    }

    // Check if clicking on grid to place piece
    if (selectedPiece !== null) {
      const gridX = Math.floor((x - 100) / (600 / gridSize));
      const gridY = Math.floor((y - 50) / (600 / gridSize));

      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        const piece = pieces.find(p => p.id === selectedPiece);
        if (piece && piece.correctCol === gridX && piece.correctRow === gridY) {
          // Correct placement!
          setCompletedPieces(prev => [...prev, selectedPiece]);
          setSelectedPiece(null);
          setMoves(prev => prev + 1);

          // Check win
          if (completedPieces.length + 1 === pieces.length) {
            setGameWon(true);
            setGameStarted(false);
            if (!bestTime || time < bestTime) {
              setBestTime(time);
              localStorage.setItem(`jigsaw_best_${gridSize}x${gridSize}`, time);
            }
          }
        } else {
          setMoves(prev => prev + 1);
        }
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Puzzle className="w-16 h-16" />
              Jigsaw Puzzle
            </h1>
            <p className="text-xl text-white/90">Parçaları birleştir, resmi tamamla!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Resim Seç</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {IMAGES.map(img => (
                <button
                  key={img.id}
                  onClick={() => loadImage(img.url)}
                  className="relative overflow-hidden rounded-xl group"
                >
                  <img src={img.url} alt={img.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{img.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Zorluk Seç</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(DIFFICULTIES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setGridSize(val.size)}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    gridSize === val.size
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">{val.icon}</div>
                  <div className="text-sm">{val.name}</div>
                </button>
              ))}
            </div>

            {bestTime && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl text-center">
                <Trophy className="w-8 h-8 text-yellow-600 inline mr-2" />
                <span className="text-xl font-bold text-yellow-800">En İyi Süre: {formatTime(bestTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Süre</div>
            <div className="text-2xl font-bold text-blue-600">{formatTime(time)}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-sm text-gray-600">Hamle</div>
            <div className="text-2xl font-bold text-purple-600">{moves}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Puzzle className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-sm text-gray-600">Tamamlanan</div>
            <div className="text-2xl font-bold text-green-600">{completedPieces.length}/{pieces.length}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-gray-600">En İyi</div>
            <div className="text-2xl font-bold text-yellow-600">{bestTime ? formatTime(bestTime) : '-'}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={700}
            onClick={handleCanvasClick}
            className="border-4 border-gray-800 rounded-lg cursor-pointer mx-auto"
          />
          <p className="text-center text-sm text-gray-600 mt-4">
            💡 Parçaya tıklayarak seç, sonra doğru yere tıklayarak yerleştir
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => initializePuzzle(image)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700"
          >
            <Shuffle className="inline w-5 h-5 mr-2" />
            Yeni Karıştır
          </button>
          <button
            onClick={() => {
              setShowMenu(true);
              setGameStarted(false);
            }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600"
          >
            <RotateCcw className="inline w-5 h-5 mr-2" />
            Menü
          </button>
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-4">🎉 Tebrikler!</h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-lg text-gray-700 mb-2">Tamamlama Süresi</div>
                <div className="text-4xl font-bold text-purple-600">{formatTime(time)}</div>
                <div className="text-sm text-gray-600 mt-2">Hamle: {moves}</div>
              </div>
              {time < bestTime && (
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 p-3 rounded-xl mb-4 text-center font-bold">
                  🏆 Yeni Rekor!
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => initializePuzzle(image)}
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

export default JigsawPuzzle;
