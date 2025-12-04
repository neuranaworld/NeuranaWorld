import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Stopwatch() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleLap = () => {
    if (running) {
      setLaps([...laps, { time, lapTime: time - (laps[laps.length - 1]?.time || 0) }]);
    }
  };

  const handleReset = () => {
    setTime(0);
    setRunning(false);
    setLaps([]);
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">⏱️ Kronometre</h1>
        <p className="subtitle">Tur sayacı ile profesyonel kronometre</p>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#667eea', fontFamily: 'monospace' }}>
            {formatTime(time)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
          <button
            onClick={handleStartStop}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: running ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            {running ? '⏸️ Durdur' : '▶️ Başlat'}
          </button>
          <button
            onClick={handleLap}
            disabled={!running}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: running ? '#667eea' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: running ? 'pointer' : 'not-allowed',
              minWidth: '150px'
            }}
          >
            🏁 Tur
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            ↺ Sıfırla
          </button>
        </div>

        {laps.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Turlar ({laps.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {laps.map((lap, index) => (
                <div key={index} style={{
                  padding: '15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#f8f9ff'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Tur {laps.length - index}</span>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginRight: '20px' }}>
                      {formatTime(lap.time)}
                    </span>
                    <span style={{ fontSize: '16px', color: '#666' }}>
                      (+{formatTime(lap.lapTime)})
                    </span>
                  </div>
                </div>
              )).reverse()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
