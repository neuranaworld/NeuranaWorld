import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const SHAPES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' }, // I
  { shape: [[1,1],[1,1]], color: '#f0f000' }, // O
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' }, // T
  { shape: [[1,1,0],[0,1,1]], color: '#00f000' }, // S
  { shape: [[0,1,1],[1,1,0]], color: '#f00000' }, // Z
  { shape: [[1,0,0],[1,1,1]], color: '#0000f0' }, // J
  { shape: [[0,0,1],[1,1,1]], color: '#f0a000' }, // L
];

export default function TetrisGame() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);

  const createNewPiece = () => {
    const piece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { ...piece };
  };

  const checkCollision = (piece, pos, boardState = board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
          if (newY >= 0 && boardState[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    return newBoard;
  };

  const clearLines = (boardState) => {
    let linesCleared = 0;
    const newBoard = boardState.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  };

  const moveDown = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;
    
    const newPos = { x: position.x, y: position.y + 1 };
    if (checkCollision(currentPiece, newPos)) {
      const merged = mergePiece();
      const { board: clearedBoard, linesCleared } = clearLines(merged);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      
      const newPiece = createNewPiece();
      const startPos = { x: 4, y: 0 };
      
      if (checkCollision(newPiece, startPos, clearedBoard)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
        setPosition(startPos);
      }
    } else {
      setPosition(newPos);
    }
  }, [currentPiece, position, gameOver, isPaused]);

  const moveHorizontal = useCallback((dir) => {
    if (gameOver || isPaused || !currentPiece) return;
    const newPos = { x: position.x + dir, y: position.y };
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [currentPiece, position, gameOver, isPaused]);

  const rotate = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    const rotatedPiece = { ...currentPiece, shape: rotated };
    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, gameOver, isPaused]);

  const drop = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;
    let newPos = { ...position };
    while (!checkCollision(currentPiece, { x: newPos.x, y: newPos.y + 1 })) {
      newPos.y++;
    }
    setPosition(newPos);
    setTimeout(moveDown, 50);
  }, [currentPiece, position, gameOver, isPaused, moveDown]);

  useEffect(() => {
    if (!currentPiece) {
      setCurrentPiece(createNewPiece());
    }
  }, [currentPiece]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault(); // Sayfa kaydırmasını engelle
      if (e.key === 'ArrowLeft') moveHorizontal(-1);
      else if (e.key === 'ArrowRight') moveHorizontal(1);
      else if (e.key === 'ArrowDown') moveDown();
      else if (e.key === 'ArrowUp') rotate();
      else if (e.key === ' ') { e.preventDefault(); rotate(); }
      else if (e.key === 'Enter') drop();
      else if (e.key === 'p' || e.key === 'P') setIsPaused(prev => !prev);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveHorizontal, moveDown, rotate, drop]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const speed = Math.max(100, 1000 - (level - 1) * 100);
      const interval = setInterval(moveDown, speed);
      return () => clearInterval(interval);
    }
  }, [moveDown, gameOver, isPaused, level]);

  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1);
  }, [lines]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }
    return displayBoard;
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(null);
    setPosition({ x: 4, y: 0 });
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setLevel(1);
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🧱 Tetris</h1>
        <p className="subtitle">Seviye: {level} | Satırlar: {lines}</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="card" style={{ flex: '0 0 auto' }}>
          <div style={{ display: 'grid', gap: '1px', background: '#333', padding: '2px', borderRadius: '8px' }}>
            {renderBoard().map((row, y) => (
              <div key={y} style={{ display: 'flex', gap: '1px' }}>
                {row.map((cell, x) => (
                  <div
                    key={x}
                    style={{
                      width: '25px',
                      height: '25px',
                      background: cell || '#1a1a1a',
                      border: cell ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '250px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '15px' }}>📊 Skor</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>{score}</div>
            
            {gameOver && (
              <div className="alert error" style={{ marginBottom: '15px' }}>Oyun Bitti!</div>
            )}
            
            {isPaused && !gameOver && (
              <div className="alert warning" style={{ marginBottom: '15px' }}>Duraklatıldı</div>
            )}
            
            <button onClick={() => setIsPaused(!isPaused)} className="button" style={{ width: '100%', marginBottom: '10px' }} disabled={gameOver}>
              {isPaused ? '▶ Devam' : '⏸ Duraklat'}
            </button>
            
            <button onClick={resetGame} className="button orange" style={{ width: '100%' }}>🔄 Yeni Oyun</button>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>🎮 Kontroller</h3>
            <div style={{ fontSize: '14px', lineHeight: '2' }}>
              <div>← → : Sağa/Sola</div>
              <div>↓ : Hızlı İn</div>
              <div>↑ / Boşluk : Döndür</div>
              <div>Enter : Hızlı Düşür</div>
              <div>P : Duraklat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
