import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Clock, Star, RotateCcw, Zap, Award, Crown, Sparkles, Target, Flame } from 'lucide-react';

const THEMES = {
  emojis: {
    name: '😊 Emojiler',
    cards: ['😀', '😍', '🎉', '🌟', '🔥', '💎', '🎮', '🎯', '🎨', '🎵', '🚀', '⚡', '🌈', '🦄', '🐱', '🐶', '🦊', '🐼', '🦁', '🐯'],
    bg: 'from-yellow-400 to-orange-500'
  },
  animals: {
    name: '🐾 Hayvanlar',
    cards: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉'],
    bg: 'from-green-400 to-blue-500'
  },
  food: {
    name: '🍕 Yemekler',
    cards: ['🍎', '🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🍯', '🍓', '🍌', '🍉', '🍇'],
    bg: 'from-pink-400 to-red-500'
  },
  space: {
    name: '🚀 Uzay',
    cards: ['🌍', '🌎', '🌏', '🌑', '🌕', '⭐', '🌟', '💫', '✨', '☄️', '🚀', '🛸', '🛰️', '🌌', '🔭', '👽', '🪐', '🌠', '☀️', '🌙'],
    bg: 'from-purple-400 to-indigo-600'
  },
  sports: {
    name: '⚽ Spor',
    cards: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥅', '⛳', '🎯', '🥊', '🥋', '⛷️', '🏊'],
    bg: 'from-blue-400 to-cyan-500'
  }
};

const DIFFICULTY_LEVELS = {
  easy: { name: 'Kolay', pairs: 6, timeBonus: 0, icon: '🌱' },
  medium: { name: 'Orta', pairs: 10, timeBonus: 30, icon: '🌿' },
  hard: { name: 'Zor', pairs: 15, timeBonus: 60, icon: '🌳' },
  expert: { name: 'Uzman', pairs: 18, timeBonus: 90, icon: '👑' }
};

