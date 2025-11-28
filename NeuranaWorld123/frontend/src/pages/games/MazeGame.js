import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MazeGame() {
  const navigate = useNavigate();
  const [size, setSize] = useState(15);
  const [maze, setMaze] = useState([]);
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [end, setEnd] = useState({ x: 0, y: 0 });
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    generateMaze();
  }, [size]);

  const generateMaze = () => {
    // Basit maze oluşturma algoritması (DFS)
    const newMaze = Array(size).fill(null).map(() => Array(size).fill(1)); // 1 = duvar
    
    const stack = [];
    const start = { x: 1, y: 1 };
    newMaze[start.y][start.x] = 0; // 0 = yol
    stack.push(start);
    
    const directions = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
    ];
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = [];
      
      directions.forEach(dir => {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && newMaze[ny][nx] === 1) {
          neighbors.push({ x: nx, y: ny, dx: dir.dx, dy: dir.dy });
        }
      });
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        newMaze[next.y][next.x] = 0;
        newMaze[current.y + next.dy / 2][current.x + next.dx / 2] = 0;
        stack.push({ x: next.x, y: next.y });
      } else {
        stack.pop();
      }
    }
    
    const endPos = { x: size - 2, y: size - 2 };
    newMaze[endPos.y][endPos.x] = 0;
    
    setMaze(newMaze);
    setPlayer({ x: 1, y: 1 });
    setEnd(endPos);
    setWon(false);
    setMoves(0);
  };

  const movePlayer = (dx, dy) => {
    if (won) return;
    
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (newX >= 0 && newX < size && newY >= 0 && newY < size && maze[newY][newX] === 0) {
      setPlayer({ x: newX, y: newY });
      setMoves(moves + 1);
      
      if (newX === end.x && newY === end.y) {
        setWon(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, won]);

  return (
    <div className="page-container">
      <div className="header-gradient green">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🌀 Labirent</h1>
        <p className="subtitle">Hamle: {moves}</p>
      </div>

      {won && (
        <div className="alert success">
          🎉 Tebrikler! {moves} hamlede çıkışı buldunuz!
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Boyut:</label>
          <button onClick={() => setSize(11)} className={`button ${size === 11 ? 'green' : ''}`} style={{ flex: 1 }}>Küçük</button>
          <button onClick={() => setSize(15)} className={`button ${size === 15 ? 'orange' : ''}`} style={{ flex: 1 }}>Orta</button>
          <button onClick={() => setSize(21)} className="button" style={{ flex: 1 }}>Büyük</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', overflow: 'auto' }}>
          <div style={{ display: 'inline-block' }}>
            {maze.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((cell, x) => {
                  const isPlayer = player.x === x && player.y === y;
                  const isEnd = end.x === x && end.y === y;
                  
                  return (
                    <div
                      key={x}
                      style={{
                        width: '20px',
                        height: '20px',
                        background: cell === 1 ? '#333' : isPlayer ? '#4CAF50' : isEnd ? '#F44336' : '#fff',
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                      }}
                    >
                      {isPlayer && '👤'}
                      {isEnd && '🎯'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generateMaze} className="button" style={{ flex: 1 }}>🔄 Yeni Labirent</button>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div></div>
          <button onClick={() => movePlayer(0, -1)} className="button" style={{ padding: '15px' }}>↑</button>
          <div></div>
          <button onClick={() => movePlayer(-1, 0)} className="button" style={{ padding: '15px' }}>←</button>
          <div></div>
          <button onClick={() => movePlayer(1, 0)} className="button" style={{ padding: '15px' }}>→</button>
          <div></div>
          <button onClick={() => movePlayer(0, 1)} className="button" style={{ padding: '15px' }}>↓</button>
          <div></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '10px' }}>🎮 Kontroller</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>Ok tuşları veya butonlarla hareket edin</li>
          <li>👤 = Sen</li>
          <li>🎯 = Çıkış</li>
          <li>Siyah = Duvar, Beyaz = Yol</li>
        </ul>
      </div>
    </div>
  );
}
