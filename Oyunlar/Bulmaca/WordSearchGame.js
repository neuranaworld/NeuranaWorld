import React, { useState, useEffect } from 'react';
import { Search, Trophy, RotateCcw, Clock, Target, Lightbulb, Crown, Star } from 'lucide-react';

const WordSearchGame = () => {
  const GRID_SIZE = 12;
  
  const DIFFICULTY_LEVELS = {
    easy: { name: 'Kolay', words: 5, time: 300, icon: '🌱' },
    medium: { name: 'Orta', words: 8, time: 240, icon: '🌿' },
    hard: { name: 'Zor', words: 12, time: 180, icon: '🌳' },
  };

  const WORD_LISTS = {
    animals: ['FIL', 'ASLAN', 'KEDI', 'KOPEK', 'KUSLAR', 'BALIK', 'KARTAL', 'YILAN', 'KELEBEK', 'FARE', 'TAVSAN', 'AYI', 'KIRPI', 'ZURAFA'],
    colors: ['KIRMIZI', 'MAVI', 'YESIL', 'SARI', 'TURUNCU', 'MOR', 'PEMBE', 'SIYAH', 'BEYAZ', 'GRI', 'KAHVE', 'BORDO', 'LACIVERT', 'ALTIN'],
    fruits: ['ELMA', 'ARMUT', 'MUZ', 'UZUM', 'PORTAKAL', 'KARPUZ', 'KIRAZ', 'SEFTALI', 'KAYISI', 'KAVUN', 'LIMON', 'CILEK', 'MANGO', 'KIVI'],
    countries: ['TURKIYE', 'ALMANYA', 'FRANSA', 'ITALYA', 'ISPANYA', 'RUSYA', 'CIN', 'JAPONYA', 'BREZILYA', 'MISIR', 'KANADA', 'YUNANISTAN', 'ENDONEZYA', 'HINDISTAN'],
  };

  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('animals');
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [hints, setHints] = useState(3);
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`wordsearch_best_${difficulty}_${category}`);
    if (saved) setBestScore(parseInt(saved));
  }, [difficulty, category]);

  useEffect(() => {
    if (gameStarted && !gameWon && time > 0) {
      const timer = setTimeout(() => setTime(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, gameWon, time]);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const wordCount = DIFFICULTY_LEVELS[difficulty].words;
    const wordList = WORD_LISTS[category];
    const selectedWords = wordList.slice(0, wordCount);
    const placedWords = [];

    const directions = [[0,1], [1,0], [1,1], [0,-1], [-1,0], [-1,-1], [1,-1], [-1,1]];

    selectedWords.forEach((word) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placedWords.push({ word, row, col, direction });
          placed = true;
        }
        attempts++;
      }
    });

    const letters = 'ABCDEFGHIJKLMNOPRSTUVYZ';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setTime(DIFFICULTY_LEVELS[difficulty].time);
    setScore(0);
    setGameStarted(true);
    setGameWon(false);
    setShowMenu(false);
    setHints(3);
  };

  const canPlaceWord = (grid, word, row, col, [dr, dc]) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (grid, word, row, col, [dr, dc]) => {
    for (let i = 0; i < word.length; i++) {
      grid[row + i * dr][col + i * dc] = word[i];
    }
  };

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (isSelecting) {
      setSelectedCells(prev => [...prev, { row, col }]);
    }
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
    checkWord();
  };

  const checkWord = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const wordStr = selectedCells.map(({ row, col }) => grid[row][col]).join('');
    const reversedWord = wordStr.split('').reverse().join('');

    const foundWord = words.find(w => 
      (w.word === wordStr || w.word === reversedWord) && !foundWords.includes(w.word)
    );

    if (foundWord) {
      setFoundWords(prev => [...prev, foundWord.word]);
      setScore(prev => prev + foundWord.word.length * 10);

      if (foundWords.length + 1 === words.length) {
        setGameWon(true);
        setGameStarted(false);
        const finalScore = score + foundWord.word.length * 10 + time * 5;
        setScore(finalScore);
        if (finalScore > bestScore) {
          setBestScore(finalScore);
          localStorage.setItem(`wordsearch_best_${difficulty}_${category}`, finalScore);
        }
      }
    }
    setSelectedCells([]);
  };

  const useHint = () => {
    if (hints <= 0) return;
    const unfoundWord = words.find(w => !foundWords.includes(w.word));
    if (unfoundWord) {
      const cells = [];
      for (let i = 0; i < unfoundWord.word.length; i++) {
        cells.push({
          row: unfoundWord.row + i * unfoundWord.direction[0],
          col: unfoundWord.col + i * unfoundWord.direction[1],
        });
      }
      setSelectedCells(cells);
      setHints(prev => prev - 1);
      setScore(prev => Math.max(0, prev - 50));
      setTimeout(() => setSelectedCells([]), 2000);
    }
  };

  const isSelected = (row, col) => selectedCells.some(cell => cell.row === row && cell.col === col);
  
  const isFound = (row, col) => {
    return foundWords.some(word => {
      const wordObj = words.find(w => w.word === word);
      if (!wordObj) return false;
      for (let i = 0; i < word.length; i++) {
        if (wordObj.row + i * wordObj.direction[0] === row && 
            wordObj.col + i * wordObj.direction[1] === col) {
          return true;
        }
      }
      return false;
    });
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Search className="w-16 h-16" />
              Kelime Bulmaca
            </h1>
            <p className="text-xl text-white/90">Gizli kelimeleri bul ve kazanç!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Kategori Seç</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(WORD_LISTS).map(([key]) => (
                <button key={key} onClick={() => setCategory(key)}
                  className={`p-4 rounded-xl font-semibold transition-all ${category === key ?
                    'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {key === 'animals' && '🐾 Hayvanlar'}
                  {key === 'colors' && '🎨 Renkler'}
                  {key === 'fruits' && '🍎 Meyveler'}
                  {key === 'countries' && '🌍 Ülkeler'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Zorluk Seç</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, val]) => (
                <button key={key} onClick={() => setDifficulty(key)}
                  className={`p-4 rounded-xl font-semibold transition-all ${difficulty === key ?
                    'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <div className="text-3xl mb-1">{val.icon}</div>
                  <div>{val.name}</div>
                  <div className="text-sm">{val.words} kelime</div>
                </button>
              ))}
            </div>

            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl mb-6 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <span className="text-xl font-bold text-yellow-800">En İyi Skor: {bestScore}</span>
              </div>
            )}

            <button onClick={generateGrid}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg">
              🎮 Oyunu Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Süre</span>
            </div>
            <div className={`text-3xl font-bold ${time < 30 ? 'text-red-600' : 'text-blue-600'}`}>
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Bulunan</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {foundWords.length} / {words.length}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Skor</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{score}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-2xl">
            <div className="inline-grid gap-1 select-none" 
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
              onMouseUp={handleCellMouseUp}
              onMouseLeave={() => setIsSelecting(false)}>
              {grid.map((row, i) => row.map((cell, j) => (
                <div key={`${i}-${j}`}
                  onMouseDown={() => handleCellMouseDown(i, j)}
                  onMouseEnter={() => handleCellMouseEnter(i, j)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm md:text-base cursor-pointer transition-all ${
                    isFound(i, j) ? 'bg-green-400 text-white' :
                    isSelected(i, j) ? 'bg-yellow-300' :
                    'bg-gray-100 hover:bg-gray-200'
                  } rounded-lg`}>
                  {cell}
                </div>
              )))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Kelimeler</h3>
              <div className="space-y-2">
                {words.map((w, idx) => (
                  <div key={idx} className={`p-3 rounded-lg font-semibold ${
                    foundWords.includes(w.word) ?
                      'bg-green-100 text-green-700 line-through' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                    {w.word}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={useHint} disabled={hints <= 0}
              className={`w-full px-6 py-4 rounded-xl font-bold shadow-lg transition-all ${hints > 0 ?
                'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600' :
                'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <Lightbulb className="w-5 h-5 inline mr-2" />
              İpucu ({hints})
            </button>

            <button onClick={() => setShowMenu(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 shadow-lg">
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Ana Menü
            </button>
          </div>
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-4">🎉 Tebrikler!</h2>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{score} Puan</div>
                <div className="text-sm text-gray-600">Süre Bonusu: +{time * 5} puan</div>
              </div>
              <div className="flex gap-4">
                <button onClick={generateGrid}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
                  Tekrar Oyna
                </button>
                <button onClick={() => setShowMenu(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold">
                  Ana Menü
                </button>
              </div>
            </div>
          </div>
        )}

        {time === 0 && !gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
              <h2 className="text-4xl font-bold text-center text-red-600 mb-4">⏰ Süre Doldu!</h2>
              <p className="text-center text-xl mb-6">{foundWords.length} / {words.length} kelime buldunuz</p>
              <button onClick={() => setShowMenu(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold">
                Ana Menü
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearchGame;