export default function MemoryGame() {
  const [theme, setTheme] = useState('emojis');
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(null);
  const [perfectGame, setPerfectGame] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`memory_best_${difficulty}_${theme}`);
    if (saved) setBestScore(parseInt(saved));
  }, [difficulty, theme]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      const timer = setInterval(() => setTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].value === cards[second].value) {
        setTimeout(() => {
          setMatchedCards(prev => [...prev, first, second]);
          setFlippedCards([]);
          setCombo(prev => prev + 1);
          setScore(prev => prev + (10 * (combo + 1)));
          createParticles(first);
          checkWin();
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setCombo(0);
          setPerfectGame(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards]); // eslint-disable-line

  const createParticles = (index) => {
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const initializeGame = () => {
    const numPairs = DIFFICULTY_LEVELS[difficulty].pairs;
    const themeCards = THEMES[theme].cards;
    const selectedCards = themeCards.slice(0, numPairs);
    const gameCards = [...selectedCards, ...selectedCards]
      .map((value, index) => ({ id: index, value }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setScore(0);
    setCombo(0);
    setGameStarted(true);
    setGameWon(false);
    setShowMenu(false);
    setHintsLeft(3);
    setPerfectGame(true);
    setAchievements([]);
  };

  const checkWin = () => {
    setTimeout(() => {
      if (matchedCards.length + 2 === cards.length) {
        setGameWon(true);
        setGameStarted(false);

        const timeBonus = Math.max(0, DIFFICULTY_LEVELS[difficulty].timeBonus - time) * 10;
        const moveBonus = Math.max(0, (100 - moves) * 5);
        const comboBonus = combo * 50;
        const finalScore = score + timeBonus + moveBonus + comboBonus;
        setScore(finalScore);

        const newAchievements = [];
        if (perfectGame) newAchievements.push({ icon: '💎', text: 'Mükemmel Oyun!' });
        if (moves <= DIFFICULTY_LEVELS[difficulty].pairs * 1.5) newAchievements.push({ icon: '🎯', text: 'Az Hamle!' });
        if (time <= DIFFICULTY_LEVELS[difficulty].timeBonus / 2) newAchievements.push({ icon: '⚡', text: 'Hızlı!' });
        if (combo >= 5) newAchievements.push({ icon: '🔥', text: 'Süper Combo!' });
        setAchievements(newAchievements);

        if (finalScore > bestScore) {
          setBestScore(finalScore);
          localStorage.setItem(`memory_best_${difficulty}_${theme}`, finalScore);
        }
      }
    }, 100);
  };

  const handleCardClick = (index) => {
    if (!gameStarted || flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }
    setFlippedCards(prev => [...prev, index]);
  };

  const useHint = () => {
    if (hintsLeft <= 0 || matchedCards.length === cards.length) return;

    const unmatched = cards
      .map((card, idx) => ({ ...card, idx }))
      .filter((card, idx) => !matchedCards.includes(idx));

    const randomCard = unmatched[Math.floor(Math.random() * unmatched.length)];
    const pair = unmatched.find(c => c.value === randomCard.value && c.idx !== randomCard.idx);

    if (pair) {
      setShowHint([randomCard.idx, pair.idx]);
      setTimeout(() => setShowHint(null), 2000);
      setHintsLeft(prev => prev - 1);
      setScore(prev => Math.max(0, prev - 50));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Brain className="w-16 h-16" />
              Hafıza Oyunu
            </h1>
            <p className="text-xl text-white/90">Kartları eşleştir ve en yüksek skoru kap!</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Tema Seç
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(THEMES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                    theme === key
                      ? `bg-gradient-to-r ${val.bg} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {val.name}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-500" />
              Zorluk Seç
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    difficulty === key
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">{val.icon}</div>
                  <div>{val.name}</div>
                  <div className="text-sm opacity-75">{val.pairs} çift</div>
                </button>
              ))}
            </div>

            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl mb-6 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <span className="text-xl font-bold text-yellow-800">
                  En İyi Skor: {bestScore}
                </span>
              </div>
            )}

            <button
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Oyunu Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme].bg} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Süre</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatTime(time)}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">Hamle</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Skor</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{score}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">Combo</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{combo}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">İpucu</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{hintsLeft}</div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">En İyi</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{bestScore}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className={`grid gap-3 mb-6 ${
          difficulty === 'easy' ? 'grid-cols-4' :
          difficulty === 'medium' ? 'grid-cols-5' :
          difficulty === 'hard' ? 'grid-cols-6' :
          'grid-cols-6'
        }`}>
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            const isMatched = matchedCards.includes(index);
            const isHint = showHint?.includes(index);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square cursor-pointer transition-all duration-500 transform perspective-1000 ${
                  isFlipped ? 'rotate-y-180' : ''
                } ${isMatched ? 'scale-105' : 'hover:scale-110'} ${
                  isHint ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative w-full h-full">
                  {/* Card Back */}
                  <div className={`absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                    isFlipped ? 'opacity-0' : 'opacity-100'
                  } bg-gradient-to-br from-purple-500 to-pink-500`}>
                    <Brain className="w-1/2 h-1/2 opacity-50" />
                  </div>

                  {/* Card Front */}
                  <div className={`absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center shadow-lg ${
                    isFlipped ? 'opacity-100 rotate-y-180' : 'opacity-0'
                  } ${isMatched ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-white'}`}>
                    <span className="text-5xl md:text-6xl">{card.value}</span>
                    {particles.length > 0 && isMatched && (
                      <div className="absolute inset-0">
                        {particles.map(p => (
                          <div
                            key={p.id}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={useHint}
            disabled={hintsLeft <= 0}
            className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
              hintsLeft > 0
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-5 h-5 inline mr-2" />
            İpucu Kullan ({hintsLeft})
          </button>

          <button
            onClick={() => {
              setShowMenu(true);
              setGameStarted(false);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Yeni Oyun
          </button>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
              <div className="text-center">
                <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin-slow" />
                <h2 className="text-4xl font-bold text-purple-600 mb-4">🎉 Tebrikler!</h2>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{score} Puan</div>
                  <div className="text-sm text-gray-600">
                    <div>⏱️ Süre: {formatTime(time)}</div>
                    <div>🎯 Hamle: {moves}</div>
                    <div>🔥 En Yüksek Combo: {combo}</div>
                  </div>
                </div>

                {achievements.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">🏆 Başarılar:</h3>
                    <div className="space-y-2">
                      {achievements.map((ach, idx) => (
                        <div key={idx} className="bg-purple-100 rounded-lg p-2 flex items-center gap-2">
                          <span className="text-2xl">{ach.icon}</span>
                          <span className="font-semibold text-purple-700">{ach.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {score > bestScore && (
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3 mb-4">
                    <Award className="w-8 h-8 text-purple-600 inline mr-2" />
                    <span className="font-bold text-purple-700">Yeni Rekor!</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={initializeGame}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700"
                  >
                    Tekrar Oyna
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(true);
                      setGameWon(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700"
                  >
                    Ana Menü
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
