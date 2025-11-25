import React, { useState, useEffect } from 'react';
import { Puzzle, Trophy, RotateCcw, Clock, Star, Shuffle } from 'lucide-react';

const PuzzleGame = () => {
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const DIFFICULTIES = {
    easy: { size: 3, name: 'Kolay', icon: '🌱' },
    medium: { size: 4, name: 'Orta', icon: '🌿' },
    hard: { size: 5, name: 'Zor', icon: '🌳' },
  };

  useEffect(() => {
    const saved = localStorage.getItem(`puzzle_best_${size}x${size}`);
    if (saved) setBestMoves(parseInt(saved));
  }, [size]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      const timer = setTimeout(() => setTime(t => t + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, gameWon, time]);

  const initializeGame = () => {
    const total = size * size;
    let newTiles = Array.from({ length: total }, (_, i) => i);
    
    do {
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles, size) || isSolved(newTiles));

    setTiles(newTiles);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
    setGameWon(false);
    setShowMenu(false);
  };

  const isSolvable = (arr, gridSize) => {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
      }
    }
    const emptyRow = Math.floor(arr.indexOf(0) / gridSize);
    if (gridSize % 2 === 1) return inversions % 2 === 0;
    return (inversions + emptyRow) % 2 === 1;
  };

  const isSolved = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[arr.length - 1] === 0;
  };

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);

      if (isSolved(newTiles)) {
        setGameWon(true);
        setGameStarted(false);
        if (!bestMoves || moves + 1 < bestMoves) {
          setBestMoves(moves + 1);
          localStorage.setItem(`puzzle_best_${size}x${size}`, moves + 1);
        }
      }
    }
  };

  const getTilePosition = (index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    return { row, col };
  };

  const getTileColor = (num) => {
    const colors = [
      'from-red-400 to-pink-500',
      'from-orange-400 to-amber-500',
      'from-yellow-400 to-orange-500',
      'from-green-400 to-emerald-500',
      'from-cyan-400 to-blue-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-pink-400 to-rose-500',
    ];
    return colors[num % colors.length];
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Puzzle className="w-16 h-16" />
              Puzzle Oyunu
            </h1>
            <p className="text-xl text-white/90">Karoları sırala ve bulmacayı çöz!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Zorluk Seç</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(DIFFICULTIES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSize(val.size)}
                  className={`p-6 rounded-xl font-semibold transition-all ${
                    size === val.size
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{val.icon}</div>
                  <div className="text-lg">{val.name}</div>
                  <div className="text-sm opacity-75">{val.size}x{val.size}</div>
                </button>
              ))}
            </div>

            {bestMoves && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-600 inline mr-2" />
                <span className="text-xl font-bold text-yellow-800">En İyi: {bestMoves} hamle</span>
              </div>
            )}

            <button
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg"
            >
              <Shuffle className="inline w-6 h-6 mr-2" />
              Oyunu Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Süre</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-sm text-gray-600">Hamle</div>
            <div className="text-2xl font-bold text-purple-600">{moves}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-gray-600">En İyi</div>
            <div className="text-2xl font-bold text-yellow-600">{bestMoves || '-'}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-4">
          <div
            className="grid gap-2 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              width: size * 100 + (size - 1) * 8,
              maxWidth: '100%',
            }}
          >
            {tiles.map((num, idx) => (
              <div
                key={idx}
                onClick={() => num !== 0 && moveTile(idx)}
                className={`aspect-square flex items-center justify-center text-4xl font-bold rounded-xl transition-all cursor-pointer ${
                  num === 0
                    ? 'bg-gray-200'
                    : `bg-gradient-to-br ${getTileColor(num)} text-white hover:scale-105 shadow-lg`
                }`}
              >
                {num !== 0 && num}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={initializeGame}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 shadow-lg"
          >
            <Shuffle className="inline w-5 h-5 mr-2" />
            Yeni Oyun
          </button>
          <button
            onClick={() => setShowMenu(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 shadow-lg"
          >
            <RotateCcw className="inline w-5 h-5 mr-2" />
            Menü
          </button>
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-4">🎉 Tebrikler!</h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-lg text-gray-700 mb-2">Hamle Sayısı</div>
                <div className="text-4xl font-bold text-purple-600">{moves}</div>
                <div className="text-sm text-gray-600 mt-2">Süre: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={initializeGame}
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

export default PuzzleGame;
