import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlarmSystem() {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkAlarms();
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const checkAlarms = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    alarms.forEach(alarm => {
      if (alarm.enabled && alarm.time === timeStr && !alarm.triggered) {
        triggerAlarm(alarm);
      }
    });
  };

  const triggerAlarm = (alarm) => {
    alert(`⏰ ALARM! ${alarm.label || 'Zamanınız geldi!'}`);
    setAlarms(prev => prev.map(a => 
      a.id === alarm.id ? { ...a, triggered: true, enabled: false } : a
    ));
  };

  const addAlarm = () => {
    if (!newAlarmTime) return;
    const newAlarm = {
      id: Date.now(),
      time: newAlarmTime,
      label: newAlarmLabel || 'Alarm',
      enabled: true,
      triggered: false
    };
    setAlarms([...alarms, newAlarm]);
    setNewAlarmTime('');
    setNewAlarmLabel('');
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a
    ));
  };

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">⏰ Alarm Sistemi</h1>
        <p className="subtitle">Arka planda çalışan akıllı alarm</p>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>
            {currentTime.toLocaleTimeString('tr-TR')}
          </div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
            {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Yeni Alarm Ekle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '10px', marginBottom: '30px' }}>
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            value={newAlarmLabel}
            onChange={(e) => setNewAlarmLabel(e.target.value)}
            placeholder="Alarm etiketi (isteğe bağlı)"
            style={{
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={addAlarm}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Ekle
          </button>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Alarmlar ({alarms.length})</h3>
        {alarms.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Henüz alarm yok. Yukarıdan yeni alarm ekleyin.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {alarms.map(alarm => (
              <div key={alarm.id} style={{
                padding: '20px',
                border: `2px solid ${alarm.enabled ? '#667eea' : '#ddd'}`,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: alarm.enabled ? '#f8f9ff' : '#f5f5f5'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: alarm.enabled ? '#667eea' : '#999' }}>
                    {alarm.time}
                  </div>
                  <div style={{ fontSize: '16px', color: '#666', marginTop: '5px' }}>
                    {alarm.label}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    style={{
                      padding: '10px 20px',
                      background: alarm.enabled ? '#4CAF50' : '#999',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {alarm.enabled ? 'Açık' : 'Kapalı'}
                  </button>
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    style={{
                      padding: '10px 20px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
