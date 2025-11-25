import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
};

export default function MinesweeperGame() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(0);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGame = () => {
    const config = DIFFICULTIES[difficulty];
    const newBoard = createBoard(config.rows, config.cols, config.mines);
    setBoard(newBoard);
    setRevealed(Array(config.rows).fill(null).map(() => Array(config.cols).fill(false)));
    setFlagged(Array(config.rows).fill(null).map(() => Array(config.cols).fill(false)));
    setGameOver(false);
    setWon(false);
    setMinesLeft(config.mines);
  };

  const createBoard = (rows, cols, mines) => {
    const board = Array(rows).fill(null).map(() => Array(cols).fill({ mine: false, count: 0 }));
    
    let placedMines = 0;
    while (placedMines < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!board[row][col].mine) {
        board[row][col] = { mine: true, count: 0 };
        placedMines++;
      }
    }
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r][c].mine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                count++;
              }
            }
          }
          board[r][c] = { mine: false, count };
        }
      }
    }
    
    return board;
  };

  const revealCell = (row, col) => {
    if (gameOver || won || flagged[row][col] || revealed[row][col]) return;
    
    const newRevealed = revealed.map(r => [...r]);
    
    if (board[row][col].mine) {
      newRevealed[row][col] = true;
      setRevealed(newRevealed);
      setGameOver(true);
      revealAllMines();
      return;
    }
    
    const config = DIFFICULTIES[difficulty];
    const queue = [[row, col]];
    const visited = new Set();
    
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const key = `${r},${c}`;
      
      if (visited.has(key) || r < 0 || r >= config.rows || c < 0 || c >= config.cols) continue;
      if (flagged[r][c] || newRevealed[r][c]) continue;
      
      visited.add(key);
      newRevealed[r][c] = true;
      
      if (board[r][c].count === 0) {
        queue.push([r-1, c], [r+1, c], [r, c-1], [r, c+1]);
        queue.push([r-1, c-1], [r-1, c+1], [r+1, c-1], [r+1, c+1]);
      }
    }
    
    setRevealed(newRevealed);
    checkWin(newRevealed);
  };

  const toggleFlag = (row, col, e) => {
    e.preventDefault();
    if (gameOver || won || revealed[row][col]) return;
    
    const newFlagged = flagged.map(r => [...r]);
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
    setMinesLeft(DIFFICULTIES[difficulty].mines - newFlagged.flat().filter(f => f).length);
  };

  const revealAllMines = () => {
    const newRevealed = revealed.map(r => [...r]);
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.mine) newRevealed[r][c] = true;
      });
    });
    setRevealed(newRevealed);
  };

  const checkWin = (revealedBoard) => {
    const config = DIFFICULTIES[difficulty];
    let revealedCount = 0;
    revealedBoard.forEach(row => row.forEach(cell => { if (cell) revealedCount++; }));
    
    if (revealedCount === config.rows * config.cols - config.mines) {
      setWon(true);
    }
  };

  const getCellContent = (row, col) => {
    if (flagged[row][col]) return '🚩';
    if (!revealed[row][col]) return '';
    if (board[row][col].mine) return '💣';
    if (board[row][col].count === 0) return '';
    return board[row][col].count;
  };

  const getCellColor = (count) => {
    const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
    return colors[count] || '#000';
  };

  return (
    <div className="page-container">
      <div className="header-gradient orange">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">💣 Mayın Tarlası</h1>
        <p className="subtitle">Kalan Mayın: {minesLeft}</p>
      </div>

      {(gameOver || won) && (
        <div className={`alert ${won ? 'success' : 'error'}`}>
          {won ? '🎉 Kazandınız!' : '💥 Oyun Bitti!'}
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setDifficulty('easy')} className={`button ${difficulty === 'easy' ? 'green' : ''}`} style={{ flex: 1 }}>Kolay</button>
          <button onClick={() => setDifficulty('medium')} className={`button ${difficulty === 'medium' ? 'orange' : ''}`} style={{ flex: 1 }}>Orta</button>
          <button onClick={() => setDifficulty('hard')} className="button" style={{ flex: 1 }}>Zor</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-block' }}>
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    onClick={() => revealCell(r, c)}
                    onContextMenu={(e) => toggleFlag(r, c, e)}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid #999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: revealed[r][c] ? '#ddd' : '#ccc',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: getCellColor(cell.count),
                      userSelect: 'none',
                    }}
                  >
                    {getCellContent(r, c)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button onClick={initGame} className="button" style={{ width: '100%' }}>🔄 Yeni Oyun</button>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '10px' }}>🎮 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>Sol tık: Hücreyi aç</li>
          <li>Sağ tık: Bayrak koy/kaldır</li>
          <li>Sayılar etraftaki mayın sayısını gösterir</li>
          <li>Tüm mayınsız hücreleri açarak kazan!</li>
        </ul>
      </div>
    </div>
  );
}
