import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, User, Cpu, Trophy, Smile, Frown } from 'lucide-react';

const ConnectFourGame = () => {
  const navigate = useNavigate();
  const ROWS = 6;
  const COLS = 7;

  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red'); // red or yellow
  const [gameMode, setGameMode] = useState(null); // 'pvp' or 'ai'
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [scores, setScores] = useState({ red: 0, yellow: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('connect4-scores');
    if (saved) setScores(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('connect4-scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'yellow' && !winner) {
      setIsThinking(true);
      const timeout = setTimeout(() => {
        makeAIMove();
        setIsThinking(false);
      }, 500 + Math.random() * 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameMode, winner, board]);

  const checkWinner = (grid) => {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (
          grid[row][col] &&
          grid[row][col] === grid[row][col + 1] &&
          grid[row][col] === grid[row][col + 2] &&
          grid[row][col] === grid[row][col + 3]
        ) {
          return {
            winner: grid[row][col],
            cells: [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]
          };
        }
      }
    }

    // Check vertical
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS; col++) {
        if (
          grid[row][col] &&
          grid[row][col] === grid[row + 1][col] &&
          grid[row][col] === grid[row + 2][col] &&
          grid[row][col] === grid[row + 3][col]
        ) {
          return {
            winner: grid[row][col],
            cells: [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
          };
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (
          grid[row][col] &&
          grid[row][col] === grid[row + 1][col + 1] &&
          grid[row][col] === grid[row + 2][col + 2] &&
          grid[row][col] === grid[row + 3][col + 3]
        ) {
          return {
            winner: grid[row][col],
            cells: [[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]
          };
        }
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (
          grid[row][col] &&
          grid[row][col] === grid[row - 1][col + 1] &&
          grid[row][col] === grid[row - 2][col + 2] &&
          grid[row][col] === grid[row - 3][col + 3]
        ) {
          return {
            winner: grid[row][col],
            cells: [[row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]]
          };
        }
      }
    }

    // Check for draw
    const isFull = grid.every(row => row.every(cell => cell !== null));
    if (isFull) {
      return { winner: 'draw', cells: [] };
    }

    return null;
  };

  const dropPiece = (col) => {
    if (winner || isThinking) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          setWinner(result.winner);
          setWinningCells(result.cells);
          if (result.winner === 'red') {
            setScores(s => ({ ...s, red: s.red + 1 }));
          } else if (result.winner === 'yellow') {
            setScores(s => ({ ...s, yellow: s.yellow + 1 }));
          } else {
            setScores(s => ({ ...s, draws: s.draws + 1 }));
          }
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        return;
      }
    }
  };

  const evaluateBoard = (grid, player) => {
    let score = 0;
    const opponent = player === 'red' ? 'yellow' : 'red';

    // Helper to evaluate a line of 4 cells
    const evaluateLine = (cells) => {
      const playerCount = cells.filter(c => c === player).length;
      const opponentCount = cells.filter(c => c === opponent).length;
      const emptyCount = cells.filter(c => c === null).length;

      if (playerCount === 4) return 100;
      if (opponentCount === 4) return -100;
      if (playerCount === 3 && emptyCount === 1) return 5;
      if (playerCount === 2 && emptyCount === 2) return 2;
      if (opponentCount === 3 && emptyCount === 1) return -50;

      return 0;
    };

    // Check all possible 4-cell windows
    // Horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        score += evaluateLine([grid[row][col], grid[row][col + 1], grid[row][col + 2], grid[row][col + 3]]);
      }
    }

    // Vertical
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS; col++) {
        score += evaluateLine([grid[row][col], grid[row + 1][col], grid[row + 2][col], grid[row + 3][col]]);
      }
    }

    // Diagonal
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        score += evaluateLine([grid[row][col], grid[row + 1][col + 1], grid[row + 2][col + 2], grid[row + 3][col + 3]]);
        score += evaluateLine([grid[row + 3][col], grid[row + 2][col + 1], grid[row + 1][col + 2], grid[row][col + 3]]);
      }
    }

    return score;
  };

  const getValidColumns = (grid) => {
    return Array.from({ length: COLS }, (_, col) => col).filter(col => grid[0][col] === null);
  };

  const makeAIMove = () => {
    const validCols = getValidColumns(board);
    if (validCols.length === 0) return;

    let bestCol;

    if (difficulty === 'easy') {
      // Easy: Random move
      bestCol = validCols[Math.floor(Math.random() * validCols.length)];
    } else if (difficulty === 'medium') {
      // Medium: Block opponent wins and look for own wins
      bestCol = validCols[0];
      let bestScore = -Infinity;

      for (const col of validCols) {
        const testBoard = board.map(r => [...r]);
        for (let row = ROWS - 1; row >= 0; row--) {
          if (testBoard[row][col] === null) {
            testBoard[row][col] = 'yellow';
            const result = checkWinner(testBoard);
            if (result && result.winner === 'yellow') {
              bestCol = col;
              break;
            }
            testBoard[row][col] = 'red';
            const blockResult = checkWinner(testBoard);
            if (blockResult && blockResult.winner === 'red') {
              bestCol = col;
            }
            testBoard[row][col] = null;
            break;
          }
        }
      }
    } else {
      // Hard: Minimax with evaluation
      let bestScore = -Infinity;
      bestCol = validCols[0];

      for (const col of validCols) {
        const testBoard = board.map(r => [...r]);
        for (let row = ROWS - 1; row >= 0; row--) {
          if (testBoard[row][col] === null) {
            testBoard[row][col] = 'yellow';
            const score = evaluateBoard(testBoard, 'yellow');
            if (score > bestScore) {
              bestScore = score;
              bestCol = col;
            }
            break;
          }
        }
      }
    }

    dropPiece(bestCol);
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
  };

  const resetAll = () => {
    resetGame();
    setGameMode(null);
    setScores({ red: 0, yellow: 0, draws: 0 });
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-orange-500 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate('/games')}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Geri
            </button>
            <h1 className="text-5xl font-bold text-white">Connect Four</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Oyun Modu Seç</h2>

            <div className="space-y-4">
              <button onClick={() => setGameMode('pvp')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition">
                <User className="w-8 h-8" />
                İki Oyuncu
                <User className="w-8 h-8" />
              </button>

              <div className="bg-gray-100 rounded-2xl p-6">
                <button onClick={() => setGameMode('ai')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition mb-4">
                  <User className="w-8 h-8" />
                  Bilgisayara Karşı
                  <Cpu className="w-8 h-8" />
                </button>

                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-4 py-2 rounded-xl font-semibold transition ${difficulty === diff ?
                        'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
                      {diff === 'easy' ? 'Kolay' : diff === 'medium' ? 'Orta' : 'Zor'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-orange-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={resetAll}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Ana Menü
          </button>
          <h1 className="text-5xl font-bold text-white">Connect Four</h1>
          <button onClick={resetGame}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Yeni Oyun
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-white/80 text-sm mb-2 flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              Kırmızı
            </div>
            <div className="text-4xl font-bold text-white">{scores.red}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-white/80 text-sm mb-2">Beraberlik</div>
            <div className="text-4xl font-bold text-white">{scores.draws}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-white/80 text-sm mb-2 flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
              Sarı
            </div>
            <div className="text-4xl font-bold text-white">{scores.yellow}</div>
          </div>
        </div>

        {!winner && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-8 h-8 rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-400'} animate-pulse`}></div>
              <span className="text-2xl font-bold text-white">
                {isThinking ? 'Bilgisayar düşünüyor...' : `${currentPlayer === 'red' ? 'Kırmızı' : 'Sarı'} Oyuncunun Sırası`}
              </span>
              {gameMode === 'ai' && currentPlayer === 'red' && <User className="w-6 h-6 text-white" />}
              {gameMode === 'ai' && currentPlayer === 'yellow' && <Cpu className="w-6 h-6 text-white" />}
            </div>
          </div>
        )}

        <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: COLS }, (_, col) => (
              <div key={col} className="flex flex-col gap-2">
                <button
                  onClick={() => dropPiece(col)}
                  onMouseEnter={() => setHoveredColumn(col)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  disabled={winner !== null || isThinking}
                  className={`h-12 rounded-xl transition ${hoveredColumn === col && !winner && !isThinking ?
                    'bg-white/30 scale-105' : 'bg-transparent'} hover:bg-white/20 disabled:cursor-not-allowed`}>
                  {hoveredColumn === col && !winner && !isThinking && (
                    <div className={`w-full h-full rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-400'} opacity-50`}></div>
                  )}
                </button>
                {Array.from({ length: ROWS }, (_, row) => (
                  <div key={row} className={`aspect-square rounded-full ${isWinningCell(row, col) ?
                    'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' :
                    board[row][col] === 'red' ? 'bg-red-500' :
                      board[row][col] === 'yellow' ? 'bg-yellow-400' :
                        'bg-white/90'} transition-all duration-300`}>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {winner && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className={`rounded-3xl p-8 max-w-md text-center shadow-2xl ${winner === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                winner === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-br from-gray-600 to-gray-800'}`}>
              <div className="text-6xl mb-4">
                {winner === 'red' ? <Smile className="w-20 h-20 mx-auto text-white" /> :
                  winner === 'yellow' ? <Smile className="w-20 h-20 mx-auto text-white" /> :
                    <Frown className="w-20 h-20 mx-auto text-white" />}
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                {winner === 'draw' ? 'Berabere!' :
                  `${winner === 'red' ? 'Kırmızı' : 'Sarı'} Kazandı!`}
              </h2>
              {winner !== 'draw' && (
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${winner === 'red' ? 'bg-red-700' : 'bg-yellow-500'} shadow-2xl`}></div>
              )}
              <div className="flex gap-3">
                <button onClick={resetGame}
                  className="flex-1 bg-white text-gray-800 hover:bg-gray-100 px-6 py-4 rounded-xl font-bold text-lg">
                  Tekrar Oyna
                </button>
                <button onClick={resetAll}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-900 px-6 py-4 rounded-xl font-bold text-lg">
                  Ana Menü
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">🎮 Nasıl Oynanır?</h3>
          <ul className="space-y-2 text-sm">
            <li>• Sütuna tıklayarak taşınızı bırakın</li>
            <li>• Yatay, dikey veya çapraz 4 taş yan yana getirin</li>
            <li>• İlk 4 taşı yan yana getiren kazanır!</li>
            {gameMode === 'ai' && <li>• <strong>Zorluk:</strong> {difficulty === 'easy' ? 'Kolay (Rastgele)' : difficulty === 'medium' ? 'Orta (Akıllı)' : 'Zor (Uzman)'}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectFourGame;
