import { useNavigate } from 'react-router-dom'

export default function GalaxyGame() {
  const navigate = useNavigate()

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        maxWidth: '700px'
      }}>
        <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>🌌</h1>
        <h2 style={{
          color: '#333',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          NeuranaWorld Galaxy
        </h2>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '25px' }}>
          3D Multiplayer Evrenine Hoş Geldiniz! ✨
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '25px',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>
            🎮 Süper Özellikler
          </h3>
          <ul style={{
            color: '#555',
            fontSize: '14px',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0
          }}>
            <li>🎨 <strong>BabylonJS 3D Engine</strong> - Profesyonel grafik</li>
            <li>🌐 <strong>Multiplayer</strong> - Colyseus.js ile gerçek zamanlı</li>
            <li>🎲 <strong>Okey Oyunu</strong> - Gelişmiş AI sistemi</li>
            <li>🏗️ <strong>NeuraVerse Minecraft</strong> - 3D voxel dünyası</li>
            <li>📚 <strong>Türkçe & Matematik</strong> - Eğitsel oyunlar</li>
            <li>🛠️ <strong>3D Mind Map</strong> - Zihin haritası aracı</li>
            <li>⚛️ <strong>React 19</strong> + Radix UI - Modern arayüz</li>
            <li>🎯 <strong>121 Component</strong> - Zengin içerik</li>
          </ul>
          <div style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #ffc107',
            marginTop: '20px'
          }}>
            <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
              🚧 <strong>Geliştirme Aşamasında</strong><br/>
              React app kurulumu ve backend konfigürasyonu gerekiyor
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          ← Ana Sayfaya Dön
        </button>
      </div>
    </div>
  )
}
