import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Weather() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Istanbul');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockWeatherData = {
    Istanbul: { temp: 18, condition: '⛅ Parçalı Bulutlu', humidity: 65, wind: 12 },
    Ankara: { temp: 15, condition: '☀️ Güneşli', humidity: 45, wind: 8 },
    Izmir: { temp: 22, condition: '☀️ Güneşli', humidity: 70, wind: 15 },
  };

  const fetchWeather = () => {
    setLoading(true);
    setTimeout(() => {
      setWeather(mockWeatherData[city] || mockWeatherData.Istanbul);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🌤️ Hava Durumu</h1>
        <p className="subtitle">Anlık hava durumu bilgisi</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Şehir Seçin</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #2196F3',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              <option value="Istanbul">Istanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="Izmir">Izmir</option>
            </select>
            <button
              onClick={fetchWeather}
              style={{
                padding: '12px 24px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Göster
            </button>
          </div>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</p>}

        {weather && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>{weather.condition.split(' ')[0]}</div>
            <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '10px' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '24px', marginBottom: '30px' }}>{weather.condition.split(' ').slice(1).join(' ')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
              <div>
                <div style={{ fontSize: '32px' }}>💧</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>%{weather.humidity}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Nem</div>
              </div>
              <div>
                <div style={{ fontSize: '32px' }}>💨</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{weather.wind} km/h</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Rüzgar</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
