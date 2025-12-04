import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState('basic'); // basic, scientific
  const [memory, setMemory] = useState(0);
  const [lastOperation, setLastOperation] = useState(null);

  const handleNumber = (num) => {
    setDisplay(display === '0' ? num : display + num);
  };

  const handleOperator = (op) => {
    setDisplay(display + ' ' + op + ' ');
  };

  const calculate = () => {
    try {
      // Simple evaluation
      const result = eval(display.replace('×', '*').replace('÷', '/'));
      setDisplay(result.toString());
      setLastOperation(display + ' = ' + result);
    } catch (error) {
      setDisplay('Hata');
    }
  };

  const clear = () => {
    setDisplay('0');
  };

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const handleScientific = (func) => {
    try {
      const value = parseFloat(display);
      let result;
      
      switch (func) {
        case 'sin':
          result = Math.sin(value * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(value * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(value * Math.PI / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = value;
      }
      
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Hata');
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🔬 Bilimsel Hesap Makinesi</h1>
        <p className="subtitle">Temel ve ileri matematik işlemleri</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setMode('basic')}
              className={`button ${mode === 'basic' ? 'green' : ''}`}
              style={{ flex: 1, opacity: mode === 'basic' ? 1 : 0.6 }}
            >
              Temel
            </button>
            <button
              onClick={() => setMode('scientific')}
              className="button orange"
              style={{ flex: 1, opacity: mode === 'scientific' ? 1 : 0.6 }}
            >
              Bilimsel
            </button>
          </div>
        </div>

        {/* Display */}
        <div
          style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'right',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            minHeight: '60px',
            wordBreak: 'break-all',
          }}
          data-testid="calculator-display"
        >
          {display}
        </div>

        {lastOperation && (
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px', textAlign: 'right' }}>
            {lastOperation}
          </div>
        )}

        {mode === 'scientific' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => handleScientific('sin')} className="button" style={{ padding: '10px' }}>sin</button>
            <button onClick={() => handleScientific('cos')} className="button" style={{ padding: '10px' }}>cos</button>
            <button onClick={() => handleScientific('tan')} className="button" style={{ padding: '10px' }}>tan</button>
            <button onClick={() => handleScientific('sqrt')} className="button" style={{ padding: '10px' }}>√</button>
            <button onClick={() => handleScientific('square')} className="button" style={{ padding: '10px' }}>x²</button>
            <button onClick={() => handleScientific('log')} className="button" style={{ padding: '10px' }}>log</button>
            <button onClick={() => handleScientific('ln')} className="button" style={{ padding: '10px' }}>ln</button>
            <button onClick={() => handleScientific('pi')} className="button" style={{ padding: '10px' }}>π</button>
          </div>
        )}

        {/* Basic Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <button onClick={() => handleNumber('7')} className="button" style={{ padding: '20px', fontSize: '20px' }}>7</button>
          <button onClick={() => handleNumber('8')} className="button" style={{ padding: '20px', fontSize: '20px' }}>8</button>
          <button onClick={() => handleNumber('9')} className="button" style={{ padding: '20px', fontSize: '20px' }}>9</button>
          <button onClick={() => handleOperator('÷')} className="button orange" style={{ padding: '20px', fontSize: '20px' }}>÷</button>
          
          <button onClick={() => handleNumber('4')} className="button" style={{ padding: '20px', fontSize: '20px' }}>4</button>
          <button onClick={() => handleNumber('5')} className="button" style={{ padding: '20px', fontSize: '20px' }}>5</button>
          <button onClick={() => handleNumber('6')} className="button" style={{ padding: '20px', fontSize: '20px' }}>6</button>
          <button onClick={() => handleOperator('×')} className="button orange" style={{ padding: '20px', fontSize: '20px' }}>×</button>
          
          <button onClick={() => handleNumber('1')} className="button" style={{ padding: '20px', fontSize: '20px' }}>1</button>
          <button onClick={() => handleNumber('2')} className="button" style={{ padding: '20px', fontSize: '20px' }}>2</button>
          <button onClick={() => handleNumber('3')} className="button" style={{ padding: '20px', fontSize: '20px' }}>3</button>
          <button onClick={() => handleOperator('-')} className="button orange" style={{ padding: '20px', fontSize: '20px' }}>-</button>
          
          <button onClick={() => handleNumber('0')} className="button" style={{ padding: '20px', fontSize: '20px' }}>0</button>
          <button onClick={() => handleNumber('.')} className="button" style={{ padding: '20px', fontSize: '20px' }}>.</button>
          <button onClick={calculate} className="button green" style={{ padding: '20px', fontSize: '20px' }}>=</button>
          <button onClick={() => handleOperator('+')} className="button orange" style={{ padding: '20px', fontSize: '20px' }}>+</button>
          
          <button onClick={clear} className="button" style={{ padding: '20px', fontSize: '16px', gridColumn: 'span 2' }}>C</button>
          <button onClick={backspace} className="button" style={{ padding: '20px', fontSize: '16px', gridColumn: 'span 2' }}>←</button>
        </div>
      </div>
    </div>
  );
}
