import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PomodoroTimer() {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, break, longBreak
  const [sessions, setSessions] = useState(0);
  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      setSessions(sessions + 1);
      if ((sessions + 1) % 4 === 0) {
        setMode('longBreak');
        setMinutes(15);
      } else {
        setMode('break');
        setMinutes(customBreak);
      }
    } else {
      setMode('work');
      setMinutes(customWork);
    }
    
    setSeconds(0);
    
    // Play notification sound
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro', {
        body: mode === 'work' ? 'Mola zamanı!' : 'Çalışma zamanı!',
        icon: '/favicon.ico'
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(customWork);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return '#667eea';
      case 'break':
        return '#4CAF50';
      case 'longBreak':
        return '#FFA726';
      default:
        return '#667eea';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'work':
        return '📚 Çalışma Zamanı';
      case 'break':
        return '☕ Kısa Mola';
      case 'longBreak':
        return '🌟 Uzun Mola';
      default:
        return '📚 Çalışma';
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient" style={{ background: `linear-gradient(135deg, ${getModeColor()} 0%, ${getModeColor()}dd 100%)` }}>
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">⏱ Pomodoro Zamanlayıcısı</h1>
        <p className="subtitle">Toplam Seans: {sessions}</p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: getModeColor(), marginBottom: '20px' }}>
          {getModeText()}
        </div>

        <div
          style={{
            fontSize: '96px',
            fontWeight: 'bold',
            color: getModeColor(),
            marginBottom: '30px',
            fontFamily: 'monospace',
          }}
          data-testid="timer-display"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
          <button
            onClick={toggleTimer}
            className="button"
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              background: `linear-gradient(135deg, ${getModeColor()} 0%, ${getModeColor()}dd 100%)`,
            }}
            data-testid="toggle-timer"
          >
            {isActive ? '⏸ Durdur' : '▶ Başlat'}
          </button>
          <button
            onClick={resetTimer}
            className="button orange"
            style={{ padding: '20px 40px', fontSize: '20px' }}
            data-testid="reset-timer"
          >
            🔄 Sıfırla
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={requestNotificationPermission}
            className="button"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            🔔 Bildirimleri Etkinleştir
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px', color: '#333' }}>⚙️ Ayarlar</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Çalışma Süresi (dakika):
          </label>
          <input
            type="number"
            value={customWork}
            onChange={(e) => setCustomWork(parseInt(e.target.value) || 25)}
            className="input"
            min="1"
            max="60"
            disabled={isActive}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Mola Süresi (dakika):
          </label>
          <input
            type="number"
            value={customBreak}
            onChange={(e) => setCustomBreak(parseInt(e.target.value) || 5)}
            className="input"
            min="1"
            max="30"
            disabled={isActive}
          />
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>💡 Pomodoro Tekniği</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>25 dakika yoğun çalış</li>
          <li>5 dakika mola ver</li>
          <li>4 seans sonra 15 dakika uzun mola</li>
          <li>Odaklanmanı ve verimliliğini artır!</li>
        </ul>
      </div>
    </div>
  );
}
