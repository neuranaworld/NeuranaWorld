import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function FarmDominion() {
  const navigate = useNavigate()

  useEffect(() => {
    // Oyunu yeni sekmede aç
    window.open('/NeuranaWorld/FarmDominion/index.html', '_blank')
    // Ana sayfaya geri dön
    navigate('/')
  }, [navigate])

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>🚜</h1>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Farm Dominion</h2>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '25px' }}>
          Oyun yeni sekmede açılıyor...
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          • 3D Çiftlik Simülasyonu<br/>
          • 6.8 Milyon m² Arazi<br/>
          • 122,000+ Satır Kod<br/>
          • Ultra Gerçekçi Grafik
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '30px',
            padding: '12px 30px',
            fontSize: '16px',
            background: '#667eea',
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
