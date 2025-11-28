import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WaterReminder() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(8);
  const [consumed, setConsumed] = useState(0);
  const [history, setHistory] = useState([]);
  const [reminderInterval, setReminderInterval] = useState(60);
  const [lastReminder, setLastReminder] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastReminder >= reminderInterval * 60 * 1000) {
        if (consumed < goal) {
          alert('💧 Su içme zamanı! Hidrate kalın!');
          setLastReminder(now);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [consumed, goal, reminderInterval, lastReminder]);

  const addWater = (amount) => {
    const newConsumed = Math.min(consumed + amount, goal);
    setConsumed(newConsumed);
    setHistory([...history, { time: new Date(), amount }]);
    setLastReminder(Date.now());
  };

  const percentage = (consumed / goal) * 100;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">💧 Su Hatırlatıcısı</h1>
        <p className="subtitle">Düzenli su içme takibi</p>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#2196F3' }}>
            {consumed} / {goal}
          </div>
          <div style={{ fontSize: '24px', color: '#666' }}>Bardak</div>
          
          <div style={{ marginTop: '30px', background: '#e0e0e0', height: '40px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
              height: '100%',
              width: `${percentage}%`,
              transition: 'width 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              {Math.round(percentage)}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Hızlı Ekle</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map(amount => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                style={{
                  padding: '20px 30px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  flex: 1,
                  minWidth: '100px'
                }}
              >
                +{amount} 🥤
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Günlük Hedef (bardak)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value))}
              min="1"
              max="20"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #2196F3',
                borderRadius: '8px',
                fontSize: '18px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hatırlatma Aralığı (dk)</label>
            <input
              type="number"
              value={reminderInterval}
              onChange={(e) => setReminderInterval(parseInt(e.target.value))}
              min="15"
              max="180"
              step="15"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #2196F3',
                borderRadius: '8px',
                fontSize: '18px'
              }}
            />
          </div>
        </div>

        <button
          onClick={() => { setConsumed(0); setHistory([]); }}
          style={{
            width: '100%',
            padding: '15px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          ↺ Sıfırla
        </button>

        {history.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Bugünkü Geçmiş</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {history.map((entry, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#f8f9ff'
                }}>
                  <span>{entry.time.toLocaleTimeString('tr-TR')}</span>
                  <span style={{ fontWeight: 'bold', color: '#2196F3' }}>+{entry.amount} bardak</span>
                </div>
              )).reverse()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
