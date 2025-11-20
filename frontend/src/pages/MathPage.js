import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🔢 Matematik</h1>
        <p className="subtitle">Derin düşünme ve hızlı pratik modları</p>
      </div>

      {/* Öğrenme Bölümü */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px', paddingLeft: '10px' }}>
          🧠 Öğrenme
        </h2>
        <div className="grid">
          <div className="card" onClick={() => navigate('/math/deep-think')} data-testid="deep-think-card">
            <div className="card-icon">🧠</div>
            <h2 className="card-title">Derin Düşünme Modu</h2>
            <p className="card-description">
              Zaman limiti yok | %0 Hata hedefi | Çoklu AI doğrulama
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/quick-practice')} data-testid="quick-practice-card">
            <div className="card-icon">⚡</div>
            <h2 className="card-title">Hızlı Pratik</h2>
            <p className="card-description">
              Zamana karşı yarış! Temel matematik işlemleri
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/calculator')} data-testid="calculator-card">
            <div className="card-icon">🔬</div>
            <h2 className="card-title">Bilimsel Hesap Makinesi</h2>
            <p className="card-description">
              Türev, integral, matris, grafik çizimi
            </p>
          </div>
        </div>
      </div>

      {/* Oyunlar Bölümü */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px', paddingLeft: '10px' }}>
          🎮 Oyunlar
        </h2>
        <div className="grid">
          <div className="card" onClick={() => navigate('/math/games/basic-ops')} data-testid="basic-ops-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🔢</div>
            <h2 className="card-title">Dört İşlem</h2>
            <p className="card-description">
              Toplama, çıkarma, çarpma, bölme pratikleri
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/games/number-guess')} data-testid="number-guess-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🎲</div>
            <h2 className="card-title">Sayı Tahmin Oyunu</h2>
            <p className="card-description">
              1-100 arası sayıyı 7 denemede bul!
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/games/pattern')} data-testid="pattern-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🎯</div>
            <h2 className="card-title">Örüntü Bulma</h2>
            <p className="card-description">
              Sayı dizilerindeki örüntüleri keşfet
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/games/polynomial-arena')} data-testid="polynomial-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">📐</div>
            <h2 className="card-title">Polinom Arena</h2>
            <p className="card-description">
              Polinomları çarpımlara ayır ve puan kazan!
            </p>
          </div>

          <div className="card" onClick={() => navigate('/math/games/sudoku')} data-testid="sudoku-card" style={{ cursor: 'pointer' }}>
            <div className="card-icon">🧩</div>
            <h2 className="card-title">Sudoku</h2>
            <p className="card-description">
              Klasik 9x9 sudoku bulmacası
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
