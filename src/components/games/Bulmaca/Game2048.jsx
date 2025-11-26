import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Target } from 'lucide-react';

const Game2048 = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('2048-best');
    if (saved) setBestScore(parseInt(saved));
    initGame();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best', score.toString());
    }
  }, [score, bestScore]);

  const initGame = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const addRandomTile = (currentGrid) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const compress = (row) => {
    const newRow = row.filter(val => val !== 0);
    while (newRow.length < 4) {
      newRow.push(0);
    }
    return newRow;
  };

  const merge = (row) => {
    let newScore = 0;
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        newScore += row[i];
        if (row[i] === 2048 && !won) {
          setWon(true);
        }
      }
    }
    return { row, newScore };
  };

  const moveLeft = (currentGrid) => {
    let newGrid = currentGrid.map(row => [...row]);
    let totalScore = 0;
    let changed = false;

    for (let i = 0; i < 4; i++) {
      const original = [...newGrid[i]];
      newGrid[i] = compress(newGrid[i]);
      const { row, newScore } = merge(newGrid[i]);
      newGrid[i] = compress(row);
      totalScore += newScore;

      if (JSON.stringify(original) !== JSON.stringify(newGrid[i])) {
        changed = true;
      }
    }

    return { grid: newGrid, score: totalScore, changed };
  };

  const rotateGrid = (currentGrid) => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newGrid[i][j] = currentGrid[3 - j][i];
      }
    }
    return newGrid;
  };

  const move = useCallback((direction) => {
    if (gameOver) return;

    let currentGrid = grid.map(row => [...row]);
    let rotations = 0;

    if (direction === 'up') rotations = 1;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 3;

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    const { grid: movedGrid, score: addScore, changed } = moveLeft(currentGrid);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentGrid = rotateGrid(movedGrid);
    }

    if (changed) {
      addRandomTile(currentGrid);
      setGrid(currentGrid);
      setScore(prev => prev + addScore);
      setMoved(true);
      setTimeout(() => setMoved(false), 100);

      if (checkGameOver(currentGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver]);

  const checkGameOver = (currentGrid) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return false;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentGrid[i][j] === currentGrid[i][j + 1]) return false;
        if (currentGrid[j][i] === currentGrid[j + 1][i]) return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace('Arrow', '').toLowerCase();
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-200',
      2: 'bg-amber-100 text-gray-800',
      4: 'bg-amber-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-yellow-700 text-white',
      2048: 'bg-yellow-800 text-white',
      4096: 'bg-purple-600 text-white',
      8192: 'bg-purple-700 text-white',
    };
    return colors[value] || 'bg-gray-900 text-white';
  };

  const getTileSize = (value) => {
    if (value >= 1024) return 'text-3xl';
    if (value >= 128) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white">2048</h1>
          <button
            onClick={initGame}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Yeni Oyun
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-white/80 text-sm font-semibold mb-2 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" /> Skor
            </div>
            <div className="text-4xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-white/80 text-sm font-semibold mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" /> En İyi
            </div>
            <div className="text-4xl font-bold text-white">{bestScore}</div>
          </div>
        </div>

        <div className="bg-amber-600 p-4 rounded-3xl shadow-2xl mb-6">
          <div className="grid grid-cols-4 gap-4">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${getTileColor(cell)} ${getTileSize(cell)} font-bold rounded-2xl h-24 flex items-center justify-center transition-all duration-150 ${moved ? 'scale-95' : 'scale-100'} ${cell !== 0 ? 'shadow-lg' : ''}`}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs mx-auto">
          <div></div>
          <button
            onClick={() => move('up')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => move('left')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
          >
            ←
          </button>
          <button
            onClick={() => move('down')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
          >
            ↓
          </button>
          <button
            onClick={() => move('right')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
          >
            →
          </button>
        </div>

        {(gameOver || won) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl">
              <div className="text-6xl mb-4">{won ? '🎉' : '😢'}</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {won ? 'Kazandınız!' : 'Oyun Bitti!'}
              </h2>
              <p className="text-xl text-gray-600 mb-2">Final Skoru</p>
              <p className="text-5xl font-bold text-orange-500 mb-6">{score}</p>
              {score === bestScore && score > 0 && (
                <p className="text-green-600 font-semibold mb-4">🏆 Yeni Rekor!</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={initGame}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Tekrar Oyna
                </button>
                {won && !gameOver && (
                  <button
                    onClick={() => setWon(false)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Devam Et
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎮 Nasıl Oynanır?</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Ok tuşları</strong> veya <strong>ekrandaki butonlar</strong> ile karoları hareket ettirin</li>
            <li>• Aynı sayıdaki karolar birleşince <strong>değerleri toplanır</strong></li>
            <li>• <strong>2048</strong> sayısına ulaşmayı hedefleyin!</li>
            <li>• Hareket edecek yer kalmayınca oyun biter</li>
            <li>• Her hamleden sonra rastgele bir yere 2 veya 4 gelir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
