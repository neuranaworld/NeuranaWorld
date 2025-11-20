import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ total_points: 0, games_played: 0, correct_answers: 0 });
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      let storedUserId = localStorage.getItem('user_id');
      if (!storedUserId) {
        const response = await axios.post(`${API}/auth/anonymous`);
        storedUserId = response.data.user_id;
        localStorage.setItem('user_id', storedUserId);
        setUserName(response.data.name);
      }
      setUserId(storedUserId);
      
      try {
        const statsResponse = await axios.get(`${API}/user/${storedUserId}/stats`);
        setStats(statsResponse.data);
      } catch (e) {
        console.log('Stats not available yet');
      }
    } catch (error) {
      console.error('User init error:', error);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <h1 className="title">🧠 NeuranaWorld</h1>
        <p className="subtitle">Çoklu-LLM destekli eğitim platformu</p>
        {userName && <p className="subtitle">Hoş geldin, {userName}!</p>}
      </div>

      {/* Ana Modüller */}
      <div className="grid">
        <div className="card" onClick={() => navigate('/multi-ai')} data-testid="multi-ai-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div className="card-icon" style={{ fontSize: '48px' }}>🤖</div>
          <h2 className="card-title" style={{ color: 'white' }}>Derinlemesine Düşünme</h2>
          <p className="card-description" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Çoklu AI karşılaştırma | ChatGPT, Gemini, Claude
          </p>
        </div>

        <div className="card" onClick={() => navigate('/neuraverse')} data-testid="neuraverse-card" style={{ background: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)', color: 'white', border: '3px solid #FFD700' }}>
          <div className="card-icon" style={{ fontSize: '48px' }}>🌌</div>
          <h2 className="card-title" style={{ color: 'white' }}>NeuranaGame</h2>
          <p className="card-description" style={{ color: 'rgba(255,255,255,0.9)' }}>
            3D Tycoon + Event Oyunu | Endüstri, Takas, Ticaret
          </p>
          <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>YENİ ⭐</span>
        </div>

        <div className="card" onClick={() => navigate('/math')} data-testid="math-section-card">
          <div className="card-icon">🔢</div>
          <h2 className="card-title">NeuranaLabs</h2>
          <p className="card-description">Hızlı pratik, oyunlar ve daha fazlası</p>
        </div>

        <div className="card" onClick={() => navigate('/turkish')} data-testid="turkish-section-card">
          <div className="card-icon">📚</div>
          <h2 className="card-title">NeuranaEdu</h2>
          <p className="card-description">Dilbilgisi testleri, yazım kuralları ve eğlenceli oyunlar</p>
        </div>

        <div className="card" onClick={() => navigate('/translate')} data-testid="translate-section-card">
          <div className="card-icon">🌍</div>
          <h2 className="card-title">Çeviri</h2>
          <p className="card-description">Çoklu-dil çeviri sistemi (Ensemble mode)</p>
        </div>

        <div className="card" onClick={() => navigate('/games')} data-testid="games-section-card">
          <div className="card-icon">🎮</div>
          <h2 className="card-title">Oyunlar</h2>
          <p className="card-description">10+ eğlenceli oyun: Kelime, bulmaca ve kart oyunları</p>
        </div>
      </div>

      {/* Araçlar & Özellikler - Accordion Stil */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea', marginBottom: '30px', textAlign: 'center' }}>🛠️ Üretkenlik Araçları</h2>
        
        {/* Öğrenme Araçları */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #667eea', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('learning')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'learning' ? '#667eea' : 'white', 
              color: expandedCategory === 'learning' ? 'white' : '#667eea',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>📖 Öğrenme Araçları</span>
            <span>{expandedCategory === 'learning' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'learning' && (
            <div className="grid" style={{ padding: '20px', background: '#f8f9ff' }}>
              <div className="card" onClick={() => navigate('/tools/mind-map')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🗺️</div>
                <h3 className="card-title">Zihin Haritası</h3>
                <p className="card-description">3D yakınlaştırmalı interaktif harita</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/spaced-repetition')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🔄</div>
                <h3 className="card-title">Spaced Repetition</h3>
                <p className="card-description">SRS algoritması ile akıllı tekrar</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/exam-mode')} style={{ minHeight: '120px' }}>
                <div className="card-icon">📝</div>
                <h3 className="card-title">Sınav Modu</h3>
                <p className="card-description">Offline, kısıtlamalarla gerçek sınav deneyimi</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/handwriting-ocr')} style={{ minHeight: '120px' }}>
                <div className="card-icon">✍️</div>
                <h3 className="card-title">El Yazısı → LaTeX</h3>
                <p className="card-description">OCR ile matematiksel formül tanıma</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/fatigue-detector')} style={{ minHeight: '120px' }}>
                <div className="card-icon">😴</div>
                <h3 className="card-title">Yorgunluk Algılama</h3>
                <p className="card-description">Hata artışı analizi ile uyarı</p>
              </div>
            </div>
          )}
        </div>

        {/* Matematik & Grafik Araçları */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #4CAF50', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('math')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'math' ? '#4CAF50' : 'white', 
              color: expandedCategory === 'math' ? 'white' : '#4CAF50',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>📐 Matematik & Grafik</span>
            <span>{expandedCategory === 'math' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'math' && (
            <div className="grid" style={{ padding: '20px', background: '#f1f8f4' }}>
              <div className="card" onClick={() => navigate('/tools/unit-converter')} style={{ minHeight: '120px' }}>
                <div className="card-icon">⚖️</div>
                <h3 className="card-title">Birim Dönüştürücü</h3>
                <p className="card-description">Tüm birimleri anında dönüştür</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/2d-graph')} style={{ minHeight: '120px' }}>
                <div className="card-icon">📈</div>
                <h3 className="card-title">2D Grafik Çizimi</h3>
                <p className="card-description">Fonksiyon ve veri görselleştirme</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/parametric-graph')} style={{ minHeight: '120px' }}>
                <div className="card-icon">📊</div>
                <h3 className="card-title">Parametrik Grafik</h3>
                <p className="card-description">Zoom/pan ile gelişmiş grafik motoru</p>
              </div>
            </div>
          )}
        </div>

        {/* Zaman Yönetimi */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #FF9800', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('time')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'time' ? '#FF9800' : 'white', 
              color: expandedCategory === 'time' ? 'white' : '#FF9800',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>⏰ Zaman Yönetimi</span>
            <span>{expandedCategory === 'time' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'time' && (
            <div className="grid" style={{ padding: '20px', background: '#fff8f0' }}>
              <div className="card" onClick={() => navigate('/tools/pomodoro')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🍅</div>
                <h3 className="card-title">Pomodoro</h3>
                <p className="card-description">Çalışma ve mola zamanı yönetimi</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/alarm')} style={{ minHeight: '120px' }}>
                <div className="card-icon">⏰</div>
                <h3 className="card-title">Alarm Sistemi</h3>
                <p className="card-description">Arka planda çalışan akıllı alarm</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/stopwatch')} style={{ minHeight: '120px' }}>
                <div className="card-icon">⏱️</div>
                <h3 className="card-title">Kronometre & Tur</h3>
                <p className="card-description">Tur sayacı ile profesyonel kronometre</p>
              </div>
            </div>
          )}
        </div>

        {/* Sağlık & Wellness */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #2196F3', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('health')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'health' ? '#2196F3' : 'white', 
              color: expandedCategory === 'health' ? 'white' : '#2196F3',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>💧 Sağlık & Wellness</span>
            <span>{expandedCategory === 'health' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'health' && (
            <div className="grid" style={{ padding: '20px', background: '#f0f8ff' }}>
              <div className="card" onClick={() => navigate('/tools/water-reminder')} style={{ minHeight: '120px' }}>
                <div className="card-icon">💧</div>
                <h3 className="card-title">Su Hatırlatıcısı</h3>
                <p className="card-description">Düzenli su içme takibi</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/step-counter')} style={{ minHeight: '120px' }}>
                <div className="card-icon">👟</div>
                <h3 className="card-title">Adım Sayacı</h3>
                <p className="card-description">Günlük adım hedefi ve takip</p>
              </div>
            </div>
          )}
        </div>

        {/* Medya & Ses */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #9C27B0', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('media')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'media' ? '#9C27B0' : 'white', 
              color: expandedCategory === 'media' ? 'white' : '#9C27B0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>🎵 Medya & Odak Sesleri</span>
            <span>{expandedCategory === 'media' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'media' && (
            <div className="grid" style={{ padding: '20px', background: '#f8f0ff' }}>
              <div className="card" onClick={() => navigate('/tools/voice-recorder')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🎙️</div>
                <h3 className="card-title">Ses Kaydı</h3>
                <p className="card-description">Yüksek kaliteli ses kayıt sistemi</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/noise-cancellation')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🎧</div>
                <h3 className="card-title">Gürültü Engelleme</h3>
                <p className="card-description">Profesyonel düzey aktif gürültü engelleme</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/focus-sounds')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🌧️</div>
                <h3 className="card-title">Odak Sesleri</h3>
                <p className="card-description">Yağmur, dalga, beyaz gürültü</p>
              </div>
            </div>
          )}
        </div>

        {/* Widget'lar */}
        <div className="accordion-item" style={{ marginBottom: '20px', border: '2px solid #607D8B', borderRadius: '12px', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleCategory('widgets')} 
            style={{ 
              padding: '20px', 
              background: expandedCategory === 'widgets' ? '#607D8B' : 'white', 
              color: expandedCategory === 'widgets' ? 'white' : '#607D8B',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          >
            <span>📱 Widget'lar</span>
            <span>{expandedCategory === 'widgets' ? '▼' : '▶'}</span>
          </div>
          {expandedCategory === 'widgets' && (
            <div className="grid" style={{ padding: '20px', background: '#f5f5f5' }}>
              <div className="card" onClick={() => navigate('/tools/weather')} style={{ minHeight: '120px' }}>
                <div className="card-icon">🌤️</div>
                <h3 className="card-title">Hava Durumu</h3>
                <p className="card-description">Anlık hava durumu widget'ı</p>
              </div>
              <div className="card" onClick={() => navigate('/tools/daily-quote')} style={{ minHeight: '120px' }}>
                <div className="card-icon">💭</div>
                <h3 className="card-title">Günlük Alıntı</h3>
                <p className="card-description">Motivasyonel günlük alıntılar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {userId && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#667eea' }}>📊 İstatistiklerim</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.total_points}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Toplam Puan</div>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.games_played}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Oynanan Oyun</div>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFA726' }}>{stats.correct_answers}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Doğru Cevap</div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#1976D2' }}>💡 Platform Özellikleri</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Zaman sınırsız derin düşünme modu</li>
          <li>GPT-4o + Claude doğrulama sistemi</li>
          <li>K-self-consistency algoritması</li>
          <li>20+ üretkenlik aracı</li>
          <li>Eğlenceli matematik ve Türkçe oyunları</li>
          <li>%0 hata hedefi</li>
        </ul>
      </div>
    </div>
  );
}
