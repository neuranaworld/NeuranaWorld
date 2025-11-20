import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StepCounter() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [isTracking, setIsTracking] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastAcceleration, setLastAcceleration] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('step_data');
    if (saved) {
      const data = JSON.parse(saved);
      setSteps(data.steps || 0);
      setHistory(data.history || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('step_data', JSON.stringify({ steps, history }));
  }, [steps, history]);

  const requestMotionPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          return true;
        } else {
          setHasPermission(false);
          alert('Hareket sensör izni reddedildi!');
          return false;
        }
      } catch (error) {
        console.error('İzin hatası:', error);
        return false;
      }
    } else {
      setHasPermission(true);
      return true;
    }
  };

  const startTracking = async () => {
    const granted = await requestMotionPermission();
    if (!granted) return;

    if (window.DeviceMotionEvent) {
      let stepDetected = false;
      let lastTime = Date.now();

      const handleMotion = (event) => {
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        const total = Math.sqrt(x * x + y * y + z * z);
        const threshold = 12;
        const currentTime = Date.now();

        if (total > threshold && !stepDetected && (currentTime - lastTime > 300)) {
          setSteps(prev => prev + 1);
          stepDetected = true;
          lastTime = currentTime;
          setTimeout(() => { stepDetected = false; }, 300);
        }

        setLastAcceleration(total.toFixed(2));
      };

      window.addEventListener('devicemotion', handleMotion);
      setIsTracking(true);

      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    } else {
      alert('Cihazınız hareket sensörünü desteklemiyor!');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    window.removeEventListener('devicemotion', () => {});
  };

  const resetDaily = () => {
    const today = new Date().toLocaleDateString('tr-TR');
    const newEntry = { date: today, steps, goal };
    setHistory([newEntry, ...history.slice(0, 29)]);
    setSteps(0);
  };

  const percentage = Math.min((steps / goal) * 100, 100);
  const calories = Math.round(steps * 0.04);
  const distance = (steps * 0.0008).toFixed(2);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">👟 Adım Sayacı</h1>
        <p className="subtitle">Günlük adım hedefi ve takip</p>
      </div>

      {hasPermission === false && (
        <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
          <h3 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Hareket Sensörü İzni Gerekli</h3>
          <p style={{ color: '#856404' }}>Adım sayımı için cihazınızın hareket sensörüne erişim gereklidir.</p>
          <button onClick={requestMotionPermission} style={{ marginTop: '15px', padding: '12px 24px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📱 İzin Ver</button>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)', color: 'white', marginBottom: '30px', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '96px', fontWeight: 'bold', marginBottom: '10px' }}>{steps.toLocaleString()}</div>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>/ {goal.toLocaleString()} adım</div>
        
        <div style={{ background: 'rgba(255,255,255,0.3)', height: '30px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ height: '100%', width: `${percentage}%`, background: 'white', transition: 'width 0.3s' }} />
        </div>
        
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{percentage.toFixed(1)}% Tamamlandı</div>
      </div>

      <div className="grid" style={{ marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔥</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF5722' }}>{calories}</div>
          <div style={{ color: '#666' }}>Kalori</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📏</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>{distance} km</div>
          <div style={{ color: '#666' }}>Mesafe</div>
        </div>
        {isTracking && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📡</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9C27B0' }}>{lastAcceleration}</div>
            <div style={{ color: '#666' }}>İvme</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>⚙️ Ayarlar</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Günlük Hedef</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value))}
            min="1000"
            max="50000"
            step="1000"
            style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isTracking ? (
            <button onClick={startTracking} disabled={hasPermission === false} style={{ flex: 1, minWidth: '150px', padding: '15px', background: hasPermission === false ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: hasPermission === false ? 'not-allowed' : 'pointer' }}>▶️ Başlat</button>
          ) : (
            <button onClick={stopTracking} style={{ flex: 1, minWidth: '150px', padding: '15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>⏸️ Durdur</button>
          )}
          <button onClick={() => setSteps(prev => prev + 100)} style={{ flex: 1, minWidth: '150px', padding: '15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+100 Test</button>
          <button onClick={resetDaily} style={{ flex: 1, minWidth: '150px', padding: '15px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🔄 Günlük Sıfırla</button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>📊 Geçmiş ({history.length} gün)</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {history.map((entry, idx) => {
              const percent = Math.min((entry.steps / entry.goal) * 100, 100);
              return (
                <div key={idx} style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '10px', background: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{entry.date}</span>
                    <span style={{ color: percent >= 100 ? '#4CAF50' : '#666' }}>{entry.steps.toLocaleString()} / {entry.goal.toLocaleString()}</span>
                  </div>
                  <div style={{ background: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percent}%`, background: percent >= 100 ? '#4CAF50' : '#2196F3' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Bilgi</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li><strong>Mobil Cihaz:</strong> En iyi sonuç için telefon veya tablet kullanın</li>
          <li><strong>Hassasiyet:</strong> Hareket sensörü ile adım algılama</li>
          <li><strong>Kalori:</strong> Ortalama 0.04 kalori/adım</li>
          <li><strong>Mesafe:</strong> Ortalama 0.8 metre/adım</li>
          <li><strong>Hedef:</strong> WHO önerisi günlük 10,000 adım</li>
          <li>Arka planda çalıştırmak için tarayıcıyı açık tutun</li>
        </ul>
      </div>
    </div>
  );
}
