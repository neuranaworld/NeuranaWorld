import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Graph2D() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [equation, setEquation] = useState('x^2');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);

  const evaluateExpression = (expr, x) => {
    try {
      const sanitized = expr
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/log/g, 'Math.log')
        .replace(/abs/g, 'Math.abs')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![a-z])/g, 'Math.E');
      return eval(sanitized);
    } catch (e) {
      return NaN;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Function
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);

    let firstPoint = true;
    for (let px = 0; px < width; px++) {
      const x = xMin + (px / width) * (xMax - xMin);
      const y = evaluateExpression(equation, x);

      if (!isNaN(y) && isFinite(y)) {
        const py = height - ((y - yMin) * scaleY);
        if (py >= 0 && py <= height) {
          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          firstPoint = true;
        }
      } else {
        firstPoint = true;
      }
    }
    ctx.stroke();
  };

  useEffect(() => {
    drawGraph();
  }, [equation, xMin, xMax, yMin, yMax]);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">📈 2D Grafik Çizimi</h1>
        <p className="subtitle">Fonksiyon ve veri görselleştirme</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Fonksiyon (y = f(x))</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Örnek: x^2, sin(x), x^3 - 2*x"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            Kullanılabilir: x, +, -, *, /, ^, sin, cos, tan, sqrt, log, abs, pi, e
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '14px' }}>X Min</label>
            <input type="number" value={xMin} onChange={(e) => setXMin(parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ fontSize: '14px' }}>X Max</label>
            <input type="number" value={xMax} onChange={(e) => setXMax(parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ fontSize: '14px' }}>Y Min</label>
            <input type="number" value={yMin} onChange={(e) => setYMin(parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ fontSize: '14px' }}>Y Max</label>
            <input type="number" value={yMax} onChange={(e) => setYMax(parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            width: '100%',
            maxWidth: '800px',
            border: '2px solid #667eea',
            borderRadius: '8px'
          }}
        />

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={drawGraph} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 Yenile</button>
          <button onClick={() => { setEquation('x^2'); setXMin(-10); setXMax(10); setYMin(-10); setYMax(10); }} style={{ padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>↺ Sıfırla</button>
        </div>
      </div>
    </div>
  );
}
