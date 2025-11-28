import { useNavigate } from 'react-router-dom'

export default function SurvivalGame() {
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>⛺</h1>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Survival Game</h2>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '25px' }}>
          Hayatta kalma macerasına hazır mısın?
        </p>
        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '25px'
        }}>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px' }}>
            <strong>Özellikler:</strong><br/>
            • Backend: Python FastAPI<br/>
            • Frontend: React + Tailwind<br/>
            • LLM Entegrasyonu<br/>
            • Türkçe Oyun Sistemi
          </p>
          <div style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #ffc107'
          }}>
            <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
              🚧 <strong>Geliştirme Aşamasında</strong><br/>
              Backend ve frontend kurulumu gerekiyor
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            background: '#f5576c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          ← Ana Sayfaya Dön
        </button>
      </div>
    </div>
  )
}
