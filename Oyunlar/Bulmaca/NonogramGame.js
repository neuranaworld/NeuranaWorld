import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NonogramGame() {
  const navigate = useNavigate();
  
  // Basit 5x5 puzzle
  const puzzles = [
    {
      name: 'Kalp',
      solution: [
        [0,1,0,1,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,0,1,0,0],
      ],
      rowHints: [[1,1], [5], [5], [3], [1]],
      colHints: [[2], [4], [5], [4], [2]],
    },
    {
      name: 'Yıldız',
      solution: [
        [0,0,1,0,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,1,0,1,0],
      ],
      rowHints: [[1], [3], [5], [3], [1,1]],
      colHints: [[1], [3], [5], [3], [1]],
    },
  ];

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [grid, setGrid] = useState(Array(5).fill(null).map(() => Array(5).fill(0)));
  const [completed, setCompleted] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const toggleCell = (row, col) => {
    if (completed) return;
    
    const newGrid = grid.map((r, i) => 
      r.map((c, j) => (i === row && j === col ? (c + 1) % 3 : c))
    );
    setGrid(newGrid);
    
    checkWin(newGrid);
  };

  const checkWin = (currentGrid) => {
    const isCorrect = currentGrid.every((row, r) =>
      row.every((cell, c) => 
        (cell === 1 && currentPuzzle.solution[r][c] === 1) ||
        (cell !== 1 && currentPuzzle.solution[r][c] === 0)
      )
    );
    
    if (isCorrect) {
      setCompleted(true);
    }
  };

  const resetPuzzle = () => {
    setGrid(Array(5).fill(null).map(() => Array(5).fill(0)));
    setCompleted(false);
  };

  const nextPuzzle = () => {
    setCurrentPuzzleIndex((currentPuzzleIndex + 1) % puzzles.length);
    resetPuzzle();
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🎨 Nonogram</h1>
        <p className="subtitle">{currentPuzzle.name}</p>
      </div>

      {completed && (
        <div className="alert success">
          🎉 Tebrikler! Resmi tamamladınız!
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div>
            {/* Column hints */}
            <div style={{ display: 'flex', marginBottom: '5px', paddingLeft: '50px' }}>
              {currentPuzzle.colHints.map((hints, i) => (
                <div key={i} style={{ width: '40px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {hints.join(' ')}
                </div>
              ))}
            </div>
            
            {/* Grid with row hints */}
            {grid.map((row, r) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '50px', textAlign: 'right', paddingRight: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                  {currentPuzzle.rowHints[r].join(' ')}
                </div>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    onClick={() => toggleCell(r, c)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #333',
                      cursor: 'pointer',
                      background: cell === 1 ? '#333' : cell === 2 ? '#f44336' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {cell === 2 && '×'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={resetPuzzle} className="button orange" style={{ flex: 1 }}>🔄 Sıfırla</button>
          <button onClick={nextPuzzle} className="button green" style={{ flex: 1 }}>⏭ Sonraki</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '10px' }}>🎮 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>Sayılar satır/sütundaki dolu hücre gruplarını gösterir</li>
          <li>1. tık: Doldur (siyah)</li>
          <li>2. tık: İşaretle (kırmızı X - boş olacak)</li>
          <li>3. tık: Temizle (beyaz)</li>
          <li>Tüm hücreleri doğru doldurun!</li>
        </ul>
      </div>
    </div>
  );
}
