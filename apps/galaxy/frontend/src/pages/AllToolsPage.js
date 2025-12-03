import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllToolsPage() {
  const navigate = useNavigate();

  const tools = [
    // Zaman Yönetimi
    { path: '/tools/pomodoro', icon: '⏱️', title: 'Pomodoro', desc: '25 dakika odaklanma', color: '#667eea' },
    { path: '/tools/alarm', icon: '⏰', title: 'Alarm', desc: 'Arka plan alarmları', color: '#4CAF50' },
    { path: '/tools/stopwatch', icon: '⏱️', title: 'Kronometre', desc: 'Tur sayacı', color: '#FF9800' },
    
    // Öğrenme
    { path: '/tools/mind-map', icon: '🗺️', title: 'Zihin Haritası', desc: 'Görsel düşünme', color: '#f5576c' },
    { path: '/tools/spaced-repetition', icon: '🔄', title: 'Akıllı Tekrar', desc: 'SRS sistemi', color: '#00f2fe' },
    { path: '/tools/exam-mode', icon: '📝', title: 'Sınav Modu', desc: 'Gerçek sınav deneyimi', color: '#764ba2' },
    { path: '/tools/handwriting-ocr', icon: '✍️', title: 'El Yazısı → LaTeX', desc: 'Formül tanıma', color: '#2196F3' },
    { path: '/tools/fatigue-detector', icon: '😴', title: 'Yorgunluk Algılama', desc: 'Hata analizi', color: '#f44336' },
    
    // Matematik
    { path: '/tools/unit-converter', icon: '🔄', title: 'Birim Dönüştürücü', desc: 'Hızlı çevirme', color: '#fee140' },
    { path: '/tools/2d-graph', icon: '📈', title: '2D Grafik', desc: 'Fonksiyon çizimi', color: '#fed6e3' },
    
    // Ses
    { path: '/tools/focus-sounds', icon: '🌧️', title: 'Odak Sesleri', desc: 'Rahatlatıcı ses', color: '#00d2ff' },
    { path: '/tools/noise-cancellation', icon: '🎧', title: 'Gürültü Engelleme', desc: 'Aktif filtreleme', color: '#667eea' },
    { path: '/tools/voice-recorder', icon: '🎙️', title: 'Ses Kaydedici', desc: 'Kaliteli kayıt', color: '#e91e63' },
    
    // Sağlık
    { path: '/tools/water-reminder', icon: '💧', title: 'Su Hatırlatıcı', desc: 'Günlük takip', color: '#00d2ff' },
    { path: '/tools/step-counter', icon: '👟', title: 'Adım Sayacı', desc: 'Aktivite takibi', color: '#4CAF50' },
    
    // Diğer
    { path: '/tools/weather', icon: '🌤️', title: 'Hava Durumu', desc: 'Anlık bilgi', color: '#3a47d5' },
    { path: '/tools/daily-quote', icon: '💭', title: 'Günlük Alıntı', desc: 'Motivasyon', color: '#764ba2' },
    { path: '/tools/isim-sehir-hayvan', icon: '🎮', title: 'İsim Şehir Hayvan', desc: 'Kelime oyunu', color: '#FF9800' },
  ];

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button" style={{ marginBottom: '20px' }}>
        ← Ana Sayfa
      </button>
      
      <div className="header-gradient" style={{ marginBottom: '30px' }}>
        <h1 className="title">🛠️ Tüm Araçlar</h1>
        <p className="subtitle">{tools.length} araç kullanımınıza hazır</p>
      </div>

      <div className="grid">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="card"
            onClick={() => navigate(tool.path)}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid #e0e0e0',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '15px', textAlign: 'center' }}>
              {tool.icon}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: tool.color }}>
              {tool.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
              {tool.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3 style={{ marginBottom: '10px' }}>💡 İpucu</h3>
        <p style={{ opacity: 0.9 }}>
          Her araç bağımsız çalışır ve verilerinizi tarayıcınızda saklar.
        </p>
      </div>
    </div>
  );
}
