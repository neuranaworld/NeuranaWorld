import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlaceholderTool({ title, emoji, description }) {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">{emoji} {title}</h1>
        <p className="subtitle">{description}</p>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: '96px', marginBottom: '30px' }}>🚧</div>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#667eea' }}>Çok Yakında!</h2>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8' }}>
          Bu özellik şu anda geliştirilme aşamasında. Yakında kullanıma açılacak!
        </p>
      </div>

      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
        <h3 style={{ marginBottom: '15px', color: '#1976D2' }}>💡 Planlanan Özellikler</h3>
        <p style={{ lineHeight: '1.8', color: '#333' }}>
          Bu araç yakında aşağıdaki özelliklerle birlikte gelecek:
        </p>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px', marginTop: '15px' }}>
          <li>Kullanıcı dostu arayüz</li>
          <li>Gelişmiş özelleştirme seçenekleri</li>
          <li>Veri senkronizasyonu</li>
          <li>Performans optimizasyonları</li>
        </ul>
      </div>
    </div>
  );
}
