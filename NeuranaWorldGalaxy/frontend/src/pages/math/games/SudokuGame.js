import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SudokuGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const startNewGame = async () => {
    setLoading(true);
    setFeedback(null);
    setMistakes(0);
    setCompleted(false);

    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/math/sudoku/start?user_id=${userId}&difficulty=${difficulty}`);
      setGameId(response.data.game_id);
      setBoard(response.data.board);
      setOriginalBoard(JSON.parse(JSON.stringify(response.data.board)));
    } catch (error) {
      console.error('Sudoku start error:', error);
      setFeedback({ type: 'error', message: 'Sudoku oluşturulamadı' });
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (row, col) => {
    if (originalBoard[row] && originalBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || completed) return;
    
    const newBoard = [...board];
    newBoard[selectedCell.row][selectedCell.col] = num;
    setBoard(newBoard);

    checkSudoku(newBoard);
  };

  const checkSudoku = async (currentBoard) => {
    try {
      const response = await axios.post(`${API}/games/math/sudoku/check`, {
        game_id: gameId,
        board: currentBoard,
      });

      if (response.data.is_complete) {
        setCompleted(true);
        setFeedback({ type: 'success', message: '🎉 Tebrikler! Sudoku tamamlandı!' });
      } else if (response.data.mistakes > mistakes) {
        setMistakes(response.data.mistakes);
        setFeedback({ type: 'warning', message: 'Hatalı hamle!' });
        setTimeout(() => setFeedback(null), 2000);
      }
    } catch (error) {
      console.error('Check error:', error);
    }
  };

  const clearCell = () => {
    if (!selectedCell || completed) return;
    const newBoard = [...board];
    newBoard[selectedCell.row][selectedCell.col] = 0;
    setBoard(newBoard);
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🧩 Sudoku</h1>
        <p className="subtitle">Hatalar: {mistakes}/3</p>
      </div>

      {feedback && <div className={`alert ${feedback.type}`}>{feedback.message}</div>}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Zorluk:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setDifficulty('easy')}
              className={`button ${difficulty === 'easy' ? 'green' : ''}`}
              style={{ flex: 1, opacity: difficulty === 'easy' ? 1 : 0.6 }}
            >
              Kolay
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className="button orange"
              style={{ flex: 1, opacity: difficulty === 'medium' ? 1 : 0.6 }}
            >
              Orta
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className="button"
              style={{ flex: 1, opacity: difficulty === 'hard' ? 1 : 0.6 }}
            >
              Zor
            </button>
          </div>
        </div>

        {/* Sudoku Board */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-block' }}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex' }}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #ddd',
                      borderRight: colIndex % 3 === 2 ? '3px solid #333' : undefined,
                      borderBottom: rowIndex % 3 === 2 ? '3px solid #333' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: originalBoard[rowIndex][colIndex] === 0 ? 'pointer' : 'not-allowed',
                      background:
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          ? '#667eea'
                          : originalBoard[rowIndex][colIndex] !== 0
                          ? '#f8f9fa'
                          : 'white',
                      color:
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          ? 'white'
                          : originalBoard[rowIndex][colIndex] !== 0
                          ? '#333'
                          : '#667eea',
                      fontWeight: originalBoard[rowIndex][colIndex] !== 0 ? 'bold' : 'normal',
                      fontSize: '18px',
                    }}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Number Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '15px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="button"
              style={{ padding: '15px', fontSize: '20px' }}
              disabled={!selectedCell || completed}
            >
              {num}
            </button>
          ))}
          <button
            onClick={clearCell}
            className="button orange"
            style={{ gridColumn: 'span 2', padding: '15px' }}
            disabled={!selectedCell || completed}
          >
            🗑 Temizle
          </button>
        </div>

        {completed && (
          <button onClick={startNewGame} className="button green" style={{ width: '100%' }}>
            🔄 Yeni Oyun
          </button>
        )}
      </div>
    </div>
  );
}
