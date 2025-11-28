import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TurkishPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">📚 Türkçe</h1>
        <p className="subtitle">Dilbilgisi, yazım kuralları ve oyunlar</p>
      </div>

      {/* Öğrenme Bölümü */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E91E63', marginBottom: '20px', paddingLeft: '10px' }}>
          📖 Öğrenme
        </h2>
        <div className="grid">
          <div className="card" onClick={() => navigate('/turkish/grammar-test')} data-testid="grammar-test-card">
            <div className="card-icon">📝</div>
            <h2 className="card-title">Dil Bilgisi Testleri</h2>
            <p className="card-description">
              Noktalama, fiilimsi, tamlamalar ve daha fazlası
            </p>
          </div>

          <div className="card" onClick={() => navigate('/turkish/writing-rules')} data-testid="writing-rules-card">
            <div className="card-icon">✍️</div>
            <h2 className="card-title">Yazım Kuralları</h2>
            <p className="card-description">
              Büyük-küçük harf kullanımı, kısaltmalar
            </p>
          </div>
        </div>
      </div>

      {/* Oyunlar Bölümü */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E91E63', marginBottom: '20px', paddingLeft: '10px' }}>
          🎮 Oyunlar
        </h2>
        <div className="grid">
          <div className="card" onClick={() => navigate('/turkish/games/hangman')} data-testid="hangman-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🎯</div>
            <h2 className="card-title">Adam Asmaca</h2>
            <p className="card-description">
              İpuçlarıyla kelimeyi tahmin et!
            </p>
          </div>

          <div className="card" onClick={() => navigate('/turkish/games/word-chain')} data-testid="word-chain-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🔗</div>
            <h2 className="card-title">Kelime Türetme</h2>
            <p className="card-description">
              Son harfle başlayan kelime bul
            </p>
          </div>

          <div className="card" onClick={() => navigate('/turkish/games/punctuation')} data-testid="punctuation-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">❓</div>
            <h2 className="card-title">Noktalama Oyunu</h2>
            <p className="card-description">
              Doğru noktalama işaretlerini öğren
            </p>
          </div>

          <div className="card" onClick={() => navigate('/turkish/games/fiilimsa')} data-testid="fiilimsa-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🎓</div>
            <h2 className="card-title">Fiilimsi Tanıma</h2>
            <p className="card-description">
              Sıfat-fiil, zarf-fiil, isim-fiil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
